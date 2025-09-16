// src/components/vault/WithdrawModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => Promise<void> | void;
  isSubmitting?: boolean;
  currentBalance: number;
  maxWithdraw: number;
};

export function WithdrawModal({
  isOpen,
  onClose,
  onWithdraw,
  isSubmitting = false,
  currentBalance,
  maxWithdraw,
}: Props) {
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (!isOpen) setAmount("");
  }, [isOpen]);

  const parsed = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const overMax = Number.isFinite(parsed) && parsed > maxWithdraw;
  const disabled =
    isSubmitting || !Number.isFinite(parsed) || parsed <= 0 || overMax;

  const handleConfirm = async () => {
    if (disabled) return;
    await onWithdraw(parsed);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Withdraw</DialogTitle>
          <DialogDescription>
            Current balance: <strong>{currentBalance.toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="withdraw-amount">Amount</Label>
          <Input
            id="withdraw-amount"
            type="number"
            step="0.0000001"
            min="0"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Max: {maxWithdraw.toFixed(2)}</span>
            {overMax && <span className="text-red-500">Exceeds max</span>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={disabled}>
            {isSubmitting ? "Withdrawing..." : "Confirm withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
