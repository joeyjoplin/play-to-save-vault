// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ArcadeHero from "@/components/landing/ArcadeHero";
import RetroGrid from "@/components/landing/RetroGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Animated background */}
      <RetroGrid />

      {/* Hero */}
      <section className="relative z-10">
        <ArcadeHero />
      </section>

      {/* Feature cards */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 backdrop-blur bg-background/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-accent" />
                Arcade-style Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Fast, replayable mini-games that teach lending risk & rewards through
              action and quick decisions.
            </CardContent>
          </Card>

          <Card className="border-border/50 backdrop-blur bg-background/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                On-chain Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Connect your Freighter wallet to deposit/withdraw and unlock games
              with a minimum Vault balance.
            </CardContent>
          </Card>

          <Card className="border-border/50 backdrop-blur bg-background/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Clean & Modern UI
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Minimal, responsive design with subtle motion. Built with your
              shadcn setup and Tailwind.
            </CardContent>
          </Card>
        </div>

        {/* CTA row */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/vault">
            <Button size="lg">Go to Vault</Button>
          </Link>
          <Link to="/game">
            <Button size="lg" variant="secondary">Play the Arcade</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
