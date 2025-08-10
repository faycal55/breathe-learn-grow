import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Chat message type
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const THEMES = [
  "Anxiété",
  "Solitude",
  "Deuil",
  "Séparation",
  "Burn-out",
  "Estime de soi",
  "Résilience",
  "Stress au travail",
  "Trouble du sommeil",
  "Autre",
];

function buildSystemPrompt(theme: string) {
  return `Tu es un psychologue clinicien empathique et prudent.
- Commence toujours par valider l'émotion de l'utilisateur.
- Pose 1 à 2 questions ouvertes courtes pour mieux comprendre, une à la fois.
- Propose des outils concrets (respiration lente 5-6 c/min, grounding 5-4-3-2-1, reformulation cognitive légère, journaling).
- Intègre des éléments de pleine conscience (ancrage respiratoire, non-jugement, compassion).
- Mentionne tes limites: pas de diagnostic médical, et encourage à consulter un professionnel si "red flags" (idées suicidaires, mise en danger, symptômes sévères).
- Adapte le ton et les exemples au thème: ${theme}.
- Réponds en français, 5 à 8 phrases maximum, structurées et chaleureuses.`;
}

const ELEVEN_VOICES = [
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam" },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum" },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica" },
];

async function generateOpenAIAnswer(apiKey: string, model: string, theme: string, history: ChatMessage[], userText: string) {
  const system = buildSystemPrompt(theme);
  const messages = [
    { role: "system", content: system },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userText },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur API OpenAI");
  }
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content?.trim?.() ?? "";
  return content;
}

async function generateAnswerViaEdge(model: string, theme: string, history: ChatMessage[], userText: string) {
  const { data, error } = await supabase.functions.invoke("ai-chat", {
    body: {
      model,
      theme,
      history,
      userText,
    },
  });
  if (error) {
    const details = (data as any)?.details || (data as any)?.error;
    const msg = typeof details === "string" ? details : details ? JSON.stringify(details) : error.message;
    throw new Error(msg || "Edge function error");
  }
  const answer = (data as any)?.answer as string;
  if (!answer) throw new Error("No answer returned");
  return answer;
}

