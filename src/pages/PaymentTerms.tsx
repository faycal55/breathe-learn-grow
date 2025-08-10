import { Helmet } from "react-helmet-async";

export default function PaymentTerms() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : "";
  const canonical = `${baseUrl}/conditions-paiement`;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>Conditions de paiement | Respira</title>
        <meta name="description" content="Conditions de paiement professionnelles de Respira: abonnements, facturation, renouvellement, remboursement, sécurité Stripe." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Conditions de paiement</h1>
        </header>
        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <h2 className="text-xl font-semibold">Modalités générales</h2>
          <p>
            Les abonnements à Respira sont facturés à l’avance pour chaque période (mensuelle ou annuelle selon l’offre choisie). Les tarifs en vigueur sont affichés au moment de la souscription et peuvent évoluer. Toute modification tarifaire s’appliquera au prochain cycle de facturation, après information préalable.
          </p>

          <h2 className="text-xl font-semibold">Facturation et renouvellement</h2>
          <p>
            Le renouvellement est automatique à l’issue de chaque période, sauf résiliation avant l’échéance depuis le portail client. Les factures sont accessibles dans votre espace et envoyées par email. Les montants incluent ou excluent la TVA selon la réglementation applicable et le pays de facturation.
          </p>

          <h2 className="text-xl font-semibold">Paiements sécurisés</h2>
          <p>
            Les paiements sont traités de manière sécurisée par notre prestataire (Stripe). {""}Nous ne stockons aucune donnée de carte. Des contrôles anti-fraude peuvent être réalisés. Le refus d’autorisation par l’émetteur entraîne l’impossibilité de fournir le service.
          </p>

          <h2 className="text-xl font-semibold">Résiliation et droit de rétractation</h2>
          <p>
            Vous pouvez résilier à tout moment avant la prochaine échéance pour éviter un nouveau prélèvement. Conformément au Code de la consommation, le droit de rétractation peut ne pas s’appliquer ou être limité pour les contenus/services numériques fournis immédiatement après consentement exprès et renoncement au droit de rétractation.
          </p>

          <h2 className="text-xl font-semibold">Remboursements</h2>
          <p>
            Les remboursements sont traités au cas par cas en cas d’anomalie avérée (double facturation, non-accès au service imputable à Respira, etc.). {""}Les demandes doivent être adressées au support avec justificatifs.
          </p>

          <h2 className="text-xl font-semibold">Impayés</h2>
          <p>
            En cas d’échec de paiement, un nouvel essai peut être effectué. À défaut de règlement dans un délai raisonnable, l’accès au service pourra être suspendu jusqu’à régularisation.
          </p>
        </section>
      </article>
    </main>
  );
}
