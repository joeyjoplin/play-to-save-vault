// src/hooks/useWallet.ts
// Conexão com Freighter seguindo o guia oficial:
// - isConnected(): detecta extensão
// - isAllowed()/setAllowed(): autoriza o dapp
// - requestAccess(): retorna { address } (pede login/autorização se necessário)
// - getAddress(): retorna { address } (vazio se não autorizado/conectado)
// - getNetworkDetails(): rede/passphrase/urls
// - WatchWalletChanges: observa trocas de conta/rede sem precisar de polling pesado
//
// Docs: https://docs.freighter.app/docs/guide/usingFreighterWebApp

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetworkDetails,
  WatchWalletChanges,
} from "@stellar/freighter-api";

export type WalletState = {
  hasFreighter: boolean;
  walletConnected: boolean; // se temos um endereço autorizado
  walletAddress?: string;
  networkPassphrase?: string;
  networkName?: string;
  networkUrl?: string;
  sorobanRpcUrl?: string;
  error?: string;
  allowed?: boolean;
};

const EXPECTED_PASSPHRASE =
  import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ||
  "Test SDF Network ; September 2015";
const EXPECTED_NAME =
  import.meta.env.VITE_STELLAR_NETWORK_NAME || "TESTNET";

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    hasFreighter: false,
    walletConnected: false,
  });

  const watcherRef = useRef<InstanceType<typeof WatchWalletChanges> | null>(
    null
  );

  const refresh = useCallback(async () => {
    try {
      // 1) Extensão instalada?
      const conn = await isConnected();
      const hasFreighter = !!conn && (conn as any).isConnected === true;

      // 2) App autorizado?
      const allowRes = hasFreighter ? await isAllowed() : ({ isAllowed: false } as any);
      const allowed = !!allowRes?.isAllowed;

      // 3) Endereço atual (vazio se não autorizado/logado)
      let walletAddress: string | undefined;
      if (hasFreighter) {
        const addrObj = await getAddress();
        if (addrObj && typeof addrObj.address === "string" && addrObj.address.length > 0) {
          walletAddress = addrObj.address;
        }
      }

      // 4) Rede/Passphrase/URLs
      let networkName: string | undefined;
      let networkPassphrase: string | undefined;
      let networkUrl: string | undefined;
      let sorobanRpcUrl: string | undefined;
      if (hasFreighter) {
        const net = await getNetworkDetails();
        if (!("error" in net)) {
          networkName = net.network;
          networkPassphrase = net.networkPassphrase;
          networkUrl = net.networkUrl;
          sorobanRpcUrl = net.sorobanRpcUrl;
        }
      }

      setState({
        hasFreighter,
        allowed,
        walletConnected: !!walletAddress,
        walletAddress,
        networkPassphrase,
        networkName,
        networkUrl,
        sorobanRpcUrl,
      });
    } catch (e: any) {
      setState((s) => ({
        ...s,
        error: e?.message ?? String(e),
      }));
    }
  }, []);

  useEffect(() => {
    // Primeiro refresh imediato
    refresh();

    // Ativa Watcher de mudanças (conta/rede)
    if (!watcherRef.current) {
      watcherRef.current = new WatchWalletChanges(1000); // 1s
      watcherRef.current.watch(() => {
        // Emite somente quando algo muda; basta refazer o refresh
        refresh();
      });
    }
    return () => {
      watcherRef.current?.stop();
      watcherRef.current = null;
    };
  }, [refresh]);

  const connectWallet = useCallback(async () => {
    try {
      // Se ainda não está na allowlist, podemos chamar setAllowed() para abrir o modal de permissão
      const allowRes = await isAllowed();
      if (!allowRes?.isAllowed) {
        const res = await setAllowed();
        if (!res?.isAllowed) {
          throw new Error("Permissão negada no Freighter.");
        }
      }
      // Agora pedimos acesso (retorna { address })
      const access = await requestAccess();
      if (access?.error) throw new Error(access.error);
      if (!access?.address) {
        throw new Error(
          "Endereço vazio. Abra o Freighter e faça login, depois tente novamente."
        );
      }
      await refresh();
      return true;
    } catch (e: any) {
      setState((s) => ({ ...s, error: e?.message ?? String(e) }));
      return false;
    }
  }, [refresh]);

  const disconnectWallet = useCallback(async () => {
    // Freighter não expõe "disconnect" programático.
    // Limpa estado local; usuário pode revogar na extensão se desejar.
    setState((s) => ({
      ...s,
      walletConnected: false,
      walletAddress: undefined,
    }));
  }, []);

  const wrongNetwork = useMemo(() => {
    if (!state.networkPassphrase) return false;
    return state.networkPassphrase !== EXPECTED_PASSPHRASE;
  }, [state.networkPassphrase]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    refresh,
    wrongNetwork,
    expected: { passphrase: EXPECTED_PASSPHRASE, name: EXPECTED_NAME },
  };
}

