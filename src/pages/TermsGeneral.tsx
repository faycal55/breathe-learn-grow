import { Helmet } from "react-helmet-async";

export default function TermsGeneral() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : "";
  const canonical = `${baseUrl}/conditions-generales`;

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>Conditions Générales d'Utilisation et de Vente | Respira</title>
        <meta name="description" content="Conditions Générales Respira: accès au service, abonnements, droits et obligations, responsabilité, données personnelles, résiliation." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Conditions Générales</h1>
        </header>
        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <h2 className="text-xl font-semibold">1. Objet</h2>
          <p>
            Les présentes Conditions Générales ("CG") régissent l’accès et l’utilisation de la plateforme {"Respira"} permettant des exercices de respiration, du contenu d’accompagnement, ainsi que la gestion d’un abonnement.
          </p>

          <h2 className="text-xl font-semibold">2. Création de compte</h2>
          <p>
            La création d’un compte nécessite des informations exactes et à jour (nom, prénom, email, pays, téléphone). Vous êtes responsable de la confidentialité de vos identifiants et des activités réalisées sous votre compte.
          </p>

          <h2 className="text-xl font-semibold">3. Services</h2>
          <p>
            {"Respira"} fournit des contenus et outils de bien‑être. Ils ne constituent pas un acte médical ni un dispositif médical. L’usage est réservé à des fins personnelles et non commerciales.
          </p>

          <h2 className="text-xl font-semibold">4. Abonnements et prix</h2>
          <p>
            Les modalités d’abonnement, de facturation et de paiement sont détaillées dans les Conditions de paiement. Les tarifs peuvent évoluer; toute modification prend effet au prochain cycle après information.
          </p>

          <h2 className="text-xl font-semibold">5. Durée – Résiliation</h2>
          <p>
            L’abonnement se renouvelle tacitement chaque période. Vous pouvez résilier à tout moment avant l’échéance depuis votre espace. La résiliation prend effet à la fin de la période en cours.
          </p>

          <h2 className="text-xl font-semibold">6. Droit de rétractation</h2>
          <p>
            Pour les services numériques fournis immédiatement après consentement exprès et renoncement au droit de rétractation, ce droit peut ne pas s’appliquer ou être limité conformément au Code de la consommation.
          </p>

          <h2 className="text-xl font-semibold">7. Utilisation conforme</h2>
          <p>
            Vous vous engagez à ne pas détourner le service, à ne pas l’utiliser d’une manière illicite, nuisible ou portant atteinte aux droits de tiers, ni à tenter d’en altérer le fonctionnement.
          </p>

          <h2 className="text-xl font-semibold">8. Propriété intellectuelle</h2>
          <p>
            Les contenus, marques, logiciels et interfaces restent la propriété de leurs titulaires. Toute reproduction ou diffusion non autorisée est interdite.
          </p>

          <h2 className="text-xl font-semibold">9. Données personnelles</h2>
          <p>
            Le traitement des données est décrit dans les Mentions légales – section RGPD. Vous disposez des droits d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité.
          </p>

          <h2 className="text-xl font-semibold">10. Disponibilité et sécurité</h2>
          <p>
            {"Respira"} met en œuvre des mesures techniques et organisationnelles raisonnables pour assurer la disponibilité et la sécurité du service, sans garantie d’absence totale d’interruption.
          </p>

          <h2 className="text-xl font-semibold">11. Responsabilité</h2>
          <p>
            La responsabilité de {"Respira"} ne peut être engagée qu’en cas de faute prouvée et est limitée aux dommages directs et prévisibles. Aucune responsabilité pour les dommages indirects.
          </p>

          <h2 className="text-xl font-semibold">12. Support</h2>
          <p>
            Pour toute question, contactez le service client: <a href="mailto:service-client@respira-care.fr">service-client@respira-care.fr</a>.
          </p>

          <h2 className="text-xl font-semibold">13. Droit applicable – Litiges</h2>
          <p>
            Les CG sont soumises au droit français. Tout litige pourra être soumis à la médiation ou aux tribunaux compétents du ressort du siège de {"Respira"}, sous réserve des dispositions impératives.
          </p>
        </section>
      </article>
    </main>
  );
}
