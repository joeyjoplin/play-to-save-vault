import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Fingerprint } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import playToSaveLogo from "@/assets/playto-save-logo.jpg";

export default function AuthPage() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasskeyLogin = async () => {
    setIsAuthenticating(true);
    
    // TODO: Implement WebAuthn passkey authentication with smart wallet
    // This should integrate with passkey-kit for Stellar smart wallets
    
    try {
      // Simulate passkey flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Authentication Successful",
        description: "Welcome to PlayToSave!",
      });
      
      // Navigate to main app after successful auth
      navigate("/vault");
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed", 
        description: "Please try again.",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={playToSaveLogo}
              alt="PlayToSave Logo"
              className="w-24 h-24 rounded-2xl shadow-accent"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              PlayToSave
            </h1>
            <p className="text-foreground/70 mt-2">
              Secure crypto gaming with passkey authentication
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-muted-foreground">
              Continue with your secure passkey
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handlePasskeyLogin}
              disabled={isAuthenticating}
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
            >
              <Fingerprint className="w-6 h-6 mr-3" />
              {isAuthenticating ? "Authenticating..." : "Continue with Passkey"}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No seed phrases • No passwords • Just your biometrics
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="bg-muted/30 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Powered by WebAuthn & Stellar smart contracts
          </p>
        </div>
      </div>
    </div>
  );
}