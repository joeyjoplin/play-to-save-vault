// src/components/game/HealthFactorLab.tsx
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

/**
 * Laboratório de risco:
 * - Ajuste preço do colateral, LTV máximo, haircut de liquidação.
 * - Veja HF, margem de segurança e em que preço ocorre liquidação.
 */
export default function HealthFactorLab() {
  const [collateralAmount, setCollateralAmount] = useState(10); // quantidade do colateral
  const [collateralPrice, setCollateralPrice] = useState(10);   // preço (USD)
  const [debtUSD, setDebtUSD] = useState(50);
  const [ltvMax, setLtvMax] = useState(0.75);                   // 75%
  const [liqThreshold, setLiqThreshold] = useState(0.8);        // 80%

  const collateralUSD = collateralAmount * collateralPrice;

  const hf = useMemo(() => {
    const nom = collateralUSD * liqThreshold;
    const den = Math.max(debtUSD, 1e-9);
    return nom / den;
  }, [collateralUSD, debtUSD, liqThreshold]);

  // preço de liquidação: quando HF = 1 => debt = price*amount*liqThreshold
  const liquidationPrice = useMemo(() => {
    if (collateralAmount <= 0) return 0;
    return debtUSD / (collateralAmount * liqThreshold);
  }, [collateralAmount, debtUSD, liqThreshold]);

  const ltv = useMemo(() => {
    const den = Math.max(collateralUSD, 1e-9);
    return debtUSD / den; // em fração
  }, [debtUSD, collateralUSD]);

  const okLtv = ltv <= ltvMax;

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardContent className="space-y-4 p-4">
          <h3 className="font-semibold">Parâmetros</h3>
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <Label>Colateral (amount)</Label>
              <Input type="number" min="0" value={collateralAmount} onChange={(e) => setCollateralAmount(Number(e.target.value || 0))} />
            </div>
            <div>
              <Label>Preço do colateral (USD)</Label>
              <Input type="number" min="0" value={collateralPrice} onChange={(e) => setCollateralPrice(Number(e.target.value || 0))} />
            </div>
            <div>
              <Label>Debt (USD)</Label>
              <Input type="number" min="0" value={debtUSD} onChange={(e) => setDebtUSD(Number(e.target.value || 0))} />
            </div>
            <div className="md:col-span-1">
              <Label>LTV Máximo: {(ltvMax * 100).toFixed(0)}%</Label>
              <Slider value={[Math.round(ltvMax * 100)]} onValueChange={(v) => setLtvMax(v[0] / 100)} min={50} max={95} step={1} />
            </div>
            <div className="md:col-span-1">
              <Label>Liq. Threshold: {(liqThreshold * 100).toFixed(0)}%</Label>
              <Slider value={[Math.round(liqThreshold * 100)]} onValueChange={(v) => setLiqThreshold(v[0] / 100)} min={50} max={95} step={1} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="space-y-4 p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <Stat label="Collateral USD" value={collateralUSD.toFixed(2)} />
            <Stat label="Debt USD" value={debtUSD.toFixed(2)} />
            <Stat label="LTV atual" value={(ltv * 100).toFixed(2) + "%"} emphasis={!okLtv} />
            <Stat label="Health Factor" value={hf.toFixed(2)} emphasis={hf < 1.2} />
          </div>

          <Separator />

          <div className="grid md:grid-cols-3 gap-4">
            <Stat label="Preço de liquidação" value={`$ ${liquidationPrice.toFixed(2)}`} emphasis />
            <Stat label="Margem p/ liquidação" value={`${Math.max(0, collateralPrice - liquidationPrice).toFixed(2)} USD`} />
            <Stat label="Regra LTV Máx." value={`${(ltvMax * 100).toFixed(0)}%`} />
          </div>

          <div className={`text-sm ${hf < 1 ? "text-red-500" : hf < 1.2 ? "text-yellow-500" : "text-green-600"}`}>
            {hf < 1
              ? "⚠️ HF < 1: posição pode ser liquidada."
              : hf < 1.2
              ? "🟠 HF baixo: atenção às variações de preço."
              : "🟢 HF saudável."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`p-3 rounded-lg ${emphasis ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-muted/30"}`}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-xl font-semibold ${emphasis ? "text-yellow-600" : ""}`}>{value}</div>
    </div>
  );
}
