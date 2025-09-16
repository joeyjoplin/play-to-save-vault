// src/pages/GamePage.tsx
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Joystick, Gamepad2, Trophy, ArrowLeft } from "lucide-react";
import LiquidationDodge from "@/components/game/LiquidationDodge";
import RateRacer from "@/components/game/RateRacer";
import PoolTycoon from "@/components/game/PoolTycoon";
import { useVaultBalance, useMinVaultBalance } from "@/hooks/useVault";

type Mode = "menu" | "dodge" | "racer" | "tycoon";

export default function GamePage() {
  // Optional gate: unlock mini-games when Vault balance ≥ min
  const { data: balance = 0 } = useVaultBalance(undefined);
  const minVaultBalance = useMinVaultBalance();
  const unlocked = useMemo(() => (balance ?? 0) >= minVaultBalance, [balance, minVaultBalance]);

  const [mode, setMode] = useState<Mode>("menu");
  const goMenu = () => setMode("menu");

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          DeFi Arcade — Lending Edition
        </h1>
        <p className="text-muted-foreground mt-2">
          Three fast, punchy mini-games to learn lending risk & rewards.
        </p>
      </div>

      {/* Access card */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-accent" /> Game Access
          </CardTitle>
          <Badge variant={unlocked ? "default" : "secondary"}>
            {unlocked ? "UNLOCKED" : "LOCKED"}
          </Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm">
            Vault balance:{" "}
            <span className="font-semibold text-accent">{balance.toFixed(2)}</span>
          </div>
          {!unlocked && (
            <div className="text-xs text-muted-foreground">
              Deposit at least <span className="text-accent">{minVaultBalance}</span> to unlock.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Body */}
      {mode === "menu" ? (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Liquidation Dodge */}
          <Card className="border-border/50 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Joystick className="w-5 h-5 text-accent" />
                Liquidation Dodge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Prices fall, risk rises — dash left/right to keep your Health Factor safe and rack up combo points.
              </p>
              <Button className="w-full" disabled={!unlocked} onClick={() => setMode("dodge")}>
                Play
              </Button>
            </CardContent>
          </Card>

          {/* Rate Racer */}
          <Card className="border-border/50 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Rate Racer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Snap-decisions: nudge utilization to hit target bands before time runs out. Speed = score.
              </p>
              <Button className="w-full" disabled={!unlocked} onClick={() => setMode("racer")}>
                Play
              </Button>
            </CardContent>
          </Card>

          {/* Pool Tycoon */}
          <Card className="border-border/50 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Pool Tycoon (1-min run)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Manage a lending pool for 12 rounds. Balance APY, reserves, and defaults to finish profitable.
              </p>
              <Button className="w-full" disabled={!unlocked} onClick={() => setMode("tycoon")}>
                Play
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Joystick className="w-5 h-5 text-accent" />
              {mode === "dodge" && "Liquidation Dodge"}
              {mode === "racer" && "Rate Racer"}
              {mode === "tycoon" && "Pool Tycoon"}
            </CardTitle>
            <Button variant="secondary" onClick={goMenu}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {mode === "dodge" && <LiquidationDodge onExit={goMenu} />}
            {mode === "racer" && <RateRacer onExit={goMenu} />}
            {mode === "tycoon" && <PoolTycoon onExit={goMenu} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
