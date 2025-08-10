import { Helmet } from "react-helmet-async";

export default function Legal() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Helmet>
        <title>Mentions légales | Respira</title>
        <meta name="description" content="Mentions légales de Respira: éditeur, hébergement, contact et responsabilités." />
        <link rel="canonical" href={`${window.location.origin}/legal`} />
      </Helmet>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Mentions légales</h1>
        </header>
        <section className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
          <p>Ce site est édité par Respira. Pour toute question, contactez-nous via l'espace client.</p>
          <h2 className="text-xl font-semibold">Éditeur</h2>
          <p>Respira, plateforme d'accompagnement bien-être. Adresse et informations disponibles sur demande.</p>
          <h2 className="text-xl font-semibold">Hébergement</h2>
          <p>Hébergé par des services cloud sécurisés. Les données sont protégées conformément aux lois applicables.</p>
          <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
          <p>Tous les contenus (textes, images, marques) sont la propriété de leurs détenteurs respectifs.</p>
          <h2 className="text-xl font-semibold">Responsabilités</h2>
          <p>Les exercices et informations proposés n'ont pas vocation à remplacer un avis médical.</p>
        </section>
      </article>
    </main>
  );
}
