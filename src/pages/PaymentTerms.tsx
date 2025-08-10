import { Helmet } from "react-helmet-async";

export default function PaymentTerms() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>Conditions de paiement | Respira</title>
        <meta name="description" content="Conditions de paiement de Respira: abonnement, facturation, annulation et remboursements." />
        <link rel="canonical" href={`${window.location.origin}/conditions-paiement`} />
      </Helmet>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Conditions de paiement</h1>
        </header>
        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <h2 className="text-xl font-semibold">Abonnements</h2>
          <p>Les abonnements sont facturés à l'avance pour chaque période. Vous pouvez gérer votre abonnement depuis l'espace client.</p>
          <h2 className="text-xl font-semibold">Renouvellement et résiliation</h2>
          <p>Le renouvellement est automatique. Vous pouvez annuler avant la prochaine échéance via le portail client Stripe.</p>
          <h2 className="text-xl font-semibold">Remboursements</h2>
          <p>Les remboursements sont traités au cas par cas selon les conditions légales et contractuelles en vigueur.</p>
          <h2 className="text-xl font-semibold">Sécurité des paiements</h2>
          <p>Les paiements sont traités de manière sécurisée par Stripe. Nous ne stockons aucune donnée de carte.</p>
        </section>
      </article>
    </main>
  );
}
