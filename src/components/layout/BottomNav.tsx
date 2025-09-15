import { NavLink, useLocation } from "react-router-dom";
import { Gamepad2, Vault} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/game",
    icon: Gamepad2,
    label: "Game",
  },
  {
    to: "/vault", 
    icon: Vault,
    label: "Vault",
  },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card">
      <div className="flex items-center justify-around h-20">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-2 min-w-0 flex-1 transition-all duration-300",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive && "bg-primary/10 shadow-glow"
              )}>
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-300",
                    isActive && "animate-pulse-glow"
                  )} 
                />
              </div>
              <span className="text-xs font-medium mt-1 truncate">
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}