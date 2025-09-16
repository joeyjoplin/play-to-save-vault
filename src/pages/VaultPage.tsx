// src/pages/VaultPage.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, TrendingDown, TrendingUp, Vault } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DepositModal } from "@/components/vault/DepositModal";
import { WithdrawModal } from "@/components/vault/WithdrawModal";
import { useVaultBalance, useVaultActions, useMinVaultBalance } from "@/hooks/useVault";

const APR_UI = 6.9; // illustrativo

export default function VaultPage() {
  const { toast } = useToast();
  // quando plugar carteira, passe o address aqui (ex.: useWallet().walletAddress)
  const { data: balance = 0, isFetching } = useVaultBalance(undefined);
  const { deposit, withdraw } = useVaultActions(undefined);
  const minVaultBalance = useMinVaultBalance();
  const isActive = useMemo(() => (balance ?? 0) >= minVaultBalance, [balance, minVaultBalance]);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  async function handleDeposit(amount: number) {
    console.debug("[VaultPage] deposit click", { amount });
    try {
      if (!Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be > 0");
      await deposit.mutateAsync(amount);
      toast({
        title: "Deposit successful",
        description: `Added ${amount} to your vault.`,
      });
    } catch (e: any) {
      console.error("[VaultPage] deposit error:", e);
      toast({
        title: "Deposit failed",
        description: e?.message ?? String(e),
        variant: "destructive",
      });
    } finally {
      setIsDepositOpen(false);
    }
  }

  async function handleWithdraw(amount: number) {
    console.debug("[VaultPage] withdraw click", { amount });
    try {
      if (!Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be > 0");
      await withdraw.mutateAsync(amount);
      toast({
        title: "Withdrawal successful",
        description: `Withdrew ${amount} from your vault.`,
      });
    } catch (e: any) {
      console.error("[VaultPage] withdraw error:", e);
      toast({
        title: "Withdrawal failed",
        description: e?.message ?? String(e),
        variant: "destructive",
      });
    } finally {
      setIsWithdrawOpen(false);
    }
  }

  const maxWithdraw = balance;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Your Vault
        </h1>
        <p className="text-muted-foreground mt-2">
          Save to play. Withdraw anytime.
        </p>
      </div>

      {/* Status */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Vault className="w-5 h-5 text-accent" /> Vault Overview
          </CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "ACTIVE" : "LOCKED"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-2xl font-bold text-accent">
                {isFetching ? "…" : `${balance.toFixed(2)}`}
              </p>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">APR (illustrative)</p>
              <p className="text-2xl font-bold">{APR_UI}%</p>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setIsDepositOpen(true)}
              disabled={deposit.isPending}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {deposit.isPending ? "Depositing..." : "Deposit"}
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsWithdrawOpen(true)}
              disabled={withdraw.isPending || balance <= 0}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              {withdraw.isPending ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>

          {!isActive && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
              <p>
                Deposit at least <span className="text-accent">{minVaultBalance}</span> to unlock the game.
              </p>
            </div>
          )}

         
        </CardContent>
      </Card>

      {/* Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleDeposit}
        isSubmitting={deposit.isPending}
        currentBalance={balance}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onWithdraw={handleWithdraw}
        isSubmitting={withdraw.isPending}
        currentBalance={balance}
        maxWithdraw={maxWithdraw}
      />
    </div>
  );
}

