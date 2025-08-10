import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  useEffect(() => {
    // Ensure user is authenticated
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      await checkSubscription();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSubscribed(null);
        navigate("/auth", { replace: true });
      } else {
        // Defer to avoid deadlocks
        setTimeout(() => checkSubscription(), 0);
      }
    });

    init();
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Re-check when navigating (but avoid loops)
    if (location.pathname.startsWith("/dashboard")) {
      setTimeout(() => checkSubscription(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const checkSubscription = async () => {
    try {
      setChecking(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      if (error) throw error;
      const isSub = Boolean((data as any)?.subscribed);
      setSubscribed(isSub);
      if (!isSub && location.pathname !== "/dashboard/subscription") {
        toast({ title: "Abonnement requis", description: "Veuillez vous abonner pour accéder aux outils." });
        navigate("/dashboard/subscription", { replace: true });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur de vérification", description: "Impossible de vérifier l'abonnement." });
    } finally {
      setChecking(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="h-12 flex items-center border-b px-3 gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Espace Client</h1>
            {!checking && subscribed === false && (
              <div className="ml-4 text-sm text-muted-foreground">Abonnement requis</div>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  toast({ title: "Déconnecté" });
                  navigate("/auth", { replace: true });
                }}
              >
                Déconnexion
              </Button>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
