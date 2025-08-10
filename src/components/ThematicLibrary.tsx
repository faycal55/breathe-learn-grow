import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookItem {
  title: string;
  author: string;
  theme: string;
  url: string;
}

const books: BookItem[] = [
  { title: "Les Contemplations", author: "Victor Hugo", theme: "Deuil, résilience", url: "https://fr.wikisource.org/wiki/Les_Contemplations_(Hugo)" },
  { title: "Le Horla", author: "Guy de Maupassant", theme: "Solitude, anxiété", url: "https://fr.wikisource.org/wiki/Le_Horla_(recueil)" },
  { title: "Candide ou l’Optimisme", author: "Voltaire", theme: "Résilience, sens", url: "https://fr.wikisource.org/wiki/Candide_ou_l%E2%80%99Optimisme" },
  { title: "Essais", author: "Montaigne", theme: "Estime de soi, sagesse", url: "https://fr.wikisource.org/wiki/Essais_(Montaigne)" },
  { title: "Pensées", author: "Blaise Pascal", theme: "Anxiété existentielle", url: "https://fr.wikisource.org/wiki/Pens%C3%A9es_(%C3%A9dition_Brunschvicg)" },
  { title: "Du côté de chez Swann", author: "Marcel Proust", theme: "Séparation, mémoire", url: "https://fr.wikisource.org/wiki/Du_c%C3%B4t%C3%A9_de_chez_Swann" },
];

export default function ThematicLibrary() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Bibliothèque thématique (domaine public)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Sélection d'œuvres libres de droits (Wikisource / domaine public). Idéal pour explorer des
          thèmes comme la séparation, le deuil, le burn-out, la solitude, l'estime de soi, l'anxiété
          et la résilience.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((b) => (
            <a key={b.url} href={b.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{b.title}</h3>
                <Badge variant="secondary">{b.theme}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{b.author}</p>
              <p className="text-xs text-muted-foreground mt-2">Ouverture dans un nouvel onglet · Domaine public</p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
