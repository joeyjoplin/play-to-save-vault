import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Trophy, Lock, Play, RotateCcw } from "lucide-react";
import { CoinDropGame } from "@/components/game/CoinDropGame";
import { GameLockedOverlay } from "@/components/game/GameLockedOverlay";

// TODO: Replace with actual balance from React Query
const mockBalance = 12.5; // XLM - change to 5 to test locked state
const minVaultBalance = 10;
const isGameUnlocked = mockBalance >= minVaultBalance;

export default function GamePage() {
  const [gameScore, setGameScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameKey, setGameKey] = useState(0); // For resetting the game

  const startGame = useCallback(() => {
    if (!isGameUnlocked) return;
    setIsGameActive(true);
    setGameScore(0);
    setCoinsCollected(0);
  }, [isGameUnlocked]);

  const endGame = useCallback((finalScore: number, finalCoins: number) => {
    setGameScore(finalScore);
    setCoinsCollected(finalCoins);
    setIsGameActive(false);
    
    // TODO: Save game results to backend/contract
    console.log("TODO: Save game results:", { finalScore, finalCoins });
  }, []);

  const resetGame = useCallback(() => {
    setGameScore(0);
    setCoinsCollected(0);
    setIsGameActive(false);
    setGameKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 relative">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Coin Drop Game
        </h1>
        <p className="text-muted-foreground mt-2">
          Catch falling coins to earn XLM rewards
        </p>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold">{gameScore}</span>
            </div>
            <p className="text-sm text-muted-foreground">Score</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Coins className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold">{coinsCollected}</span>
            </div>
            <p className="text-sm text-muted-foreground">Coins</p>
          </CardContent>
        </Card>
      </div>

      {/* Vault Status */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Gaming Status</CardTitle>
            <Badge 
              variant={isGameUnlocked ? "default" : "secondary"}
              className={`${isGameUnlocked ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'} text-white`}
            >
              {isGameUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Vault Balance:</span>
            <span className="font-semibold">{mockBalance.toFixed(2)} XLM</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Required:</span>
            <span className="font-semibold">{minVaultBalance} XLM</span>
          </div>
          
          {!isGameUnlocked && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mt-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-warning" />
                <p className="text-sm text-warning font-medium">
                  Deposit more XLM to unlock the game
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Area */}
      <Card className="bg-gradient-card border-border/50 relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Game Area</CardTitle>
            <div className="flex gap-2">
              {!isGameActive && gameScore > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetGame}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant={isGameActive ? "destructive" : "crypto"}
                size="sm"
                onClick={isGameActive ? () => endGame(gameScore, coinsCollected) : startGame}
                disabled={!isGameUnlocked}
              >
                {isGameActive ? (
                  "Stop Game"
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start Game
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-96 relative">
          <CoinDropGame 
            key={gameKey}
            isActive={isGameActive && isGameUnlocked}
            onScoreChange={setGameScore}
            onCoinsChange={setCoinsCollected}
            onGameEnd={endGame}
          />
          
          {/* Game Locked Overlay */}
          {!isGameUnlocked && (
            <GameLockedOverlay 
              requiredBalance={minVaultBalance}
              currentBalance={mockBalance}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}