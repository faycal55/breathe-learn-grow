import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Track { title: string; src: string; source: string }

// Fichiers locaux (public/audio) et titres classés par thème
const THEMES: Record<string, Track[]> = {
  "Sons pour dormir (apaisants)": [
    { title: "Deep Tones", src: "/audio/deep-tones.mp3", source: "Local (freepd.com)" },
    { title: "Aquarium", src: "/audio/aquarium.mp3", source: "Local (freepd.com)" },
  ],
  "Sons motivants": [
    { title: "Connecting Rainbows", src: "/audio/connecting-rainbows.mp3", source: "Local (freepd.com)" },
    { title: "Consecrated Ground", src: "/audio/consecrated-ground.mp3", source: "Local (freepd.com)" },
    { title: "Motivational Anthem", src: "/audio/motivational-anthem.mp3", source: "Internet Archive" },
  ],
  "Pluie (rain)": [
    { title: "Pluie légère", src: "/audio/rain-light.ogg", source: "Wikimedia Commons" },
  ],
  "Mer (vagues)": [
    { title: "Vagues océaniques", src: "/audio/ocean-waves.ogg", source: "Wikimedia Commons" },
  ],
  "Vent": [
    { title: "Vent dans la forêt", src: "/audio/wind-forest.ogg", source: "Wikimedia Commons" },
  ],
  "Forêt": [
    { title: "Oiseaux en forêt", src: "/audio/forest-birds.ogg", source: "Wikimedia Commons" },
  ],
  "Cheminée": [
    { title: "Feu de cheminée", src: "/audio/fireplace.ogg", source: "Wikimedia Commons" },
  ],
  "Ville (ambiance urbaine)": [
    { title: "Ambiance urbaine", src: "/audio/city-ambience.ogg", source: "Wikimedia Commons" },
    { title: "Centre commercial", src: "/audio/city-mall.ogg", source: "Wikimedia Commons" },
  ],
  "Avion (cabine)": [
    { title: "Annonces d'aéroport", src: "/audio/airport-bulletin.ogg", source: "Wikimedia Commons" },
  ],
  "Yoga / Relaxation": [
    { title: "Fréquence 528 Hz", src: "/audio/yoga-528hz.mp3", source: "Internet Archive" },
    { title: "Fréquence 417 Hz", src: "/audio/yoga-417hz.mp3", source: "Internet Archive" },
  ],
  "Rêverie / Inspirant": [
    { title: "Serene View", src: "/audio/serene-view.mp3", source: "Internet Archive" },
    { title: "Joy of Travel", src: "/audio/joy-of-travel.mp3", source: "Internet Archive" },
  ],
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
