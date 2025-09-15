import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Coins, TrendingUp, TrendingDown, Vault, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DepositModal } from "@/components/vault/DepositModal";
import { WithdrawModal } from "@/components/vault/WithdrawModal";

// TODO: Replace with actual balance from React Query + Soroban contract
const mockBalance = 12.5; // XLM
const minVaultBalance = 10; // TODO: Get from env var MIN_VAULT_XLM
const isActive = mockBalance >= minVaultBalance;

const mockTransactions = [
  { id: "1", type: "deposit", amount: 5.0, date: "2024-01-15", hash: "G2X..." },
  { id: "2", type: "withdraw", amount: 2.5, date: "2024-01-14", hash: "H3Y..." },
  { id: "3", type: "deposit", amount: 10.0, date: "2024-01-13", hash: "J4Z..." },
];

export default function VaultPage() {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async (amount: number) => {
    // TODO: Implement Soroban contract deposit (approve + deposit)
    console.log("TODO: Deposit", amount, "XLM to FeeVault contract");
    
    toast({
      title: "Deposit Initiated",
      description: `Depositing ${amount} XLM to your vault...`,
    });
    
    setIsDepositOpen(false);
  };

  const handleWithdraw = async (amount: number) => {
    // TODO: Implement Soroban contract withdraw
    console.log("TODO: Withdraw", amount, "XLM from FeeVault contract");
    
    toast({
      title: "Withdrawal Initiated", 
      description: `Withdrawing ${amount} XLM from your vault...`,
    });
    
    setIsWithdrawOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Your Vault
        </h1>
        <p className="text-muted-foreground mt-2">
          Secure Stellar storage for gaming rewards
        </p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-4 rounded-2xl ${isActive ? 'bg-success/20 shadow-glow' : 'bg-warning/20'}`}>
              <Vault className={`w-12 h-12 ${isActive ? 'text-success' : 'text-warning'}`} />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-accent" />
              <span className="text-4xl font-bold">{mockBalance.toFixed(2)}</span>
              <span className="text-xl font-semibold text-muted-foreground">XLM</span>
            </div>
            
            <Badge 
              variant={isActive ? "default" : "secondary"}
              className={`${isActive ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'} text-white`}
            >
              {isActive ? (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  ACTIVE
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  LOCKED
                </>
              )}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isActive && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm text-warning font-medium text-center">
                Deposit at least {minVaultBalance} XLM to unlock gaming features
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="crypto" 
              size="lg"
              onClick={() => setIsDepositOpen(true)}
              className="font-semibold"
            >
              <TrendingUp className="w-4 h-4" />
              Deposit
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsWithdrawOpen(true)}
              disabled={mockBalance <= 0}
            >
              <TrendingDown className="w-4 h-4" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockTransactions.map((tx, index) => (
            <div key={tx.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-success/20' : 'bg-destructive/20'}`}>
                    {tx.type === 'deposit' ? (
                      <TrendingUp className={`w-4 h-4 text-success`} />
                    ) : (
                      <TrendingDown className={`w-4 h-4 text-destructive`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{tx.type}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'deposit' ? 'text-success' : 'text-destructive'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} XLM
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.hash}</p>
                </div>
              </div>
              {index < mockTransactions.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals */}
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)}
        onDeposit={handleDeposit}
        currentBalance={mockBalance}
      />
      
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)} 
        onWithdraw={handleWithdraw}
        currentBalance={mockBalance}
        maxWithdraw={mockBalance}
      />
    </div>
  );
}