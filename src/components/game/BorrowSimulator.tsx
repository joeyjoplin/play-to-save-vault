// src/components/game/BorrowSimulator.tsx
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

/**
 * Empréstimo com colateral:
 * - HF = (Collateral_Value * liqThreshold) / Debt_Value
 * - Se HF < 1 => sujeito a liquidação.
 * - Juros do empréstimo: borrowAPR = base + k * U
 */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function BorrowSimulator() {
  // pool
  const [totalLiquidity, setTotalLiquidity] = useState(1000);
  const [totalBorrow,   setTotalBorrow]   = useState(500);

  // usuário
  const [collateralUSD, setCollateralUSD] = useState(200);
  const [borrowUSD, setBorrowUSD] = useState(100);
  const [liqThreshold, setLiqThreshold] = useState(0.8); // 80%

  const baseAPR = 0.02;
  const k = 0.18;

  const util = useMemo(() => clamp(totalBorrow / Math.max(totalLiquidity, 1e-9), 0, 0.9999), [totalLiquidity, totalBorrow]);
  const borrowAPR = useMemo(() => baseAPR + k * util, [util]);

  const healthFactor = useMemo(() => {
    const nom = collateralUSD * liqThreshold;
    const den = Math.max(borrowUSD, 1e-9);
    return nom / den;
  }, [collateralUSD, borrowUSD, liqThreshold]);

  const borrowInterestYear = borrowUSD * borrowAPR;

  const status =
    healthFactor < 1 ? "⚠️ Risco de liquidação" :
    healthFactor < 1.2 ? "🟠 Zona de atenção" : "🟢 Seguro";

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardContent className="space-y-4 p-4">
          <h3 className="font-semibold">Parâmetros da Pool</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Total Liquidity</Label>
              <Input type="number" min="0" value={totalLiquidity} onChange={(e) => setTotalLiquidity(Number(e.target.value || 0))} />
            </div>
            <div>
              <Label>Total Borrow</Label>
              <Input type="number" min="0" value={totalBorrow} onChange={(e) => setTotalBorrow(Number(e.target.value || 0))} />
            </div>
            <div>
              <Label>Utilization (U)</Label>
              <div className="text-lg font-mono">{(util * 100).toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="space-y-4 p-4">
          <h3 className="font-semibold">Seu Empréstimo</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>Collateral (USD)</Label>
              <Input type="number" min="0" value={collateralUSD} onChange={(e) => setCollateralUSD(Number(e.target.value || 0))} />
            </div>
            <div>
              <Label>Borrow (USD)</Label>
              <Input type="number" min="0" value={borrowUSD} onChange={(e) => setBorrowUSD(Number(e.target.value || 0))} />
            </div>
            <div className="md:col-span-2">
              <Label>Liquidation Threshold: {(liqThreshold * 100).toFixed(0)}%</Label>
              <Slider
                value={[Math.round(liqThreshold * 100)]}
                onValueChange={(v) => setLiqThreshold(v[0] / 100)}
                min={50}
                max={95}
                step={1}
              />
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-3 gap-4">
            <Stat label="Borrow APR" value={(borrowAPR * 100).toFixed(2) + "%"} />
            <Stat label="Juros em 1 ano" value={borrowInterestYear.toFixed(2)} />
            <Stat label="Health Factor" value={healthFactor.toFixed(2)} emphasis />
          </div>

          <div className={`mt-2 text-sm ${healthFactor < 1 ? "text-red-500" : healthFactor < 1.2 ? "text-yellow-500" : "text-green-600"}`}>
            {status}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-semibold ${emphasis ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}
