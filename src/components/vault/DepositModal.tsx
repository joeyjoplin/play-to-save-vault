// src/components/vault/DepositModal.tsx
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
  onDeposit: (amount: number) => Promise<void> | void;
  isSubmitting?: boolean;
  currentBalance: number;
};

export function DepositModal({
  isOpen,
  onClose,
  onDeposit,
  isSubmitting = false,
  currentBalance,
}: Props) {
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (!isOpen) setAmount("");
  }, [isOpen]);

  const parsed = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const disabled = isSubmitting || !Number.isFinite(parsed) || parsed <= 0;

  const handleConfirm = async () => {
    if (disabled) return;
    await onDeposit(parsed);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Deposit</DialogTitle>
          <DialogDescription>
            Current balance: <strong>{currentBalance.toFixed(2)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Amount</Label>
          <Input
            id="deposit-amount"
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
          <p className="text-xs text-muted-foreground">
            Use decimal format. Example: <code>10</code> or <code>1.5</code>
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={disabled}>
            {isSubmitting ? "Depositing..." : "Confirm deposit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
