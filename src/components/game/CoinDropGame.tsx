import { useState, useEffect, useRef, useCallback } from "react";
import { Coins } from "lucide-react";

interface CoinDropGameProps {
  isActive: boolean;
  onScoreChange: (score: number) => void;
  onCoinsChange: (coins: number) => void;
  onGameEnd: (finalScore: number, finalCoins: number) => void;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  speed: number;
  collected: boolean;
}

export function CoinDropGame({ 
  isActive, 
  onScoreChange, 
  onCoinsChange, 
  onGameEnd 
}: CoinDropGameProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [chestPosition, setChestPosition] = useState(50); // Percentage from left
  const [score, setScore] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [gameDuration, setGameDuration] = useState(30); // seconds
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const coinIdRef = useRef(0);
  const animationRef = useRef<number>();
  const coinSpawnRef = useRef<number>();

  // Handle chest movement with touch/mouse
  const handleChestMove = useCallback((clientX: number) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const newPosition = ((clientX - rect.left) / rect.width) * 100;
    setChestPosition(Math.max(10, Math.min(90, newPosition)));
  }, []);

  // Mouse events
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isActive) {
      handleChestMove(e.clientX);
    }
  }, [isActive, handleChestMove]);

  // Touch events
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isActive && e.touches.length > 0) {
      e.preventDefault();
      handleChestMove(e.touches[0].clientX);
    }
  }, [isActive, handleChestMove]);

  // Spawn new coins
  const spawnCoin = useCallback(() => {
    if (!isActive) return;
    
    const newCoin: Coin = {
      id: coinIdRef.current++,
      x: Math.random() * 80 + 10, // 10-90% from left
      y: -10,
      speed: Math.random() * 2 + 1, // 1-3 pixels per frame
      collected: false,
    };
    
    setCoins(prev => [...prev, newCoin]);
  }, [isActive]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!isActive) return;

    setCoins(prevCoins => {
      const updatedCoins = prevCoins.map(coin => {
        if (coin.collected) return coin;
        
        const newY = coin.y + coin.speed;
        
        // Check collision with chest (approximate chest area)
        const chestLeft = chestPosition - 8; // Chest width approximation
        const chestRight = chestPosition + 8;
        const chestTop = 85; // Chest position from top
        
        if (
          newY >= chestTop && 
          newY <= chestTop + 10 &&
          coin.x >= chestLeft && 
          coin.x <= chestRight &&
          !coin.collected
        ) {
          // Coin collected!
          const newScore = score + 10;
          const newCoinCount = coinCount + 1;
          
          setScore(newScore);
          setCoinCount(newCoinCount);
          onScoreChange(newScore);
          onCoinsChange(newCoinCount);
          
          return { ...coin, collected: true };
        }
        
        return { ...coin, y: newY };
      }).filter(coin => coin.collected || coin.y < 110); // Remove coins that fell off screen
      
      return updatedCoins;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isActive, chestPosition, score, coinCount, onScoreChange, onCoinsChange]);

  // Start/stop game
  useEffect(() => {
    if (isActive) {
      // Reset game state
      setCoins([]);
      setScore(0);
      setCoinCount(0);
      setGameDuration(30);
      coinIdRef.current = 0;
      
      // Start coin spawning
      coinSpawnRef.current = window.setInterval(spawnCoin, 1500);
      
      // Start game loop
      animationRef.current = requestAnimationFrame(gameLoop);
      
      // Game timer
      const timer = setTimeout(() => {
        onGameEnd(score, coinCount);
      }, 30000);
      
      return () => {
        if (coinSpawnRef.current) clearInterval(coinSpawnRef.current);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        clearTimeout(timer);
      };
    }
  }, [isActive, gameLoop, onGameEnd, score, coinCount, spawnCoin]);

  // Game timer countdown
  useEffect(() => {
    if (isActive && gameDuration > 0) {
      const timer = setTimeout(() => {
        setGameDuration(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, gameDuration]);

  return (
    <div 
      ref={gameAreaRef}
      className="w-full h-full bg-gradient-to-b from-primary/10 to-background relative overflow-hidden cursor-none select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none' }}
    >
      {/* Game Timer */}
      {isActive && (
        <div className="absolute top-4 left-4 bg-card/80 rounded-lg px-3 py-1 text-sm font-semibold">
          Time: {gameDuration}s
        </div>
      )}
      
      {/* Falling Coins */}
      {coins.map(coin => (
        <div
          key={coin.id}
          className={`absolute transition-opacity duration-300 ${
            coin.collected ? 'opacity-0 scale-150' : 'opacity-100'
          }`}
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Coins 
            className={`w-6 h-6 text-accent ${!coin.collected ? 'animate-coin-drop' : ''}`}
          />
        </div>
      ))}
      
      {/* Treasure Chest (controllable) */}
      <div
        className="absolute bottom-4 transition-all duration-100 ease-out"
        style={{
          left: `${chestPosition}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="bg-gradient-accent p-3 rounded-lg shadow-accent animate-pulse-glow">
          <div className="text-2xl">📦</div>
        </div>
      </div>
      
      {/* Game Instructions */}
      {!isActive && coins.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 bg-card/80 rounded-xl border border-border/50">
            <div className="text-4xl">📦</div>
            <div>
              <h3 className="text-xl font-bold">Coin Drop Game</h3>
              <p className="text-muted-foreground mt-2">
                Move the chest to catch falling coins!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Use mouse or finger to control the chest
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}