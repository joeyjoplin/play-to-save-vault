// src/components/landing/ArcadeHero.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * ArcadeHero
 * - Big headline & subtitle
 * - Inline SVG "arcade cabinet" illustration (no external assets)
 * - CTA buttons
 */

export default function ArcadeHero() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-4 grid items-center gap-10 md:grid-cols-2">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Learn DeFi the <span className="text-accent">fun</span> way
        </h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground">
          Play quick mini-games to build intuition for lending pools, utilization,
          health factor, and yields — then try it on-chain with your Vault.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/game">
            <Button size="lg">Enter the Arcade</Button>
          </Link>
          <Link to="/vault">
            <Button size="lg" variant="secondary">Open Vault</Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <ArcadeCabinet />
      </div>
    </div>
  );
}

function ArcadeCabinet() {
  // Inline SVG with soft gradients and lights
  return (
    <div className="relative mx-auto w-[520px] max-w-full">
      <svg
        viewBox="0 0 520 520"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="cabinet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f1f2e" />
            <stop offset="100%" stopColor="#12121b" />
          </linearGradient>
          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b9dfd" />
            <stop offset="100%" stopColor="#5b6bff" />
          </linearGradient>
          <radialGradient id="neon" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#98f5f5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#98f5f5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="btnA" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ff85b5" />
            <stop offset="100%" stopColor="#c51e73" />
          </radialGradient>
          <radialGradient id="btnB" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffd58a" />
            <stop offset="100%" stopColor="#d28a1f" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cabinet body */}
        <path
          d="M100 60 L420 60 L460 140 L460 430 L60 430 L60 140 Z"
          fill="url(#cabinet)"
          stroke="#2a2a3a"
          strokeWidth="2"
          className="[filter:url(#glow)]"
        />
        {/* Marquee */}
        <rect x="120" y="70" width="280" height="50" rx="8" fill="#0b0b13" />
        <text
          x="260"
          y="102"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="#98f5f5"
          style={{ letterSpacing: 1.5 }}
        >
          DEFI ARCADE
        </text>

        {/* Screen */}
        <rect x="110" y="130" width="300" height="180" rx="12" fill="#0a0e19" stroke="#2c3350" />
        <rect
          x="115"
          y="135"
          width="290"
          height="170"
          rx="10"
          fill="url(#screenGlow)"
          opacity="0.16"
        />
        {/* Screen glow */}
        <ellipse cx="260" cy="220" rx="180" ry="110" fill="url(#neon)" opacity="0.6" />

        {/* Bezel lights */}
        <circle cx="120" cy="130" r="8" fill="#96f1ff" opacity="0.7" />
        <circle cx="410" cy="130" r="8" fill="#96f1ff" opacity="0.7" />

        {/* Control panel */}
        <rect x="85" y="325" width="350" height="50" rx="8" fill="#0b0b13" stroke="#24243a" />
        {/* Joystick */}
        <circle cx="150" cy="350" r="16" fill="#88a0ff" />
        <rect x="146" y="334" width="8" height="20" rx="2" fill="#88a0ff" />
        {/* Buttons */}
        <circle cx="300" cy="350" r="14" fill="url(#btnA)" />
        <circle cx="330" cy="350" r="14" fill="url(#btnB)" />
        <circle cx="360" cy="350" r="14" fill="#7ae3a0" />

        {/* Feet */}
        <rect x="80" y="430" width="20" height="16" rx="2" fill="#0b0b13" />
        <rect x="420" y="430" width="20" height="16" rx="2" fill="#0b0b13" />
      </svg>

      {/* Floating glow card */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-accent/40 bg-background/80 px-4 py-2 text-xs shadow-lg">
        <span className="text-accent font-semibold">Tip:</span> Deposit into the Vault to
        unlock all arcade modes.
      </div>
    </div>
  );
}
