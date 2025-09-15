import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown, Wallet, Info } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  currentBalance: number;
  maxWithdraw: number;
}

export function WithdrawModal({ 
  isOpen, 
  onClose, 
  onWithdraw, 
  currentBalance, 
  maxWithdraw 
}: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount <= 0 || withdrawAmount > maxWithdraw) return;

    setIsLoading(true);
    try {
      await onWithdraw(withdrawAmount);
      setAmount("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(maxWithdraw.toString());
  };

  const withdrawAmount = parseFloat(amount) || 0;
  const remainingBalance = currentBalance - withdrawAmount;
  const isValidAmount = withdrawAmount > 0 && withdrawAmount <= maxWithdraw;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border/50">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/20 p-3 rounded-xl">
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Withdraw XLM</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/20 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="text-lg font-bold text-accent">{currentBalance.toFixed(2)}</p>
            </div>
            <div className="bg-muted/20 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">After Withdrawal</p>
              <p className="text-lg font-bold">{remainingBalance.toFixed(2)}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="amount">Withdrawal Amount</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleMaxClick}
                  className="text-xs h-auto p-1"
                >
                  MAX
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  min="0"
                  max={maxWithdraw}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter XLM amount"
                  className="pr-12"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-sm text-muted-foreground font-medium">XLM</span>
                </div>
              </div>
              {!isValidAmount && amount && (
                <p className="text-sm text-destructive mt-1">
                  Amount must be between 0.1 and {maxWithdraw.toFixed(2)} XLM
                </p>
              )}
            </div>

            {/* Warning Box */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning">Important</p>
                  <p className="text-muted-foreground mt-1">
                    Withdrawals are processed on the Stellar network. 
                    Make sure you have enough XLM for network fees.
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
                variant="destructive" 
                disabled={!isValidAmount || isLoading}
                className="flex-1"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isLoading ? "Processing..." : "Withdraw"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}