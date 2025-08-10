import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AIAssistantStub from "@/components/AIAssistantStub";
import BreathingCoach from "@/components/BreathingCoach";

interface Conversation { id: string; title: string | null; created_at: string }

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConv, setLoadingConv] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth", { replace: true });
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchConversations = async () => {
    if (!userId) return;
    setLoadingConv(true);
    const { data, error } = await supabase
      .from("conversations")
      .select("id,title,created_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setConversations(data || []);
      if (!selectedId && (data?.length ?? 0) > 0) setSelectedId(data![0].id);
    }
    setLoadingConv(false);
  };

  useEffect(() => { fetchConversations(); }, [userId]);

  const createConversation = async () => {
    if (!userId) return;
    const title = `Consultation du ${new Date().toLocaleDateString()}`;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title })
      .select("id").single();
    if (error) {
      toast({ title: "Création impossible", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Nouvelle consultation" });
      setSelectedId(data.id);
      fetchConversations();
    }
  };

  const tracks = useMemo(() => ([
    { title: "Deep Tones", src: "/audio/deep-tones.mp3" },
    { title: "Aquarium", src: "/audio/aquarium.mp3" },
    { title: "Consecrated Ground", src: "/audio/consecrated-ground.mp3" },
    { title: "Connecting Rainbows", src: "/audio/connecting-rainbows.mp3" },
  ]), []);

  const library = useMemo(() => ({
    "Dépression": [
      { title: "Back from the Bluez – Module 2", url: "https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/Back-from-The-Bluez/Back-from-the-Bluez---02---Behavioural-Strategies.pdf" },
      { title: "Back from the Bluez – Module 3", url: "https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/Back-from-The-Bluez/Back-from-the-Bluez---03---The-Thinking-Feeling-Connection.pdf" },
      { title: "Back from the Bluez – Module 4", url: "https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/Back-from-The-Bluez/Back-from-the-Bluez---04---The-ABC-Analysis.pdf" },
      { title: "Back from the Bluez – Module 5", url: "https://www.cci.health.wa.gov.au/~/media/CCI/Consumer-Modules/Back-from-The-Bluez/Back-from-the-Bluez---05---Unhelpful-Thinking-Styles.pdf" },
    ],
    "Anxiété & Inquiétude": [
      { title: "What? Me Worry!? – Module 2", url: "https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/What-Me-Worry/What-Me-Worry---02---Overview-of-Worry.pdf" },
      { title: "What? Me Worry!? – Module 3", url: "https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/What-Me-Worry/What-Me-Worry--03--Negative-Beliefs-About-Worry-Uncontrollability.pdf" },
      { title: "What? Me Worry!? – Module 5", url: "https://www.cci.health.wa.gov.au/~/media/CCI/Consumer-Modules/What-Me-Worry/What-Me-Worry--05--Negative-Beliefs-About-Worry-Danger.pdf" },
      { title: "Health Anxiety (Guide NHS)", url: "https://selfhelp.cntw.nhs.uk/self-help-guides/health-anxiety" },
    ],
    "Sommeil & Stress": [
      { title: "Doing What Matters in Times of Stress (OMS)", url: "https://apps.who.int/iris/bitstream/handle/10665/331901/9789240003927-eng.pdf" },
      { title: "Mindfulness – Relaxation downloads (NHS)", url: "https://selfhelp.cntw.nhs.uk/self-help-guides/health-anxiety#guide" },
      { title: "Aquifer Sleep Workbook (open)", url: "https://www.med.unc.edu/neurology/wp-content/uploads/sites/716/2023/05/Sleep-Workbook.pdf" },
    ],
    "Estime de soi & Perfectionnisme": [
      { title: "Perfectionism in Perspective – Module (CCI)", url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Perfectionism" },
      { title: "Improving Self-Esteem (CCI)", url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Self-Esteem" },
    ],
    "Psychologie – Manuels ouverts": [
      { title: "OpenStax – Psychology 2e", url: "https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/Psychology2e-OP.pdf" },
      { title: "Principles of Social Psychology (Open Textbook)", url: "https://open.umn.edu/opentextbooks/textbooks/26" },
      { title: "Research Methods in Psychology", url: "https://open.umn.edu/opentextbooks/textbooks/79" },
      { title: "Biopsychology (Open Textbook)", url: "https://open.umn.edu/opentextbooks/textbooks/481" },
      { title: "Lifespan Development (OpenStax)", url: "https://d3bxy9euw4e147.cloudfront.net/oscms-prodcms/media/documents/LifespanDevelopment3e-OP.pdf" },
      { title: "Statistics for Psychology (Open)", url: "https://psyteachr.github.io/msc-data-skills/" },
    ],
    "Panic & Phobies": [
      { title: "Panic Stations (CCI)", url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Panic" },
      { title: "Facing Your Fears (CCI)", url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Anxiety" },
      { title: "Social Anxiety (CCI)", url: "https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Social-Anxiety" },
    ],
  }), []);

  const handleMailto = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (document.getElementById("supportName") as HTMLInputElement)?.value || "";
    const email = (document.getElementById("supportEmail") as HTMLInputElement)?.value || "";
    const message = (document.getElementById("supportMessage") as HTMLTextAreaElement)?.value || "";
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:dzdz1998dz@gmail.com?subject=Support%20Respira&body=${body}`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="h-12 flex items-center border-b px-3 gap-3">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Espace Client</h1>
            <div className="ml-auto">
              <Button variant="secondary" onClick={() => navigate("/home")}>Site</Button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6 space-y-12">
            <section id="consultations" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Mes consultations</h2>
                <Button onClick={createConversation}>Nouvelle consultation</Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Historique</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {loadingConv && <p className="text-sm text-muted-foreground">Chargement…</p>}
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedId(c.id)}
                        className={`w-full text-left px-3 py-2 rounded-md border hover:bg-muted ${selectedId===c.id?"bg-muted":""}`}
                      >
                        <div className="text-sm font-medium truncate">{c.title || "Sans titre"}</div>
                        <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
                      </button>
                    ))}
                    {conversations.length === 0 && !loadingConv && (
                      <p className="text-sm text-muted-foreground">Aucune consultation pour le moment.</p>
                    )}
                  </CardContent>
                </Card>
                <div className="md:col-span-2">
                  <AIAssistantStub conversationId={selectedId || undefined} />
                </div>
              </div>
            </section>

            <Separator />

            <section id="breathing" className="space-y-4">
              <h2 className="text-2xl font-semibold">Chronomètre de respiration guidée</h2>
              <BreathingCoach />
            </section>

            <section id="playlist" className="space-y-4">
              <h2 className="text-2xl font-semibold">Playlist apaisante (libre de droits)</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tracks.map((t) => (
                  <Card key={t.src}>
                    <CardHeader>
                      <CardTitle className="text-lg">{t.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <audio controls preload="none" className="w-full">
                        <source src={t.src} type="audio/mpeg" />
                        Votre navigateur ne supporte pas l'audio HTML5.
                      </audio>
                      <p className="text-xs text-muted-foreground mt-2">Source: freepd.com (domaine public)</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="library" className="space-y-4">
              <h2 className="text-2xl font-semibold">Bibliothèque thématique</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(library).map(([theme, items]) => (
                  <Card key={theme}>
                    <CardHeader>
                      <CardTitle className="text-lg">{theme}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        {items.map((it) => (
                          <li key={it.title}>
                            <a className="underline" href={it.url} target="_blank" rel="noopener noreferrer">{it.title}</a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="subscription" className="space-y-4">
              <h2 className="text-2xl font-semibold">Abonnement</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">7,99€ / mois — sans période d'essai.</p>
                  <div className="mt-4 flex gap-3">
                    <Button disabled title="Stripe bientôt">S'abonner (bientôt)</Button>
                    <Button variant="secondary" onClick={() => navigate("/auth")}>Se connecter</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Le paiement Stripe sera activé dès la configuration de la clé secrète et du prix.</p>
                </CardContent>
              </Card>
            </section>

            <section id="support" className="space-y-4">
              <h2 className="text-2xl font-semibold">Support</h2>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input id="supportName" placeholder="Nom et prénom" />
                    <Input id="supportEmail" type="email" placeholder="Email" />
                  </div>
                  <Textarea id="supportMessage" placeholder="Votre message" rows={5} />
                  <div className="flex gap-3">
                    <Button onClick={handleMailto}>Envoyer par email</Button>
                    <a className="underline text-sm self-center" href="mailto:dzdz1998dz@gmail.com">Contact direct: dzdz1998dz@gmail.com</a>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
