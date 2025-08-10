import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { model, theme, history, userText } = await req.json();

    const system = buildSystemPrompt(String(theme || ""));

    const messages = [
      { role: "system", content: system },
      ...((Array.isArray(history) ? history : []).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? ""),
      })) as any[]),
      { role: "user", content: String(userText || "") },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || "gpt-4.1-2025-04-14",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error:", text);
      return new Response(JSON.stringify({ error: "OpenAI request failed", details: text }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const answer: string = data.choices?.[0]?.message?.content?.trim?.() ?? "";

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-chat function error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
