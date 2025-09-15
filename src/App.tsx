import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MobileLayout } from "./components/layout/MobileLayout";
import AuthPage from "./pages/AuthPage";
import VaultPage from "./pages/VaultPage";
import GamePage from "./pages/GamePage";
//import FiatPage from "./pages/FiatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// TODO: Replace with actual authentication state from auth context/passkey-kit
const isAuthenticated = true; // Set to true for development/demo

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Route */}
          <Route 
            path="/auth" 
            element={<AuthPage />} 
          />
          
          {/* Protected Routes with Mobile Layout */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <MobileLayout />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          >
            <Route index element={<Navigate to="/vault" replace />} />
            <Route path="vault" element={<VaultPage />} />
            <Route path="game" element={<GamePage />} />            
          </Route>
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