export default function AIAssistantStub() {
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    const v = localStorage.getItem("ai.voiceEnabled");
    return v ? v === "true" : false;
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  // Settings
  
  const [model, setModel] = useState<string>(() => localStorage.getItem("ai.openai.model") || "gpt-4o-mini");
  const [ttsProvider, setTtsProvider] = useState<string>(() => localStorage.getItem("ai.tts.provider") || "browser");
  const [elevenVoiceId, setElevenVoiceId] = useState<string>(() => localStorage.getItem("ai.tts.voiceId") || "XB0fDUnXU5powFXDhCwa");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem("ai.voiceEnabled", String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem("ai.tts.provider", ttsProvider);
    localStorage.setItem("ai.tts.voiceId", elevenVoiceId);
  }, [ttsProvider, elevenVoiceId]);

  const frenchVoice = useMemo(() => {
    const synth = window.speechSynthesis;
    const pick = () => synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith("fr"));
    const existing = pick();
    if (existing) return existing;
    // Load voices if not ready yet
    return undefined;
  }, []);

  useEffect(() => {
    // Ensure voices are loaded on some browsers
    const handler = () => {};
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
  }, []);

  const speak = async (text: string) => {
    if (!voiceEnabled) return;
    try {
      if (ttsProvider === "elevenlabs") {
        const { data, error } = await supabase.functions.invoke("tts-eleven", {
          body: { text, voiceId: elevenVoiceId },
        });
        if (error) throw new Error(error.message);
        const base64 = (data as any)?.audioContent as string;
        if (!base64) throw new Error("Audio non disponible");
        const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
        await audio.play();
        return;
      }
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "fr-FR";
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find((vv) => vv.lang?.toLowerCase().startsWith("fr"));
      if (v) utter.voice = v;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");


    setIsLoading(true);
    try {
      const answer = await generateAnswerViaEdge(model, theme, messages, text);
      const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: answer };
      setMessages((prev) => [...prev, botMsg]);
      speak(answer);
    } catch (err: any) {
      console.error(err);
      const msg = String(err?.message || "");
      let description = "Le service est momentanément indisponible. Veuillez réessayer.";
      const lower = msg.toLowerCase();
      if (lower.includes("insufficient_quota") || lower.includes("quota")) {
        description = "Notre quota OpenAI est épuisé. Nous rétablissons le service rapidement.";
      } else if (lower.includes("invalid_api_key")) {
        description = "La clé serveur est invalide. L’équipe corrige le problème.";
      }
      toast({
        title: "Erreur IA",
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem("ai.openai.model", model);
    toast({ title: "Paramètres enregistrés", description: "Configuration enregistrée." });
    setSheetOpen(false);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Soutien psychologique (IA)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <Label className="text-sm">Thème</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Choisir un thème" />
              </SelectTrigger>
              <SelectContent>
                {THEMES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch id="voice" checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            <Label htmlFor="voice" className="text-sm">Réponse vocale</Label>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" className="gap-2"><Settings className="h-4 w-4" /> Paramètres IA</Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Configuration IA</SheetTitle>
                <SheetDescription>
                  Les clients n'ont pas besoin de clé API. Les réponses sont générées via notre serveur sécurisé (Supabase Edge Functions).
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Modèle</Label>
                  <Input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="gpt-4o-mini"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fournisseur TTS</Label>
                  <Select value={ttsProvider} onValueChange={setTtsProvider}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Choisir un fournisseur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="browser">Navigateur (Web Speech)</SelectItem>
                      <SelectItem value="elevenlabs">ElevenLabs (qualité studio)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {ttsProvider === "elevenlabs" && (
                  <div className="space-y-2">
                    <Label>Voix ElevenLabs</Label>
                    <Select value={elevenVoiceId} onValueChange={setElevenVoiceId}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Choisir une voix" />
                      </SelectTrigger>
                      <SelectContent>
                        {ELEVEN_VOICES.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Ajoutez votre clé ElevenLabs via Supabase Secrets pour activer cette option.</p>
                  </div>
                )}

                <Button onClick={handleSaveSettings} className="w-full">Enregistrer</Button>
                <p className="text-xs text-muted-foreground">
                  Les clés sont gérées côté serveur via Supabase Secrets; aucune saisie client n’est requise.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Chat */}
        <div className="rounded-lg border p-3 h-[320px] overflow-y-auto bg-card/50">
          {messages.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">
              Partagez ce que vous traversez. Le psychologue IA répondra avec empathie et des techniques adaptées.
            </p>
          )}

          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="shrink-0">
                    <Avatar className="border">
                      <AvatarFallback>Ψ</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className={`${m.role === "user" ? "bg-primary/10" : "bg-muted"} border rounded-lg px-3 py-2 max-w-[85%] animate-fade-in`}>
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === "user" && (
                  <div className="shrink-0 opacity-0">
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <Avatar className="border ring-2 ring-primary/30">
                    <AvatarFallback>Ψ</AvatarFallback>
                  </Avatar>
                </div>
                <div className="bg-muted border rounded-lg px-3 py-2 max-w-[85%]">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-foreground/50 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez ici (stress, anxiété, séparation, burn-out, deuil, solitude, etc.)"
            className="min-h-[90px]"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="h-10">
              <Send className="h-4 w-4 mr-2" /> Envoyer
            </Button>
            <Button variant="secondary" onClick={() => setInput("")} disabled={isLoading} className="h-10">Effacer</Button>
          </div>
        </div>

        <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
          <li>Empathie et validation émotionnelle en premier.</li>
          <li>Restructuration cognitive légère et techniques de grounding.</li>
          <li>Pleine conscience: ancrage respiratoire, attention ouverte, non-jugement.</li>
          <li>Red flags → encourager la consultation d'un professionnel.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
