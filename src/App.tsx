// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';

// Ajuste estes imports para as suas páginas reais
import VaultPage from '@/pages/VaultPage';
import GamePage from '@/pages/GamePage';

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Play-to-Save</h1>
      <p className="text-muted-foreground mt-2">
        Use o menu acima para acessar o Vault e o Game.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vault" element={<VaultPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

