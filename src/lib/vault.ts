/**
 * src/lib/vault.ts
 * Thin client-side service to abstract the "lending pool / fee vault" integration.
 * It ships with a safe localStorage mock so the app works out-of-the-box.
 * Later, swap the internals for real chain calls (Soroban / Base / PoolParty).
 */

export type Address = string;

const MIN_BALANCE_DEFAULT = Number(import.meta.env.VITE_MIN_VAULT_XLM ?? 10);
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_VAULT ?? 'true') === 'true';

const STORAGE_KEY = 'vault_balance_v1';

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

/**
 * Read current vault balance for the connected user.
 * Replace this with an on-chain read (e.g., contract `balanceOf(address)`).
 */
export async function getVaultBalance(_user?: Address): Promise<number> {
  if (USE_MOCK) {
    return readMock();
  }
  // TODO: Implement real chain read here.
  // Example (Soroban):
  // const res = await contractClient.balanceOf(userAddress);
  // return Number(res) / 1e7;
  throw new Error('Real chain read not implemented. Set VITE_USE_MOCK_VAULT=true for local mock.');
}

/**
 * Deposit into the vault (mock). Replace with contract call.
 */
export async function depositToVault(amount: number, _user?: Address): Promise<{ newBalance: number }> {
  if (amount <= 0 || !Number.isFinite(amount)) throw new Error('Invalid deposit amount');
  if (USE_MOCK) {
    const cur = readMock();
    const next = cur + amount;
    writeMock(next);
    return { newBalance: next };
  }
  // TODO: Implement real chain tx
  throw new Error('Real chain deposit not implemented');
}

/**
 * Withdraw from the vault (mock). Replace with contract call.
 */
export async function withdrawFromVault(amount: number, _user?: Address): Promise<{ newBalance: number }> {
  if (amount <= 0 || !Number.isFinite(amount)) throw new Error('Invalid withdraw amount');
  if (USE_MOCK) {
    const cur = readMock();
    if (amount > cur) throw new Error('Amount exceeds current balance');
    const next = cur - amount;
    writeMock(next);
    return { newBalance: next };
  }
  // TODO: Implement real chain tx
  throw new Error('Real chain withdraw not implemented');
}

/** Minimum balance required to unlock the game */
export function getMinVaultBalance(): number {
  return MIN_BALANCE_DEFAULT;
}
