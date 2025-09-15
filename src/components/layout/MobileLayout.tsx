import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children?: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main content area */}
      <main className="flex-1 pb-20 overflow-auto">
        {children || <Outlet />}
      </main>
      
      {/* Bottom navigation - fixed at bottom */}
      <BottomNav />
    </div>
  );
}