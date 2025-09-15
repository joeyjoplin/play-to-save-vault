import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Lock, Play, RotateCcw } from "lucide-react";
import { CoinDropGame } from "@/components/game/CoinDropGame";
import { GameLockedOverlay } from "@/components/game/GameLockedOverlay";
import { useVaultBalance, useMinVaultBalance } from "@/hooks/useVault";
import { useToast } from "@/hooks/use-toast";

export default function GamePage() {
  const { toast } = useToast();
  // TODO: swap undefined for connected wallet address when you add wallet auth
  const { data: balance = 0, isLoading } = useVaultBalance(undefined);
  const minVaultBalance = useMinVaultBalance();
  const isGameUnlocked = (balance ?? 0) >= minVaultBalance;

  const [gameScore, setGameScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleScoreChange = useCallback((score: number) => setGameScore(score), []);
  const handleCoinsChange = useCallback((coins: number) => setCoinsCollected(coins), []);
  const handleGameEnd = useCallback((finalScore: number, finalCoins: number) => {
    setIsPlaying(false);
    toast({
      title: "Nice run! 🎉",
      description: `Score: ${finalScore} • Coins: ${finalCoins}`,
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 relative">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Coin Drop Game
        </h1>
        <p className="text-muted-foreground mt-2">
          Catch falling coins to train your saving superpowers
        </p>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Vault</p>
            <p className="text-xl font-bold text-accent">
              {isLoading ? "…" : `${balance.toFixed(2)} XLM`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Score</p>
            <p className="text-xl font-bold">{gameScore}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Coins</p>
            <p className="text-xl font-bold">{coinsCollected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      <div className="relative">
        {!isGameUnlocked && (
          <GameLockedOverlay
            requiredBalance={minVaultBalance}
            currentBalance={balance ?? 0}
          />
        )}

        <Card className={`bg-gradient-card border-border/50 ${!isGameUnlocked ? "opacity-50" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-accent" /> Play to Save
            </CardTitle>
            <Badge variant={isGameUnlocked ? "default" : "secondary"}>
              {isGameUnlocked ? "ACTIVE" : "LOCKED"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CoinDropGame
                isActive={isGameUnlocked && isPlaying}
                onScoreChange={setGameScore}
                onCoinsChange={setCoinsCollected}
                onGameEnd={handleGameEnd}
              />

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setIsPlaying(true)}
                  disabled={!isGameUnlocked || isPlaying}
                >
                  <Play className="w-4 h-4 mr-2" /> Start
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => { setIsPlaying(false); setGameScore(0); setCoinsCollected(0); }}
                  disabled={!isGameUnlocked}
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              </div>

              {!isGameUnlocked && (
                <p className="text-center text-sm text-muted-foreground">
                  Deposit at least <span className="text-accent">{minVaultBalance} XLM</span> in your vault to play.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
