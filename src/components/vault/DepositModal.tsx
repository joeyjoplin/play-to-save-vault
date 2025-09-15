import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, TrendingUp, Info } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  currentBalance: number;
}

export function DepositModal({ isOpen, onClose, onDeposit, currentBalance }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    
    if (depositAmount <= 0) return;

    setIsLoading(true);
    try {
      await onDeposit(depositAmount);
      setAmount("");
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [5, 10, 25, 50];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border/50">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-3 rounded-xl shadow-glow">
              <Coins className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Deposit XLM</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-xl font-bold text-accent">{currentBalance.toFixed(2)} XLM</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount to Deposit</Label>
              <div className="relative mt-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter XLM amount"
                  className="pr-12"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-muted-foreground font-medium">XLM</span>
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <Label className="text-sm text-muted-foreground">Quick Select</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="text-xs"
                  >
                    {quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary">Transaction Details</p>
                  <p className="text-muted-foreground mt-1">
                    This will approve and deposit XLM to your FeeVault contract.
                    Requires wallet approval for both operations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="crypto" 
                disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {isLoading ? "Processing..." : "Deposit"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}