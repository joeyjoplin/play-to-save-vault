import { Button } from "@/components/ui/button";
import { Lock, TrendingUp, Vault } from "lucide-react";

interface GameLockedOverlayProps {
  requiredBalance: number;
  currentBalance: number;
}

export function GameLockedOverlay({ requiredBalance, currentBalance }: GameLockedOverlayProps) {
  const difference = requiredBalance - currentBalance;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="text-center space-y-6 p-8 bg-card/90 rounded-xl border border-border shadow-card max-w-sm mx-4">
        {/* Lock Icon */}
        <div className="flex justify-center">
          <div className="bg-warning/20 p-4 rounded-2xl">
            <Lock className="w-12 h-12 text-warning" />
          </div>
        </div>
        
        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-warning">Game Locked</h3>
          <p className="text-muted-foreground">
            You need at least <span className="font-semibold text-accent">{requiredBalance} XLM</span> in your vault to play
          </p>
        </div>
        
        {/* Balance Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-muted-foreground">Current Balance:</span>
            <span className="font-semibold">{currentBalance.toFixed(2)} XLM</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border border-warning/20">
            <span className="text-sm text-warning font-medium">Need to Deposit:</span>
            <span className="font-bold text-warning">{difference.toFixed(2)} XLM</span>
          </div>
        </div>
        
        {/* Action Button */}
        <Button 
          variant="crypto" 
          className="w-full"
          onClick={() => {
            // TODO: Navigate to vault page or open deposit modal
            console.log("TODO: Navigate to vault for deposit");
          }}
        >
          <Vault className="w-4 h-4 mr-2" />
          Go to Vault
        </Button>
        
        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          Deposit XLM to your vault to unlock gaming features and start earning rewards
        </p>
      </div>
    </div>
  );
}