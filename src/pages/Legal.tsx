import { Helmet } from "react-helmet-async";

export default function Legal() {
  const siteName = "Respira";
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : "";
  const canonical = `${baseUrl}/legal`;

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Respira',
    url: baseUrl,
    contactPoint: [{
      '@type': 'ContactPoint',
      email: 'service-client@respira-care.fr',
      contactType: 'customer support',
      availableLanguage: ['fr']
    }]
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>Mentions légales et RGPD | Respira</title>
        <meta name="description" content="Mentions légales professionnelles et politique RGPD de Respira: éditeur, hébergeur, données personnelles, cookies, contact." />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Mentions légales</h1>
        </header>
        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <h2 className="text-xl font-semibold">Éditeur du site</h2>
          <p>
            {siteName}, plateforme d’accompagnement bien-être et exercices de respiration. 
            Email de contact&nbsp;: <a href="mailto:service-client@respira-care.fr">service-client@respira-care.fr</a>.
          </p>

          <h2 className="text-xl font-semibold">Hébergement</h2>
          <p>
            Site hébergé sur une infrastructure cloud sécurisée dans l’Union européenne. 
            La haute disponibilité, la sauvegarde et la sécurité physique et logique sont assurées par le prestataire d’hébergement.
          </p>

          <h2 className="text-xl font-semibold">Directeur de la publication</h2>
          <p>Le représentant légal de {siteName}.</p>

          <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus (textes, visuels, logos, marques, interfaces) est protégé par le droit d’auteur et le droit des marques. 
            Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, sans autorisation préalable est interdite.
          </p>

          <h2 className="text-xl font-semibold">Responsabilité</h2>
          <p>
            Les informations et exercices proposés ont une vocation de bien-être et d’accompagnement et ne se substituent pas à un avis médical.
            {" "}Le {siteName} ne saurait être tenu responsable de l’usage qui en est fait par l’utilisateur.
          </p>

          <h2 className="text-xl font-semibold">Protection des données (RGPD)</h2>
          <p>
            {siteName} agit en qualité de responsable de traitement au sens du RGPD. Les données collectées sont limitées au nécessaire (principe de minimisation) pour permettre la création et la gestion du compte, l’accès aux services, la facturation et le support client.
          </p>
          <ul>
            <li>Base légale&nbsp;: exécution du contrat (CG), intérêt légitime (amélioration du service) et obligation légale (comptabilité).</li>
            <li>Finalités&nbsp;: authentification, gestion d’abonnement, statistiques d’usage agrégées, assistance.</li>
            <li>Destinataires&nbsp;: personnel habilité et prestataires techniques (hébergement, paiement, emailing) engagés à la confidentialité.</li>
            <li>Transferts&nbsp;: lorsque des transferts hors UE sont nécessaires, ils s’appuient sur des garanties adéquates (clauses contractuelles types, pays adéquats).</li>
            <li>Durées de conservation&nbsp;: le temps de la relation contractuelle augmenté des délais légaux (ex. facturation&nbsp;: 10 ans).</li>
          </ul>
          <p>
            Droits des personnes&nbsp;: accès, rectification, effacement, limitation, opposition, portabilité et directives post-mortem. 
            Exercez vos droits en écrivant à <a href="mailto:service-client@respira-care.fr">service-client@respira-care.fr</a>. 
            En cas de difficulté, vous pouvez saisir la CNIL.
          </p>

          <h2 className="text-xl font-semibold">Cookies et traceurs</h2>
          <p>
            Le site peut utiliser des cookies strictement nécessaires au fonctionnement. Les cookies de mesure d’audience ou de personnalisation ne sont déposés qu’avec votre consentement. 
            Vous pouvez à tout moment gérer vos préférences via votre navigateur.
          </p>

          <h2 className="text-xl font-semibold">Sécurité</h2>
          <p>
            {siteName} met en œuvre des mesures techniques et organisationnelles appropriées (chiffrement en transit, contrôle d’accès, journalisation) pour garantir la confidentialité et l’intégrité des données.
          </p>

          <h2 className="text-xl font-semibold">Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du siège social de {siteName}, sous réserve des dispositions légales impératives.
          </p>
        </section>
      </article>
    </main>
  );
}
