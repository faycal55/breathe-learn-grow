import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Subscription() {
  const navigate = useNavigate();
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
          <p className="text-muted-foreground">7,99€ / mois — sans période d'essai.</p>
          <div className="mt-4 flex gap-3">
            <Button disabled title="Stripe bientôt">S'abonner (bientôt)</Button>
            <Button variant="secondary" onClick={() => navigate("/auth")}>Se connecter</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Le paiement Stripe sera activé dès la configuration de la clé secrète et du prix.</p>
        </CardContent>
      </Card>
    </section>
  );
}
