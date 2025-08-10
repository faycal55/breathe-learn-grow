import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const exercises = [
  {
    id: "coherence",
    title: "Respiration cohérente (6 cycles/min)",
    duration: "5–10 min",
    benefits: "Apaise le système nerveux, améliore la variabilité cardiaque.",
    steps: [
      "Asseyez‑vous confortablement, dos droit, épaules relâchées.",
      "Inspirez par le nez pendant 5–6 secondes.",
      "Expirez par la bouche pendant 5–6 secondes (sans forcer).",
      "Répétez en douceur, en vous concentrant sur le va‑et‑vient de l’air.",
      "Si l’esprit vagabonde, ramenez‑le gentiment à la respiration.",
    ],
    cta: { label: "Lancer l'exercice", to: "/dashboard/breathing" },
  },
  {
    id: "box",
    title: "Respiration carrée (4‑4‑4‑4)",
    duration: "3–6 min",
    benefits: "Stabilise l’attention, réduit le stress aigu.",
    steps: [
      "Inspirez 4 secondes.",
      "Retenez 4 secondes.",
      "Expirez 4 secondes.",
      "Retenez 4 secondes.",
      "Répétez lentement pendant quelques minutes.",
    ],
  },
  {
    id: "478",
    title: "Respiration 4‑7‑8",
    duration: "2–4 min",
    benefits: "Favorise l’endormissement et la détente.",
    steps: [
      "Inspirez 4 secondes par le nez.",
      "Retenez 7 secondes (sans crispation).",
      "Expirez 8 secondes par la bouche (souffle long).",
      "Répétez 4 à 8 cycles.",
    ],
  },
  {
    id: "pmr",
    title: "Relaxation musculaire progressive",
    duration: "8–12 min",
    benefits: "Diminution des tensions corporelles et mentales.",
    steps: [
      "Allongez‑vous ou asseyez‑vous confortablement.",
      "Pour chaque groupe musculaire (poings, avant‑bras, biceps, visage, épaules, ventre, cuisses, mollets, pieds) : contractez 5 secondes puis relâchez 10–15 secondes.",
      "Observez la différence entre tension et détente.",
    ],
  },
  {
    id: "scan",
    title: "Scan corporel (pleine conscience)",
    duration: "8–15 min",
    benefits: "Améliore l’ancrage et l’écoute du corps.",
    steps: [
      "Fermez les yeux et parcourez mentalement le corps des pieds à la tête.",
      "À chaque zone, observez sensations, chaleur, tension, fourmillements…",
      "Respirez dedans et laissez se détendre sans juger.",
    ],
  },
  {
    id: "grounding",
    title: "Ancrage 5‑4‑3‑2‑1",
    duration: "3–5 min",
    benefits: "Réduit l’anxiété et ramène au présent.",
    steps: [
      "Nommez 5 choses que vous voyez.",
      "4 choses que vous pouvez toucher.",
      "3 sons que vous entendez.",
      "2 odeurs que vous sentez.",
      "1 goût en bouche.",
    ],
  },
  {
    id: "walk",
    title: "Marche consciente",
    duration: "5–15 min",
    benefits: "Active en douceur et apaise l’esprit.",
    steps: [
      "Marchez lentement en remarquant le contact des pieds avec le sol.",
      "Synchronisez éventuellement le pas avec une respiration calme.",
      "Quand l’esprit part, revenez aux sensations des pas.",
    ],
  },
  {
    id: "visualisation",
    title: "Visualisation apaisante",
    duration: "5–8 min",
    benefits: "Renforce le sentiment de sécurité intérieure.",
    steps: [
      "Fermez les yeux et imaginez un lieu sûr et agréable.",
      "Décrivez mentalement les couleurs, sons, odeurs et sensations.",
      "Respirez lentement en restant dans ce décor.",
    ],
  },
];

export default function Guides() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: exercises.map((ex, i) => ({
      "@type": "HowTo",
      position: i + 1,
      name: ex.title,
      totalTime: ex.duration,
      step: ex.steps.map((s, idx) => ({ "@type": "HowToStep", position: idx + 1, name: s })),
    })),
  } as const;

  return (
    <section className="space-y-6">
      <Helmet>
        <title>Guides respiration & exercices | Respira</title>
        <meta name="description" content="Tous les exercices proposés par l’IA: respiration, relaxation, ancrage, marche consciente. Étapes détaillées pour bien pratiquer." />
        <link rel="canonical" href="/dashboard/guides" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <h1 className="text-2xl font-semibold">Guides respiration & exercices</h1>
      <p className="text-muted-foreground">Retrouvez ici les activités souvent proposées dans votre planning personnalisé et leurs étapes détaillées.</p>
      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        {exercises.map((ex) => (
          <Card key={ex.id}>
            <CardHeader>
              <CardTitle className="text-lg">{ex.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Durée: {ex.duration} · {ex.benefits}</div>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                {ex.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              {ex.cta && (
                <Button asChild>
                  <Link to={ex.cta.to}>{ex.cta.label}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
