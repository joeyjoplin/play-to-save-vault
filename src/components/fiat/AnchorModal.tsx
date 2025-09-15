import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building, Loader2 } from "lucide-react";
import { useState } from "react";

interface AnchorModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw";
  title: string;
  description: string;
}

export function AnchorModal({ isOpen, onClose, type, title, description }: AnchorModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAnchorRedirect = () => {
    setIsLoading(true);
    
    // TODO: Replace with actual Anchor URL from env vars
    const anchorUrl = "https://anchor.stellar.org"; // ANCHOR_URL env var
    
    // In a real app, this would open the Anchor interface in an iframe
    // For now, we'll simulate the process
    
    setTimeout(() => {
      setIsLoading(false);
      console.log(`TODO: Open Anchor ${type} flow in iframe`);
      console.log(`Anchor URL: ${anchorUrl}`);
      
      // This would typically open an iframe modal with the Anchor interface
      // For demo purposes, we'll just show a placeholder
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-border/50">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-3 rounded-xl shadow-glow">
              <Building className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <p className="text-muted-foreground mt-2">{description}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Process Steps */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Process Steps
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-xs">
                  1
                </div>
                <span>Connect to Anchor platform</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-xs">
                  2
                </div>
                <span>Complete KYC verification (if needed)</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-xs">
                  3
                </div>
                <span>
                  {type === 'deposit' 
                    ? 'Add funds via bank transfer' 
                    : 'Withdraw to your bank account'
                  }
                </span>
              </div>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <h4 className="font-semibold text-success mb-2">🔒 Secure & Regulated</h4>
            <p className="text-sm text-muted-foreground">
              Anchor Protocol is a regulated money service business compliant with 
              financial regulations. Your funds are protected.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button 
              variant="crypto" 
              onClick={handleAnchorRedirect}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Connecting..." : "Continue with Anchor"}
            </Button>
          </div>
          
          {/* Placeholder for future iframe */}
          {isLoading && (
            <div className="bg-muted/20 border border-border/50 rounded-lg p-8 text-center">
              <div className="animate-pulse space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                TODO: Anchor iframe will load here
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}