// src/components/game/LendSimulator.tsx
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

/**
 * Modelo simples de juros de pool:
 * - Utilization U = totalBorrow / totalLiquidity
 * - Borrow APR = base + k * U
 * - Lend APR ≈ Borrow APR * U * (1 - reserveFactor)
 */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function LendSimulator() {
  const [totalLiquidity, setTotalLiquidity] = useState(1000); // valor total na pool
  const [totalBorrow, setTotalBorrow] = useState(500);        // total emprestado
  const [yourDeposit, setYourDeposit] = useState(100);        // seu aporte
  const [reserveFactor, setReserveFactor] = useState(0.1);    // 10%

  const baseAPR = 0.02; // 2% base
  const k = 0.18;       // 18% max incremento

  const util = useMemo(() => clamp(totalBorrow / Math.max(totalLiquidity, 1e-9), 0, 0.9999), [totalLiquidity, totalBorrow]);
  const borrowAPR = useMemo(() => baseAPR + k * util, [util]);
  const lendAPR = useMemo(() => borrowAPR * util * (1 - reserveFactor), [borrowAPR, util, reserveFactor]);

  const poolAfterDeposit = totalLiquidity + yourDeposit;
  const yourShare = useMemo(() => yourDeposit / Math.max(poolAfterDeposit, 1e-9), [yourDeposit, poolAfterDeposit]);

  // projeção 1 ano (simples, sem composição)
  const yourYieldYear = yourDeposit * lendAPR;

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardContent className="space-y-4 p-4">
          <h3 className="font-semibold">Parâmetros da Pool</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Total Liquidity</Label>
              <Input
                type="number"
                min="0"
                value={totalLiquidity}
                onChange={(e) => setTotalLiquidity(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <Label>Total Borrow</Label>
              <Input
                type="number"
                min="0"
                value={totalBorrow}
                onChange={(e) => setTotalBorrow(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <Label>Reserve Factor: {(reserveFactor * 100).toFixed(0)}%</Label>
              <Slider
                value={[Math.round(reserveFactor * 100)]}
                onValueChange={(v) => setReserveFactor(v[0] / 100)}
                min={0}
                max={30}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="space-y-4 p-4">
          <h3 className="font-semibold">Seu Depósito</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Valor a depositar</Label>
              <Input
                type="number"
                min="0"
                value={yourDeposit}
                onChange={(e) => setYourDeposit(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <Label>Utilization (U)</Label>
              <div className="text-lg font-mono">{(util * 100).toFixed(1)}%</div>
            </div>
            <div>
              <Label>Seu share após depósito</Label>
              <div className="text-lg font-mono">{(yourShare * 100).toFixed(2)}%</div>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-3 gap-4">
            <Stat label="Borrow APR" value={(borrowAPR * 100).toFixed(2) + "%"} />
            <Stat label="Lend APR (estimado)" value={(lendAPR * 100).toFixed(2) + "%"} />
            <Stat label="Yield em 1 ano" value={yourYieldYear.toFixed(2)} />
          </div>
        </CardContent>
      </Card>
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
