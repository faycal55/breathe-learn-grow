import { Helmet } from "react-helmet-async";
import BreathingCoach from "@/components/BreathingCoach";

export default function Breathing() {
  return (
    <section className="space-y-4">
      <Helmet>
        <title>Respiration guidée | Respira</title>
        <meta name="description" content="Exercice de respiration cohérente avec animation fluide d’inspiration/expiration." />
        <link rel="canonical" href="/dashboard/breathing" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Chronomètre de respiration guidée</h1>
      <BreathingCoach />
    </section>
  );
}
