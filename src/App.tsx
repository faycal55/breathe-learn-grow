import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Consultations from "./pages/Consultations";
import Breathing from "./pages/Breathing";
import Playlist from "./pages/Playlist";
import Library from "./pages/Library";
import Subscription from "./pages/Subscription";
import Planning from "./pages/Planning";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Index />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/consultations" replace />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="consultations" element={<Consultations />} />
              <Route path="breathing" element={<Breathing />} />
              <Route path="playlist" element={<Playlist />} />
              <Route path="library" element={<Library />} />
              <Route path="planning" element={<Planning />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
