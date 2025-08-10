import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") toast({ title: "Paiement confirmé", description: "Merci pour votre abonnement." });
    if (status === "cancel") toast({ title: "Paiement annulé", description: "Vous pouvez réessayer quand vous voulez." });
    refreshStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscribed(Boolean((data as any)?.subscribed));
      setSubscriptionEnd((data as any)?.subscription_end ?? null);
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Impossible de vérifier l'abonnement." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setProcessing(true);
      const { data, error } = await supabase.functions.invoke("create-checkout");
      if (error) throw error;
      const url = (data as any)?.url;
      if (url) window.open(url, "_blank");
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Impossible d'ouvrir la page Stripe." });
    } finally {
      setProcessing(false);
    }
  };

  const handleManage = async () => {
    try {
      setProcessing(true);
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      const url = (data as any)?.url;
      if (url) window.open(url, "_blank");
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Impossible d'ouvrir le portail client." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="space-y-4">
      <Helmet>
        <title>Abonnement Premium | Respira</title>
        <meta name="description" content="Abonnez-vous à Respira (7,99€/mois). Gérez votre abonnement facilement." />
        <link rel="canonical" href="/dashboard/subscription" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Abonnement</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">7,99€ / mois — annulation possible à la fin de la période en cours.</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            {loading ? (
              <span className="text-sm text-muted-foreground">Vérification de votre abonnement…</span>
            ) : subscribed ? (
              <>
                <Button onClick={handleManage} disabled={processing} title="Gérer l'abonnement">Gérer mon abonnement</Button>
                <Button variant="secondary" onClick={refreshStatus} disabled={processing}>Rafraîchir l'état</Button>
                {subscriptionEnd && (
                  <span className="text-sm text-muted-foreground">Renouvellement le {new Date(subscriptionEnd).toLocaleString()}</span>
                )}
              </>
            ) : (
              <>
                <Button onClick={handleSubscribe} disabled={processing} title="Stripe Checkout">S'abonner</Button>
                <Button variant="secondary" onClick={() => navigate("/auth")}>Se connecter</Button>
              </>
            )}
          </div>
          {!subscribed && !loading && (
            <p className="text-xs text-muted-foreground mt-2">Accès aux outils réservé aux abonnés. Veuillez vous abonner pour continuer.</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">Paiement sécurisé via Stripe. Aucune donnée bancaire n'est stockée par Respira.</p>
        </CardContent>
      </Card>
    </section>
  );
}
