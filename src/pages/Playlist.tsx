import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Track { title: string; src: string; source: string }

// Streaming externe (FreePD - CC0) et fichiers locaux (public/audio)
const THEMES: Record<string, Track[]> = {
  "Sons pour dormir (apaisants)": [
    { title: "Deep Tones", src: "/audio/deep-tones.mp3", source: "Local (freepd.com, CC0)" },
    { title: "Aquarium", src: "/audio/aquarium.mp3", source: "Local (freepd.com, CC0)" },
  ],
  "Sons motivants": [
    { title: "Connecting Rainbows", src: "/audio/connecting-rainbows.mp3", source: "Local (freepd.com, CC0)" },
    { title: "Consecrated Ground", src: "/audio/consecrated-ground.mp3", source: "Local (freepd.com, CC0)" },
  ],
  // Thèmes à compléter (streams CC0 à venir)
  "Pluie (rain)": [],
  "Mer (vagues)": [],
  "Vent": [],
  "Forêt": [],
  "Cheminée": [],
  "Ville (ambiance urbaine)": [],
  "Avion (cabine)": [],
  "Yoga / Relaxation": [],
  "Rêverie / Inspirant": [],
};

export default function Playlist() {
  return (
    <section className="space-y-6">
      <Helmet>
        <title>Playlist apaisante par thèmes | Respira</title>
        <meta name="description" content="Sons apaisants locaux (CC0) + streaming: pluie, mer, vent, forêt, cheminée, ville, avion, yoga." />
        <link rel="canonical" href="/dashboard/playlist" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Playlist apaisante par thèmes</h1>
      <p className="text-sm text-muted-foreground">Lecture depuis des fichiers locaux (CC0) et, bientôt, streaming 30 min: pluie, mer, vent, forêt, cheminée, ville, avion, yoga.</p>
      {Object.entries(THEMES).filter(([, tracks]) => tracks.length > 0).map(([theme, tracks]) => (
        <div key={theme} className="space-y-3">
          <h2 className="text-xl font-semibold">{theme}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tracks.map((t) => (
              <Card key={`${theme}-${t.src}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <audio controls preload="none" className="w-full" crossOrigin="anonymous">
                    <source src={t.src} type="audio/mpeg" />
                    Votre navigateur ne supporte pas l'audio HTML5.
                  </audio>
                  <p className="text-xs text-muted-foreground mt-2">Source: {t.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
