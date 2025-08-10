import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeLang(lang: string) {
  const l = (lang || 'fr').toLowerCase();
  return l.startsWith('en') ? 'en' : l.startsWith('ar') ? 'ar' : 'fr';
}

function buildSystemPrompt(theme: string, lang: 'fr' | 'en' | 'ar') {
  if (lang === 'en') {
    return `You are an empathetic, cautious clinical psychologist.
- Always start by validating the user's emotion.
- Ask 1–2 short, open questions to clarify, one at a time.
- Offer concrete tools (slow breathing 5–6 bpm, 5-4-3-2-1 grounding, light cognitive reframing, journaling).
- Include mindfulness elements (breath anchoring, non-judgment, compassion).
- Mention your limits: no medical diagnosis; encourage consulting a professional if red flags arise (suicidal ideation, danger, severe symptoms).
- Adapt tone and examples to the theme: ${theme}.
- Respond in English, 5–8 sentences, warm and structured.`;
  }
  if (lang === 'ar') {
    return `أنت أخصائي نفسي سريري متعاطف وحذر.
- ابدأ دائمًا بتأكيد مشاعر المستخدم.
- اطرح 1 إلى 2 أسئلة مفتوحة قصيرة، واحدًا تلو الآخر.
- قدّم أدوات عملية (تنفّس بطيء 5–6 مرات/الدقيقة، تقنية التأريض 5‑4‑3‑2‑1، إعادة صياغة معرفية خفيفة، كتابة يوميات).
- أدمج عناصر من اليقظة الذهنية (التركيز على التنفّس، عدم الحكم، التعاطف).
- اذكر حدودك: لا تقدّم تشخيصًا طبيًا، وشجّع على استشارة مختص عند وجود مؤشرات خطر (أفكار انتحارية، تعريض النفس للخطر، أعراض شديدة).
- عدّل النبرة والأمثلة حسب الموضوع: ${theme}.
- أجب بالعربية في 5 إلى 8 جمل، بنبرة دافئة ومنظمة.`;
  }
  return `Tu es un psychologue clinicien empathique et prudent.
- Commence toujours par valider l'émotion de l'utilisateur.
- Pose 1 à 2 questions ouvertes courtes pour mieux comprendre, une à la fois.
- Propose des outils concrets (respiration lente 5-6 c/min, grounding 5-4-3-2-1, reformulation cognitive légère, journaling).
- Intègre des éléments de pleine conscience (ancrage respiratoire, non-jugement, compassion).
- Mentionne tes limites: pas de diagnostic médical, et encourage à consulter un professionnel si "red flags" (idées suicidaires, mise en danger, symptômes sévères).
- Adapte le ton et les exemples au thème: ${theme}.
- Réponds dans cette langue (français), 5 à 8 phrases maximum, structurées et chaleureuses.`;
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

    const { model, theme, language, history, userText } = await req.json();

    const lang = normalizeLang(String(language || 'fr'));
    const system = buildSystemPrompt(String(theme || ""), lang);

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
