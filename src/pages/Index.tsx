import { useEffect, useRef, useState } from "react";
import BreathingCoach from "@/components/BreathingCoach";
import AIAssistantStub from "@/components/AIAssistantStub";
import ThematicLibrary from "@/components/ThematicLibrary";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Menu } from "lucide-react";
import logoWordmark from "@/assets/respira-logo-wordmark.png";

const Index = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuthed(!!session));
    return () => subscription.unsubscribe();
  }, []);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--px", `${px}%`);
    el.style.setProperty("--py", `${py}%`);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      toast({ title: "Déconnecté" });
      window.location.assign('/auth');
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <nav className="container mx-auto flex items-center justify-between py-3">
          <a href="/" className="flex items-center gap-2">
            <img src={logoWordmark} alt="Logo Respira, application de relaxation" className="h-8 md:h-9" />
          </a>
          <button
            className="md:hidden p-2 rounded-md border hover:bg-muted/50"
            aria-label="Menu"
            onClick={() => setOpenNav((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#breathing" className="story-link">Respiration</a>
            <a href="#assistant" className="story-link">Aide IA</a>
            <a href="#library" className="story-link">Bibliothèque</a>
            <a href="#pricing" className="story-link">Tarif</a>
            <a href="#references" className="story-link">Références</a>
          </div>
          <div className="hidden md:flex gap-2">
            {!isAuthed ? (
              <a href="/auth"><Button variant="secondary">Se connecter</Button></a>
            ) : (
              <Button variant="secondary" onClick={handleSignOut}>Se déconnecter</Button>
            )}
            <a href="#breathing"><Button>Commencer</Button></a>
          </div>
        </nav>
        {openNav && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur animate-slide-in-right">
            <div className="container mx-auto py-3 flex flex-col gap-3">
              <a href="#breathing" onClick={() => setOpenNav(false)} className="text-sm">Respiration</a>
              <a href="#assistant" onClick={() => setOpenNav(false)} className="text-sm">Aide IA</a>
              <a href="#library" onClick={() => setOpenNav(false)} className="text-sm">Bibliothèque</a>
              <a href="#pricing" onClick={() => setOpenNav(false)} className="text-sm">Tarif</a>
              <a href="#references" onClick={() => setOpenNav(false)} className="text-sm">Références</a>
              <div className="flex gap-2 pt-2">
                {!isAuthed ? (
                  <a className="flex-1" href="/auth"><Button variant="secondary" className="w-full">Se connecter</Button></a>
                ) : (
                  <Button variant="secondary" onClick={() => { setOpenNav(false); handleSignOut(); }} className="flex-1">Se déconnecter</Button>
                )}
                <a className="flex-1" href="#breathing"><Button className="w-full">Commencer</Button></a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section
          ref={heroRef}
          onMouseMove={handlePointerMove}
          className="hero-surface calm-animated-bg border-b"
        >
          <div className="container mx-auto grid gap-10 py-16 md:py-24 md:grid-cols-2 items-center">
            <div className="space-y-6 animate-[fade-up_0.6s_ease]">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Respira: respiration guidée, soutien psychologique, et lectures apaisantes
              </h1>
              <p className="text-lg text-muted-foreground">
                Une application pour apaiser le stress et cultiver la résilience: exercices de respiration
                validés scientifiquement, aide textuelle empathique par IA, et bibliothèque de classiques
                du domaine public.
              </p>
              <div className="flex gap-3">
                <a href="#breathing"><Button>Respirer maintenant</Button></a>
                <a href="#pricing"><Button variant="secondary">Essai gratuit 2 jours</Button></a>
              </div>
              <p className="text-xs text-muted-foreground">Prix: 5,99€ (abonnement ou achat unique)</p>
            </div>
            <div className="flex justify-center md:justify-end">
              {/* Visual focus: breathing module preview */}
              <div className="rounded-xl border bg-card p-6">
                <BreathingCoach />
              </div>
            </div>
          </div>
        </section>

        <section id="breathing" className="container mx-auto py-16 md:py-24">
          <div className="max-w-3xl mb-8">
            <h2 className="text-3xl font-semibold">Chronomètre de respiration guidée</h2>
            <p className="mt-3 text-muted-foreground">
              Objectif: réduire le stress, améliorer la variabilité de la fréquence cardiaque (HRV) et
              favoriser l'activation parasympathique via des rythmes lents (~5–6 cycles/min).
              UX: guide visuel, minuteur de phases, choix de protocoles (box, cohérente, exhalation prolongée).
              Conformité: aligné sur des revues systématiques et méta-analyses récentes.
            </p>
          </div>
          <BreathingCoach />
        </section>

        <section id="assistant" className="container mx-auto py-16 md:py-24">
          <div className="max-w-3xl mb-8">
            <h2 className="text-3xl font-semibold">Module d'aide psychologique (IA)</h2>
            <p className="mt-3 text-muted-foreground">
              Objectif: offrir un espace d'expression et de soutien empathique (stress, anxiété, séparation,
              burn-out, deuil, solitude). Principes: psychoéducation, thérapies brèves, pleine conscience.
              UX: zone de texte libre, réponses structurées et chaleureuses, suggestions d'exercices.
              Éthique: pas de conseils médicaux; orientation vers des professionnels en cas de besoin.
            </p>
          </div>
          <AIAssistantStub />
        </section>

        <section id="library" className="container mx-auto py-16 md:py-24">
          <div className="max-w-3xl mb-8">
            <h2 className="text-3xl font-semibold">Bibliothèque thématique de livres</h2>
            <p className="mt-3 text-muted-foreground">
              Objectif: soutenir émotionnellement par des œuvres adaptées aux thématiques personnelles
              (séparation, deuil, burn-out, solitude, estime de soi, anxiété, résilience). Conformité: mise
              en avant de livres libres de droits (domaine public) pour un accès légal et durable.
            </p>
          </div>
          <ThematicLibrary />
        </section>

        <section id="pricing" className="container mx-auto py-16 md:py-24">
          <div className="rounded-xl border p-6 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold">Tarif simple et accessible</h2>
              <p className="mt-3 text-muted-foreground">
                Prix: 5,99€ (abonnement ou achat unique au choix). Essai gratuit de 2 jours pour découvrir
                l'expérience, sans engagement.
              </p>
              <ul className="mt-4 text-sm space-y-2 list-disc pl-5 text-muted-foreground">
                <li>Respiration guidée illimitée</li>
                <li>Aide psychologique textuelle (IA) — expérimentation encadrée</li>
                <li>Bibliothèque thématique du domaine public</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button className="h-12">Démarrer l'essai gratuit (2 jours)</Button>
              <Button variant="secondary" className="h-12">Accéder à la respiration maintenant</Button>
              <p className="text-xs text-muted-foreground">Le parcours d'achat sera activé lors de l'intégration Stripe.</p>
            </div>
          </div>
        </section>

        <section id="marketing" className="container mx-auto py-16 md:py-24">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold">Pourquoi Respira ?</h2>
            <ul className="mt-4 grid md:grid-cols-2 gap-4 text-muted-foreground">
              <li className="rounded-lg border p-4">
                Protocoles inspirés par la littérature scientifique (respiration lente, HRV, exhalation prolongée).
              </li>
              <li className="rounded-lg border p-4">
                Expérience apaisante: visuels doux, interactions fluides, sans surcharge.
              </li>
              <li className="rounded-lg border p-4">
                Soutien empathique: réponses IA encadrées, éthiques et non-jugeantes.
              </li>
              <li className="rounded-lg border p-4">
                Lectures choisies pour résonner avec vos thèmes de vie, sans droits d'auteur.
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Pitch prêt à diffuser</h3>
              <p className="mt-2 text-muted-foreground">
                Respira est l'application qui apaise et renforce: des exercices de respiration
                validés, un soutien psychologique IA empathique, et une bibliothèque de classiques du
                domaine public pour vous accompagner dans les moments clés. Essayez gratuitement pendant 2 jours —
                respirez, recentrez-vous, et avancez avec sérénité.
              </p>
            </div>
          </div>
        </section>

        <section id="references" className="container mx-auto py-16 md:py-24">
          <h2 className="text-3xl font-semibold">Références scientifiques</h2>
          <ol className="mt-4 space-y-3 text-muted-foreground text-sm list-decimal pl-5">
            <li>
              Clinical effectiveness of guided breathing exercises in reducing anxiety, stress, and depression in COVID‑19 patients. Scientific Reports (Nature Portfolio), 2024.
              <a className="ml-2 underline" href="https://www.nature.com/articles/s41598-024-78162-3" target="_blank" rel="noopener noreferrer">Lire</a>
            </li>
            <li>
              Effect of breathwork on stress and mental health: A meta-analysis of randomized-controlled trials. Scientific Reports, 2022.
              <a className="ml-2 underline" href="https://www.nature.com/articles/s41598-022-27247-y" target="_blank" rel="noopener noreferrer">Lire</a>
            </li>
            <li>
              Effects of voluntary slow breathing on heart rate and heart rate variability: a systematic review and meta-analysis. PubMed, 2022.
              <a className="ml-2 underline" href="https://pubmed.ncbi.nlm.nih.gov/35623448/" target="_blank" rel="noopener noreferrer">Lire</a>
            </li>
            <li>
              How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing. Frontiers in Human Neuroscience, 2018.
              <a className="ml-2 underline" href="https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2018.00353/full" target="_blank" rel="noopener noreferrer">Lire</a>
            </li>
            <li>
              Comparing the Effects of Square, 4-7-8, and 6 Breaths-per-Minute Breathing Conditions on HRV, CO2, and Mood. PubMed, 2024.
              <a className="ml-2 underline" href="https://pubmed.ncbi.nlm.nih.gov/39864026/" target="_blank" rel="noopener noreferrer">Lire</a>
            </li>
            <li>
              Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 2023.
              <a className="ml-2 underline" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener noreferrer">Lire</a>
            </li>
          </ol>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Respira — Ce produit ne remplace pas un avis médical.
        </div>
      </footer>
    </div>
  );
};

export default Index;
