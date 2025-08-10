import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Track { title: string; src: string; source: string }

// Streaming externe (FreePD - CC0). Les liens pointent vers les fichiers distants.
const THEMES: Record<string, Track[]> = {
  "Sons pour dormir (apaisants)": [
    { title: "Deep Tones", src: "https://freepd.com/music/Deep%20Tones.mp3", source: "freepd.com (CC0)" },
    { title: "Aquarium", src: "https://freepd.com/music/Aquarium.mp3", source: "freepd.com (CC0)" },
  ],
  "Sons motivants": [
    { title: "Connecting Rainbows", src: "https://freepd.com/music/Connecting%20Rainbows.mp3", source: "freepd.com (CC0)" },
    { title: "Consecrated Ground", src: "https://freepd.com/music/Consecrated%20Ground.mp3", source: "freepd.com (CC0)" },
  ],
  "Sons inspirants": [
    { title: "Aquarium", src: "https://freepd.com/music/Aquarium.mp3", source: "freepd.com (CC0)" },
    { title: "Deep Tones", src: "https://freepd.com/music/Deep%20Tones.mp3", source: "freepd.com (CC0)" },
  ],
};

export default function Playlist() {
  return (
    <section className="space-y-6">
      <Helmet>
        <title>Playlist apaisante par thèmes | Respira</title>
        <meta name="description" content="Écoutez des sons libres par thème: dormir, motivation, inspiration." />
        <link rel="canonical" href="/dashboard/playlist" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Playlist apaisante par thèmes</h1>
      <p className="text-sm text-muted-foreground">Streaming direct depuis FreePD (CC0). J’ajouterai pluie/mer/vent/forêt/cheminée (30 min) via Internet Archive ensuite.</p>
      {Object.entries(THEMES).map(([theme, tracks]) => (
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
