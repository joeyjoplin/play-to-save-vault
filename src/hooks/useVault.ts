// src/hooks/useVault.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVaultBalance,
  depositToVault,
  withdrawFromVault,
  getMinVaultBalance,
} from "@/lib/vault";

const QK = {
  balance: (addr?: string) => ["vaultBalance", addr ?? "anon"] as const,
};

export function useVaultBalance(address?: string) {
  return useQuery({
    queryKey: QK.balance(address),
    queryFn: () => getVaultBalance(address),
    refetchOnWindowFocus: true,
    staleTime: 5_000,
  });
}

export function useVaultActions(address?: string) {
  const qc = useQueryClient();

  const deposit = useMutation({
    mutationFn: (amount: number) => depositToVault(amount, address),
    onSuccess: ({ newBalance }) => {
      qc.setQueryData(QK.balance(address), newBalance);
    },
  });

  const withdraw = useMutation({
    mutationFn: (amount: number) => withdrawFromVault(amount, address),
    onSuccess: ({ newBalance }) => {
      qc.setQueryData(QK.balance(address), newBalance);
    },
  });

  return { deposit, withdraw };
}

export function useMinVaultBalance() {
  return getMinVaultBalance();
}
