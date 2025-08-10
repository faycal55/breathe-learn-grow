import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AIAssistantStub from "@/components/AIAssistantStub";

interface Conversation { id: string; title: string | null; created_at: string }

export default function Consultations() {
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

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Mes consultations | Respira</title>
        <meta name="description" content="Historique et nouvelle consultation avec l’assistant IA professionnel" />
        <link rel="canonical" href="/dashboard/consultations" />
      </Helmet>
      <h1 className="text-2xl font-semibold">Mes consultations</h1>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Gérez votre historique et démarrez une nouvelle consultation.</p>
        <Button onClick={() => {/* create new conversation inline like in dashboard */ navigate(0); }} title="Créer depuis l’assistant">Nouveau via assistant</Button>
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
    </div>
  );
}
