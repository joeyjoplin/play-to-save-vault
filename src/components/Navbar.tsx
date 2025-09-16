// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import WalletConnectButton from '@/components/WalletConnectButton';
import { useVaultBalance } from '@/hooks/useVault';

export default function Navbar() {
  const { data: vaultBalance = 0 } = useVaultBalance(undefined);

  return (
    <div className="w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-lg">Play-to-Save</Link>
          <Link to="/vault" className="text-sm hover:underline">Vault</Link>
          <Link to="/game" className="text-sm hover:underline">Game</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            Total Balance:{' '}
            <span className="font-semibold">{vaultBalance.toFixed(2)} XLM</span>
          </div>
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
}

