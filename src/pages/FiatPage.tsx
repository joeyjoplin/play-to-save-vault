import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, ExternalLink, Building, Shield } from "lucide-react";
import { AnchorModal } from "@/components/fiat/AnchorModal";

export default function FiatPage() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleAnchorDeposit = () => {
    setIsDepositModalOpen(true);
  };

  const handleAnchorWithdraw = () => {
    setIsWithdrawModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          Fiat Gateway
        </h1>
        <p className="text-muted-foreground mt-2">
          Convert between XLM and traditional currency
        </p>
      </div>

      {/* Anchor Info Card */}
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/20 p-4 rounded-2xl shadow-glow">
              <Building className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">Anchor Protocol</h2>
            <p className="text-muted-foreground mt-1">
              Secure on/off-ramp for Stellar assets
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <Badge variant="outline" className="bg-success/10 border-success/20 text-success">
              Regulated & Compliant
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="crypto" 
              size="lg"
              onClick={handleAnchorDeposit}
              className="font-semibold"
            >
              <TrendingUp className="w-4 h-4" />
              Deposit via Anchor
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleAnchorWithdraw}
            >
              <TrendingDown className="w-4 h-4" />
              Withdraw via Anchor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-lg mt-0.5">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Bank Transfer</h4>
                <p className="text-sm text-muted-foreground">
                  Connect your bank account for direct transfers
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-accent/20 p-2 rounded-lg mt-0.5">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold">KYC Compliant</h4>
                <p className="text-sm text-muted-foreground">
                  Secure identity verification for regulatory compliance
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-success/20 p-2 rounded-lg mt-0.5">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold">Real-time Settlement</h4>
                <p className="text-sm text-muted-foreground">
                  Fast conversion between fiat and XLM
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supported Currencies */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Supported Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {['USD', 'EUR', 'GBP'].map((currency) => (
              <div 
                key={currency}
                className="text-center p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="font-semibold text-lg">{currency}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              More currencies coming soon
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AnchorModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        type="deposit"
        title="Deposit Funds"
        description="Add fiat currency to your account via Anchor"
      />
      
      <AnchorModal
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)}
        type="withdraw"
        title="Withdraw Funds"
        description="Convert XLM to fiat currency via Anchor"
      />
    </div>
  );
}