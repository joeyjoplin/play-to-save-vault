// src/lib/vault.ts
// Integração Soroban + Freighter com o contrato "fee-vault".
// Usa Server.prepareTransaction (SDK atual) em vez de rpc.Api.prepareTransaction.
//
// Doc: rpc.Server#prepareTransaction (simula e aplica footprint/fees/autorização)
// https://stellar.github.io/js-stellar-sdk/module-rpc.Server.html  (método prepareTransaction)
// Se preferir montar manualmente, use rpc.assembleTransaction(tx, sim).
//
// Saldo: get_underlying_tokens(reserve, user) -> i128

import {
    rpc,
    Contract,
    Address as SorobanAddress,
    nativeToScVal,
    scValToNative,
    TransactionBuilder,
    BASE_FEE,
    Networks,
  } from "@stellar/stellar-sdk";
  import {
    getAddress,
    requestAccess,
    getNetworkDetails,
    signTransaction,
  } from "@stellar/freighter-api";
  
  export type Address = string;
  
  const USE_MOCK =
    String(import.meta.env.VITE_USE_MOCK_VAULT ?? "false") === "true";
  const MIN_BALANCE_DEFAULT = Number(import.meta.env.VITE_MIN_VAULT_XLM ?? 10);
  const RPC_URL = String(
    import.meta.env.VITE_STELLAR_RPC_URL || import.meta.env.VITE_RPC_URL || ""
  );
  const CONTRACT_ID = String(
    import.meta.env.VITE_FEE_VAULT_CONTRACT || import.meta.env.VITE_FEE_VAULT || ""
  );
  const RESERVE_ADDRESS = String(
    import.meta.env.VITE_RESERVE_ADDRESS || import.meta.env.VITE_RESERVE_ADDR || ""
  );
  const DECIMALS = Number(
    import.meta.env.VITE_TOKEN_DECIMALS ??
      import.meta.env.VITE_USDC_DECIMALS ??
      7
  );
  
  const STORAGE_KEY = "vault_balance_v1";
  
  // ---------------- Mock ----------------
  function readMock(): number {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? Math.max(0, Number(JSON.parse(raw))) : 0;
    } catch {
      return 0;
    }
  }
  function writeMock(v: number) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Number(v.toFixed(7))));
  }
  
  // ---------------- Helpers --------------
  const onClient = typeof window !== "undefined";
  function assertHttpsUrl(url: string) {
    if (!/^https:\/\//i.test(url)) throw new Error("RPC URL must be HTTPS");
  }
  function resolvePassphrase(networkPassphrase?: string) {
    return networkPassphrase || Networks.TESTNET;
  }
  function toScaledI128BigInt(uiAmount: number, decimals: number): bigint {
    if (!Number.isFinite(uiAmount)) throw new Error("Invalid uiAmount");
    const s = String(uiAmount);
    const [intPart, fracRaw = ""] = s.split(".");
    const frac = (fracRaw + "0".repeat(decimals)).slice(0, decimals);
    const sign = s.trim().startsWith("-") ? "-" : "";
    const core =
      `${intPart.replace("-", "")}${frac}`.replace(/^0+(?=\d)/, "") || "0";
    return BigInt(sign + core);
  }
  function i128ToUiNumber(i128: bigint, decimals: number): number {
    const sign = i128 < 0n ? -1 : 1;
    const abs = i128 < 0n ? -i128 : i128;
    const scale = 10n ** BigInt(decimals);
    const intPart = abs / scale;
    const fracPart = abs % scale;
    const fracStr = fracPart.toString().padStart(decimals, "0");
    const str = `${intPart.toString()}.${fracStr}`;
    return sign * parseFloat(str);
  }
  async function trySimulate(server: rpc.Server, tx: any) {
    const sim = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationSuccess(sim)) return { ok: true as const, sim };
    return { ok: false as const, sim };
  }
  export async function waitForTx(
    server: rpc.Server,
    hash: string,
    {
      timeoutMs = 90_000,
      intervalMs = 1_500,
    }: { timeoutMs?: number; intervalMs?: number } = {}
  ) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        const tx = await server.getTransaction(hash);
        if (tx?.status === "SUCCESS") return tx;
        if (tx?.status === "FAILED")
          throw new Error(`Tx failed: ${tx?.resultXdr ?? tx?.status}`);
      } catch {}
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error("Timeout waiting for transaction confirmation");
  }
  
  async function getUserAddressOrRequest(): Promise<string> {
    let addrObj: any = await getAddress().catch(() => null);
    let addr = addrObj?.address || "";
    if (!addr) {
      const access = await requestAccess();
      if (access?.error) throw new Error(access.error);
      addr = access?.address || "";
    }
    if (!addr) throw new Error("Wallet not connected. Login in Freighter.");
    return addr.trim();
  }
  
  // ---------------- Chain calls (fee-vault) ----------------
  
  /** get_underlying_tokens(reserve, user) -> i128 */
  async function fetchUnderlyingBalance({
    rpcUrl,
    contractId,
    reserveAddress,
    decimals = DECIMALS,
  }: {
    rpcUrl: string;
    contractId: string;
    reserveAddress: string;
    decimals?: number;
  }): Promise<{ uiAmount: number; rawI128: string }> {
    if (!onClient) throw new Error("Must run in browser.");
    assertHttpsUrl(rpcUrl);
    if (!contractId) throw new Error("Missing contractId");
    if (!reserveAddress) throw new Error("Missing reserveAddress");
  
    const server = new rpc.Server(rpcUrl, { allowHttp: false });
    const user = await getUserAddressOrRequest();
  
    const freighterNet = await getNetworkDetails().catch(() => ({} as any));
    const networkPassphrase = resolvePassphrase(
      (freighterNet as any)?.networkPassphrase
    );
  
    const source = await server.getAccount(user);
    const contract = new Contract(contractId);
    const reserveScVal = SorobanAddress.fromString(reserveAddress).toScVal();
    const userScVal = SorobanAddress.fromString(user).toScVal();
  
    const op = contract.call("get_underlying_tokens", reserveScVal, userScVal);
  
    let tx = new TransactionBuilder(source, { fee: BASE_FEE.toString() })
      .setNetworkPassphrase(networkPassphrase)
      .addOperation(op)
      .setTimeout(60)
      .build();
  
    const sim = await server.simulateTransaction(tx);
    if (!rpc.Api.isSimulationSuccess(sim)) {
      throw new Error(
        `Simulation failed: ${sim.error?.message ?? JSON.stringify(sim)}`
      );
    }
    const ret = sim.result?.retval;
    const raw = (scValToNative(ret) as any) ?? "0";
    const asBig = typeof raw === "bigint" ? raw : BigInt(String(raw));
    const uiAmount = i128ToUiNumber(asBig, decimals);
    return { uiAmount, rawI128: asBig.toString() };
  }
  
  /** deposit(reserve, user, amount:i128) -> i128 */
  async function depositToFeeVault({
    rpcUrl,
    contractId,
    reserveAddress,
    uiAmount,
    decimals = DECIMALS,
  }: {
    rpcUrl: string;
    contractId: string;
    reserveAddress: string;
    uiAmount: number;
    decimals?: number;
  }) {
    if (!onClient) throw new Error("Must run in browser.");
    assertHttpsUrl(rpcUrl);
    if (!contractId) throw new Error("Missing contractId");
    if (!reserveAddress) throw new Error("Missing reserveAddress");
    if (!uiAmount || uiAmount <= 0) throw new Error("Amount must be > 0");
  
    const server = new rpc.Server(rpcUrl, { allowHttp: false });
  
    const user = await getUserAddressOrRequest();
    const freighterNet = await getNetworkDetails().catch(() => ({} as any));
    const networkPassphrase = resolvePassphrase(
      (freighterNet as any)?.networkPassphrase
    );
    const source = await server.getAccount(user);
  
    const scaled = toScaledI128BigInt(uiAmount, decimals);
    const amountScVal = nativeToScVal(scaled.toString(), { type: "i128" as const });
    const reserveScVal = SorobanAddress.fromString(reserveAddress).toScVal();
    const userScVal = SorobanAddress.fromString(user).toScVal();
  
    const contract = new Contract(contractId);
    const op = contract.call("deposit", reserveScVal, userScVal, amountScVal);
  
    let tx = new TransactionBuilder(source, { fee: BASE_FEE.toString() })
      .setNetworkPassphrase(networkPassphrase)
      .addOperation(op)
      .setTimeout(60)
      .build();
  
    // ✅ SDK atual: deixe o Server simular e aplicar footprint/fees/auth.
    const prepared = await server.prepareTransaction(tx); // <- substitui rpc.Api.prepareTransaction
  
    const signed = await signTransaction(prepared.toXDR(), {
      networkPassphrase,
    } as any);
    const anyRes = signed as any;
    const signedXdr: string | undefined =
      typeof signed === "string"
        ? signed
        : anyRes?.signedTxXdr || anyRes?.envelopeXdr || anyRes?.xdr;
    if (!signedXdr) throw new Error("Freighter returned non-string XDR");
  
    const signedTx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
    const send = await server.sendTransaction(signedTx);
    if (!send?.hash) throw new Error(`Send failed: ${JSON.stringify(send)}`);
  
    const final = await waitForTx(server, send.hash);
    if (final.status !== "SUCCESS")
      throw new Error(`Tx not successful: ${final.status}`);
    return { hash: send.hash, result: final };
  }
  
  /** withdraw(reserve, user, amount:i128) -> i128 */
  async function withdrawFromFeeVault({
    rpcUrl,
    contractId,
    reserveAddress,
    uiAmount,
    decimals = DECIMALS,
  }: {
    rpcUrl: string;
    contractId: string;
    reserveAddress: string;
    uiAmount: number;
    decimals?: number;
  }) {
    if (!onClient) throw new Error("Must run in browser.");
    assertHttpsUrl(rpcUrl);
    if (!contractId) throw new Error("Missing contractId");
    if (!reserveAddress) throw new Error("Missing reserveAddress");
    if (!uiAmount || uiAmount <= 0) throw new Error("Amount must be > 0");
  
    const server = new rpc.Server(rpcUrl, { allowHttp: false });
  
    const user = await getUserAddressOrRequest();
    const freighterNet = await getNetworkDetails().catch(() => ({} as any));
    const networkPassphrase = resolvePassphrase(
      (freighterNet as any)?.networkPassphrase
    );
    const source = await server.getAccount(user);
  
    let amountInt = toScaledI128BigInt(uiAmount, decimals);
    if (amountInt <= 0n) throw new Error("Scaled amount must be > 0");
  
    const reserveScVal = SorobanAddress.fromString(reserveAddress).toScVal();
    const userScVal = SorobanAddress.fromString(user).toScVal();
    const contract = new Contract(contractId);
  
    const buildTx = (amt: bigint) => {
      const amountScVal = nativeToScVal(amt.toString(), { type: "i128" as const });
      const op = contract.call("withdraw", reserveScVal, userScVal, amountScVal);
      return new TransactionBuilder(source, { fee: BASE_FEE.toString() })
        .setNetworkPassphrase(networkPassphrase)
        .addOperation(op)
        .setTimeout(60)
        .build();
    };
  
    // simulamos e ajustamos se necessário só para feedback rápido
    let tx = buildTx(amountInt);
    let simRes = await trySimulate(server, tx);
    let tries = 0;
    while (!simRes.ok && tries < 5) {
      amountInt = amountInt - 1n;
      tx = buildTx(amountInt);
      simRes = await trySimulate(server, tx);
      tries++;
    }
    if (!simRes.ok) throw new Error("Simulation failed for withdraw");
  
    // ✅ prepara com o Server (aplica footprint/fees/auth)
    const prepared = await server.prepareTransaction(tx);
  
    const signed = await signTransaction(prepared.toXDR(), {
      networkPassphrase,
    } as any);
    const anyRes = signed as any;
    const signedXdr: string | undefined =
      typeof signed === "string"
        ? signed
        : anyRes?.signedTxXdr || anyRes?.envelopeXdr || anyRes?.xdr;
    if (!signedXdr) throw new Error("Freighter returned non-string XDR");
  
    const signedTx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
    const send = await server.sendTransaction(signedTx);
    if (!send?.hash) throw new Error(`Send failed: ${JSON.stringify(send)}`);
  
    const final = await waitForTx(server, send.hash);
    if (final.status !== "SUCCESS")
      throw new Error(`Tx not successful: ${final.status}`);
    return { hash: send.hash, result: final, usedAmountI128: amountInt.toString() };
  }
  
  // ---------------- API p/ hooks/UI ----------------
  
  export async function getVaultBalance(_user?: Address): Promise<number> {
    if (USE_MOCK) return readMock();
    const { uiAmount } = await fetchUnderlyingBalance({
      rpcUrl: RPC_URL,
      contractId: CONTRACT_ID,
      reserveAddress: RESERVE_ADDRESS,
      decimals: DECIMALS,
    });
    return uiAmount;
  }
  
  export async function depositToVault(
    amount: number,
    _user?: Address
  ): Promise<{ newBalance: number }> {
    if (USE_MOCK) {
      const cur = readMock();
      const next = cur + amount;
      writeMock(next);
      return { newBalance: next };
    }
    await depositToFeeVault({
      rpcUrl: RPC_URL,
      contractId: CONTRACT_ID,
      reserveAddress: RESERVE_ADDRESS,
      uiAmount: amount,
      decimals: DECIMALS,
    });
    const { uiAmount } = await fetchUnderlyingBalance({
      rpcUrl: RPC_URL,
      contractId: CONTRACT_ID,
      reserveAddress: RESERVE_ADDRESS,
      decimals: DECIMALS,
    });
    return { newBalance: uiAmount };
  }
  
  export async function withdrawFromVault(
    amount: number,
    _user?: Address
  ): Promise<{ newBalance: number }> {
    if (USE_MOCK) {
      const cur = readMock();
      if (amount > cur) throw new Error("Amount exceeds current balance");
      const next = cur - amount;
      writeMock(next);
      return { newBalance: next };
    }
    await withdrawFromFeeVault({
      rpcUrl: RPC_URL,
      contractId: CONTRACT_ID,
      reserveAddress: RESERVE_ADDRESS,
      uiAmount: amount,
      decimals: DECIMALS,
    });
    const { uiAmount } = await fetchUnderlyingBalance({
      rpcUrl: RPC_URL,
      contractId: CONTRACT_ID,
      reserveAddress: RESERVE_ADDRESS,
      decimals: DECIMALS,
    });
    return { newBalance: uiAmount };
  }
  
  export function getMinVaultBalance(): number {
    return MIN_BALANCE_DEFAULT;
  }
  