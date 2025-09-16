// src/components/WalletConnectButton.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, PlugZap, Plug, AlertTriangle, LogIn } from "lucide-react";

export default function WalletConnectButton() {
  const {
    hasFreighter,
    allowed,
    walletConnected,
    walletAddress,
    connectWallet,
    disconnectWallet,
    wrongNetwork,
    expected,
    networkName,
    error,
  } = useWallet();

  // Sem extensão: CTA para instalar
  if (!hasFreighter) {
    return (
      <Button
        variant="secondary"
        onClick={() => window.open("https://www.freighter.app/", "_blank")}
      >
        <Plug className="w-4 h-4 mr-2" />
        Install Freighter
      </Button>
    );
  }

  // Extensão presente mas usuário não conectado/autorizado:
  if (!walletConnected) {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={connectWallet}>
          <PlugZap className="w-4 h-4 mr-2" />
          Connect Freighter
        </Button>
        {!allowed && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <LogIn className="w-3 h-3" />
            Grant permission & login in the popup
          </span>
        )}
        {error && (
          <span className="text-xs text-red-500">
            {String(error).slice(0, 120)}
          </span>
        )}
      </div>
    );
  }

  // Conectado
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={wrongNetwork ? "destructive" : "default"}
        className="font-mono"
        title={walletAddress}
      >
        <Wallet className="w-3 h-3 mr-1" />
        {walletAddress?.slice(0, 4)}…{walletAddress?.slice(-4)}
      </Badge>
      {wrongNetwork && (
        <div
          title={`Switch Freighter network to ${expected.name}`}
          className="flex items-center text-xs text-yellow-500"
        >
          <AlertTriangle className="w-3 h-3 mr-1" /> {networkName ?? "Unknown"} →{" "}
          {expected.name}
        </div>
      )}
      <Button variant="ghost" onClick={disconnectWallet}>
        Disconnect
      </Button>
    </div>
  );
}
