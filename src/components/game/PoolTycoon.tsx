// src/components/game/PoolTycoon.tsx
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/**
 * Pool Tycoon (12 short rounds ≈ 1 minute)
 * Each round, pick one action:
 *  - Attract Deposits (+liquidity, lowers U, lowers APR)
 *  - Promote Borrowing (+borrow, raises U, raises APR)
 *  - Increase Reserve Factor (+safety, lowers lender APY)
 *  - Risk Audit (reduce default risk for a few rounds)
 *
 * Random events can cause defaults when U is high and safety is low.
 * Goal: finish profitable with healthy utilization.
 */

type Props = { onExit?: () => void };

export default function PoolTycoon({ onExit }: Props) {
  // State
  const [round, setRound] = useState(1);
  const [liquidity, setLiquidity] = useState(1_000); // total deposits
  const [borrow, setBorrow] = useState(600); // outstanding loans
  const [resFactor, setResFactor] = useState(0.1); // 10% protocol cut
  const [safety, setSafety] = useState(0.5); // 0..1 (affects default chance)
  const [profit, setProfit] = useState(0); // protocol profit
  const [msg, setMsg] = useState<string>("Welcome! Balance utilization to grow safely.");

  // Derived
  const U = useMemo(() => Math.min(0.999, borrow / Math.max(1, liquidity)), [borrow, liquidity]);
  const borrowAPR = useMemo(() => 0.02 + 0.18 * U, [U]);        // 2%..20%
  const lendAPR = useMemo(() => borrowAPR * U * (1 - resFactor), [borrowAPR, U, resFactor]);

  // Simple “month” tick resolve
  function resolveRound(nextMsg: string) {
    // protocol takes resFactor cut on the interest paid by borrowers
    const interestPaid = borrow * borrowAPR * (1 / 12);
    const interestToLenders = interestPaid * (1 - resFactor);
    const protocolCut = interestPaid - interestToLenders;
    setProfit((p) => p + protocolCut);

    // defaults chance rises with U and low safety
    const defaultChance = Math.max(0, U - 0.6) * (0.7 - Math.min(0.6, safety)) * 1.2;
    const roll = Math.random();
    if (roll < defaultChance) {
      const loss = Math.min(borrow * 0.06, borrow); // 6% chunk
      setBorrow((b) => Math.max(0, b - loss));
      setLiquidity((l) => Math.max(0, l - loss * 0.6)); // some lender loss
      nextMsg += ` | ⚠️ Default event: −${loss.toFixed(0)} borrow`;
    }

    setRound((r) => r + 1);
    setMsg(nextMsg);
  }

  // Actions
  function attractDeposits() {
    setLiquidity((l) => l + 120);
    resolveRound("📈 Attracted deposits (+120 liquidity).");
  }
  function promoteBorrowing() {
    setBorrow((b) => b + 90);
    resolveRound("🏦 Promoted borrowing (+90 borrow).");
  }
  function increaseReserveFactor() {
    setResFactor((r) => Math.min(0.3, r + 0.03));
    setSafety((s) => Math.min(1, s + 0.05));
    resolveRound("🛡️ Increased reserve factor (+3%) & safety (+0.05).");
  }
  function riskAudit() {
    setSafety((s) => Math.min(1, s + 0.12));
    resolveRound("🔎 Risk audit complete (+0.12 safety).");
  }

  const finished = round > 12;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <div>Round: <span className="font-semibold">{Math.min(12, round)}</span>/12</div>
          <div>Protocol Profit: <span className="font-semibold">{profit.toFixed(2)}</span></div>
          <div>Reserve Factor: <span className="font-semibold">{(resFactor * 100).toFixed(0)}%</span></div>
          <div>Safety: <span className="font-semibold">{(safety * 100).toFixed(0)}%</span></div>
        </div>
        <Separator className="my-3" />
        <div className="grid md:grid-cols-4 gap-3 text-sm">
          <Stat label="Liquidity" value={liquidity.toFixed(0)} />
          <Stat label="Borrow" value={borrow.toFixed(0)} />
          <Stat label="Utilization (U)" value={(U * 100).toFixed(1) + "%"} />
          <Stat label="Borrow APR" value={(borrowAPR * 100).toFixed(2) + "%"} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Lend APR (est.): <span className="font-mono">{(lendAPR * 100).toFixed(2)}%</span>
        </div>
      </div>

      {!finished ? (
        <>
          <div className="rounded-xl border bg-background/60 p-4 text-sm">
            <div className="mb-2 font-medium">Round action</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Button onClick={attractDeposits}>📈 Attract Deposits</Button>
              <Button onClick={promoteBorrowing}>🏦 Promote Borrowing</Button>
              <Button onClick={increaseReserveFactor}>🛡️ Increase Reserves</Button>
              <Button onClick={riskAudit}>🔎 Risk Audit</Button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{msg}</div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onExit}>Back</Button>
            <Button
              onClick={() => {
                // quick restart
                setRound(1);
                setLiquidity(1000);
                setBorrow(600);
                setResFactor(0.1);
                setSafety(0.5);
                setProfit(0);
                setMsg("Restarted. Aim for healthy utilization and profit!");
              }}
            >
              Restart
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border bg-background/60 p-6 text-center space-y-3">
          <div className="text-2xl font-bold">Run Complete</div>
          <div className="text-sm">
            Final Profit: <span className="font-semibold">{profit.toFixed(2)}</span>
          </div>
          <div className="text-sm">
            Utilization: <span className="font-semibold">{(U * 100).toFixed(1)}%</span> | Lend APR est.:{" "}
            <span className="font-semibold">{(lendAPR * 100).toFixed(2)}%</span>
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <Button variant="secondary" onClick={onExit}>Back</Button>
            <Button
              onClick={() => {
                setRound(1); setLiquidity(1000); setBorrow(600);
                setResFactor(0.1); setSafety(0.5); setProfit(0);
                setMsg("Restarted. Try a different strategy!");
              }}
            >
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
