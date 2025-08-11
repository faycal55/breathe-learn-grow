import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Legal from "./pages/Legal";
import PaymentTerms from "./pages/PaymentTerms";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DashboardLayout from "./layouts/DashboardLayout";
import Consultations from "./pages/Consultations";
import Breathing from "./pages/Breathing";
import Playlist from "./pages/Playlist";
import Library from "./pages/Library";
import Subscription from "./pages/Subscription";
import Planning from "./pages/Planning";
import Guides from "./pages/Guides";
import Contact from "./pages/Contact";
import TermsGeneral from "./pages/TermsGeneral";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            
            <Route path="/dashboard" element={<Navigate to="/dashboard/consultations" replace />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="consultations" element={<Consultations />} />
              <Route path="breathing" element={<Breathing />} />
              <Route path="playlist" element={<Playlist />} />
              <Route path="library" element={<Library />} />
              <Route path="planning" element={<Planning />} />
              <Route path="guides" element={<Guides />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/conditions-paiement" element={<PaymentTerms />} />
            <Route path="/conditions-generales" element={<TermsGeneral />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    
  </QueryClientProvider>
);

export default App;
