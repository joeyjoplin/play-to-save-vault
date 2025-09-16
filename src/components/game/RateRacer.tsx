// src/components/game/RateRacer.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

/**
 * Rate Racer
 * You target utilization bands quickly to score.
 * Every round gives a target U% and a time limit. Hit inside the band to score combo & bonus.
 *
 * Teaches:
 * - How utilization U drives borrow APR and, indirectly, lend returns.
 */

type Props = { onExit?: () => void };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function RateRacer({ onExit }: Props) {
  const [round, setRound] = useState(1);
  const [time, setTime] = useState(12); // seconds per round
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const [util, setUtil] = useState(50); // current utilization (%)
  const [target, setTarget] = useState(60); // target center
  const [band, setBand] = useState(8); // ± band

  const baseAPR = 2; // %
  const slope = 18;  // %
  const borrowAPR = useMemo(() => baseAPR + (slope * util) / 100, [util]);

  // Countdown
  useEffect(() => {
    const id = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [round]);

  useEffect(() => {
    if (time <= 0) {
      // evaluate
      const hit = Math.abs(util - target) <= band;
      if (hit) {
        setCombo((c) => c + 1);
        setScore((s) => s + 100 + combo * 30);
      } else {
        setCombo(0);
      }
      // next round
      setRound((r) => r + 1);
      setTime(12);
      setTarget(Math.round(20 + Math.random() * 70));
      setBand([6, 8, 10][Math.floor(Math.random() * 3)]);
    }
  }, [time]); // eslint-disable-line

  const inBand = Math.abs(util - target) <= band;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="text-sm text-muted-foreground">
        Drag the slider to match target utilization before time runs out!
      </div>

      <div className="w-full max-w-2xl space-y-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <div>Round: <span className="font-semibold">{round}</span></div>
          <div>Time: <span className={`font-semibold ${time <= 3 ? "text-red-500" : ""}`}>{time}s</span></div>
          <div>Score: <span className="font-semibold">{score}</span></div>
          <div>Combo: <span className="font-semibold">{combo}</span></div>
        </div>

        <div className="rounded-lg bg-background/70 p-4">
          <div className="text-xs text-muted-foreground mb-1">
            Target: <span className="font-semibold">{target}%</span> ± {band}%
          </div>
          <Slider
            value={[util]}
            onValueChange={(v) => setUtil(clamp(v[0], 0, 100))}
            min={0}
            max={100}
            step={1}
          />
          <div className="flex items-center justify-between text-xs mt-2">
            <div>U: <span className="font-mono">{util}%</span></div>
            <div>
              Borrow APR:{" "}
              <span className="font-mono">{borrowAPR.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className={`text-center text-sm ${inBand ? "text-green-600" : "text-yellow-600"}`}>
          {inBand ? "On target! Hold it..." : "Adjust to hit the band!"}
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="secondary" onClick={onExit}>Back</Button>
          <Button onClick={() => { setRound(1); setTime(12); setScore(0); setCombo(0); }}>
            Restart
          </Button>
        </div>
      </div>
    </div>
  );
}
