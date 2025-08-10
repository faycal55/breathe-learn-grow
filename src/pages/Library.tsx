import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Work { title: string; author: string; url: string }

const CATEGORIES: Record<string, Work[]> = {
  "Deuil & Résilience": [
    { title: "Les Contemplations", author: "Victor Hugo", url: "https://fr.wikisource.org/wiki/Les_Contemplations_(Hugo)" },
    { title: "Méditations poétiques", author: "Alphonse de Lamartine", url: "https://fr.wikisource.org/wiki/M%C3%A9ditations_po%C3%A9tiques_(Lamartine)" },
    { title: "Mémoires d’outre-tombe", author: "François-René de Chateaubriand", url: "https://fr.wikisource.org/wiki/M%C3%A9moires_d%E2%80%99outre-tombe" },
    { title: "Poésies nouvelles", author: "Alfred de Musset", url: "https://fr.wikisource.org/wiki/Po%C3%A9sies_nouvelles_(Musset)" },
    { title: "Les Fleurs du mal (sélection)", author: "Charles Baudelaire", url: "https://fr.wikisource.org/wiki/Les_Fleurs_du_mal_(1861)" },
  ],
  "Solitude & Anxiété": [
    { title: "Le Horla", author: "Guy de Maupassant", url: "https://fr.wikisource.org/wiki/Le_Horla_(recueil)" },
    { title: "La Peur", author: "Guy de Maupassant", url: "https://fr.wikisource.org/wiki/La_Peur_(Maupassant)" },
    { title: "Pensées", author: "Blaise Pascal", url: "https://fr.wikisource.org/wiki/Pens%C3%A9es_(%C3%A9dition_Brunschvicg)" },
    { title: "Les Confessions", author: "Jean-Jacques Rousseau", url: "https://fr.wikisource.org/wiki/Les_Confessions_(Rousseau)" },
    { title: "Les Caractères", author: "Jean de La Bruyère", url: "https://fr.wikisource.org/wiki/Les_Caract%C3%A8res" },
  ],
  "Estime de soi & Sagesse": [
    { title: "Essais", author: "Michel de Montaigne", url: "https://fr.wikisource.org/wiki/Essais_(Montaigne)" },
    { title: "Discours de la méthode", author: "René Descartes", url: "https://fr.wikisource.org/wiki/Discours_de_la_m%C3%A9thode" },
    { title: "Lettres à Lucilius", author: "Sénèque", url: "https://fr.wikisource.org/wiki/Lettres_%C3%A0_Lucilius" },
    { title: "Maximes", author: "La Rochefoucauld", url: "https://fr.wikisource.org/wiki/Maximes_(1678)" },
    { title: "La Princesse de Clèves", author: "Madame de La Fayette", url: "https://fr.wikisource.org/wiki/La_Princesse_de_Cl%C3%A8ves" },
  ],
  "Mémoire & Séparation": [
    { title: "Du côté de chez Swann", author: "Marcel Proust", url: "https://fr.wikisource.org/wiki/Du_c%C3%B4t%C3%A9_de_chez_Swann" },
    { title: "Madame Bovary", author: "Gustave Flaubert", url: "https://fr.wikisource.org/wiki/Madame_Bovary" },
    { title: "Manon Lescaut", author: "Abbé Prévost", url: "https://fr.wikisource.org/wiki/Manon_Lescaut" },
    { title: "Carmen", author: "Prosper Mérimée", url: "https://fr.wikisource.org/wiki/Carmen_(M%C3%A9rim%C3%A9e)" },
    { title: "Lettres (sélection)", author: "Madame de Sévigné", url: "https://fr.wikisource.org/wiki/Lettres_de_la_Marquise_de_S%C3%A9vign%C3%A9" },
  ],
};

export default function Library() {
  return (
    <section className="space-y-6">
      <Helmet>
        <title>Bibliothèque thématique FR | Respira</title>
        <meta name="description" content="Œuvres en langue française, domaine public, classées par thèmes (≥5 par thème)." />
        <link rel="canonical" href="/dashboard/library" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Bibliothèque thématique (FR – domaine public)</h1>
      <p className="text-sm text-muted-foreground">Sélection d’œuvres libres de droits (Wikisource) classées par thèmes.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(CATEGORIES).map(([theme, items]) => (
          <Card key={theme}>
            <CardHeader>
              <CardTitle className="text-lg">{theme}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {items.map((it) => (
                  <li key={`${theme}-${it.title}`}>
                    <a className="underline" href={it.url} target="_blank" rel="noopener noreferrer" aria-label={`${it.title} – ${it.author}`}>{it.title} — {it.author}</a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
