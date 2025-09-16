// src/components/game/LiquidationDodge.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Liquidation Dodge
 * Arcade-style: A falling “price line” threatens your position.
 * You move your shield (←/→ or A/D). If the falling risk hits your zone while HF < 1,
 * you lose a life. Survive and maintain HF ≥ 1 to grow combo & score.
 *
 * Teaches:
 * - Health Factor intuition when price drops
 * - Reaction to adverse price ticks (move to safer zone)
 */

type Props = { onExit?: () => void };

const WIDTH = 560;
const HEIGHT = 320;
const PLAYER_W = 80;
const PLAYER_H = 14;
const TICK_MS = 50;

export default function LiquidationDodge({ onExit }: Props) {
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);

  // “Price” & “HF”: as price falls, HF decreases
  const [price, setPrice] = useState(100); // arbitrary index
  const [debt] = useState(60);
  const [collateral, setCollateral] = useState(120); // collateral value moves with price
  const hf = useMemo(() => {
    // Simplified HF proxy (HF < 1 => danger)
    const colVal = Math.max(1, (collateral * price) / 100);
    return (colVal * 0.8) / Math.max(1, debt); // liqThreshold = 80%
  }, [collateral, price, debt]);

  // Player (shield)
  const [px, setPx] = useState(WIDTH / 2 - PLAYER_W / 2);
  const keys = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Falling risk blobs
  const [blobs, setBlobs] = useState<Array<{ x: number; y: number; s: number }>>([
    { x: 80, y: -20, s: 6 },
    { x: 280, y: -120, s: 10 },
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, d: boolean) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.current.left = d;
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.current.right = d;
    };
    const down = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      // Move player
      setPx((prev) => {
        let nx = prev + (keys.current.right ? 14 : 0) - (keys.current.left ? 14 : 0);
        return Math.max(0, Math.min(WIDTH - PLAYER_W, nx));
      });

      // Random price tick (downwards bias)
      setPrice((p) => Math.max(30, p + (Math.random() < 0.6 ? -1 : 1)));
      setCollateral((c) => Math.max(50, c + (Math.random() < 0.5 ? -1 : 0)));

      // Move blobs
      setBlobs((prev) => {
        const next = prev.map((b) => ({ ...b, y: b.y + 10 + Math.random() * 6 }));
        // respawn off-screen
        next.forEach((b) => {
          if (b.y > HEIGHT + 30) {
            b.y = -Math.random() * 200 - 30;
            b.x = 20 + Math.random() * (WIDTH - 40);
            // add some difficulty over time
            b.s = Math.min(18, b.s + 0.3);
          }
        });
        return next;
      });

      // Collision check when HF < 1 (danger time!)
      const player = { x1: px, y1: HEIGHT - 30, x2: px + PLAYER_W, y2: HEIGHT - 30 + PLAYER_H };
      const hfBad = hf < 1;

      setScore((s) => s + 1 + Math.max(0, combo));
      if (hfBad) {
        let hit = false;
        blobs.forEach((b) => {
          const bx1 = b.x - b.s;
          const by1 = b.y - b.s;
          const bx2 = b.x + b.s;
          const by2 = b.y + b.s;
          const overlap =
            !(bx2 < player.x1 || bx1 > player.x2 || by2 < player.y1 || by1 > player.y2);
          if (overlap) hit = true;
        });
        if (hit) {
          setLives((l) => l - 1);
          setCombo(0);
        }
      } else {
        setCombo((c) => Math.min(99, c + 1));
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running, blobs, px, hf]);

  useEffect(() => {
    if (lives <= 0) setRunning(false);
  }, [lives]);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-sm text-muted-foreground">
        Move with <kbd>←</kbd>/<kbd>→</kbd> or <kbd>A</kbd>/<kbd>D</kbd>. Keep HF ≥ 1 to build combo!
      </div>

      <div
        className="relative rounded-xl border bg-muted/30"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        {/* HUD */}
        <div className="absolute top-2 left-2 text-xs space-y-1">
          <div>Score: <span className="font-semibold">{score}</span></div>
          <div>Combo: <span className="font-semibold">{combo}</span></div>
          <div>Lives: <span className="font-semibold">{lives}</span></div>
          <div>
            HF:{" "}
            <span className={`font-semibold ${hf < 1 ? "text-red-500" : "text-green-600"}`}>
              {hf.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Price bar (visual hint) */}
        <div className="absolute top-2 right-2 text-xs text-muted-foreground">
          Price: {price}
        </div>

        {/* Player (shield) */}
        <div
          className={`absolute rounded-lg ${hf < 1 ? "bg-red-500/90" : "bg-green-500/90"} transition-colors`}
          style={{ left: px, top: HEIGHT - 30, width: PLAYER_W, height: PLAYER_H }}
        />

        {/* Blobs */}
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-accent/80 shadow"
            style={{
              left: b.x - b.s,
              top: b.y - b.s,
              width: b.s * 2,
              height: b.s * 2,
            }}
          />
        ))}

        {/* Game over overlay */}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-xl">
            <div className="text-2xl font-bold mb-2">Game Over</div>
            <div className="text-sm text-muted-foreground mb-4">
              Final score: <span className="font-semibold">{score}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setScore(0); setCombo(0); setLives(3); setRunning(true); }}>
                Restart
              </Button>
              <Button variant="secondary" onClick={onExit}>Back</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
