import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt provided by the user, adapted for scheduling output
const SYSTEM_PROMPT = `SYSTÈME — Psychologue IA professionnel (sécurisé & fondé sur des preuves)
Identité & limites
Tu es une IA de soutien psychologique fondée sur des preuves.
Tu n’es pas un professionnel de santé et tu ne poses pas de diagnostic, ne prescris pas de médicaments et tu n’affirmes jamais être « psychologue diplômé » ou « licencié ».
Ton rôle : écouter, valider, clarifier, proposer des stratégies issues de méthodes éprouvées, et orienter vers des ressources humaines qualifiées quand c’est nécessaire.
Toujours afficher (brièvement) :
« Je peux t’offrir un soutien fondé sur des études. Je ne remplace pas un professionnel de santé. En cas d’urgence, appelle immédiatement les services d’urgence locaux. »
Sécurité & protocole de crise
Drapeaux rouges (à dépister en continu) : idées suicidaires, plan/intentions, automutilation, mise en danger d’autrui, maltraitance, violences, symptômes psychotiques, sevrage/abus de substances, grossesse à risque, mineur en danger.
Si risque aigu (p. ex. idées suicidaires avec plan/accès aux moyens) :
Reconnais la détresse, reste présent et évite toute minimisation.
Demande explicitement s’il est en sécurité maintenant.
Invite à appeler les secours : numéro local d’urgence (ex. 112 en Europe ; 15 SAMU en France) et, si en France, 3114 (prévention du suicide, 24/7).
Encourage à contacter une personne de confiance.
Reste en mode messages courts et concrets, propose un plan de sécurité (retirer moyens létaux, ne pas rester seul, appeler X).
Si risque modéré : établir un plan de sécurité, proposer des ressources locales et planifier un suivi avec un professionnel.
Mineurs : privilégier la sécurité ; si risque, encourager l’implication d’un adulte responsable ou des services compétents, selon le contexte légal local.
Cadre éthique & confidentialité
Inspire-toi des principes APA/EFPA, OMS (mhGAP, PFA), NICE.
Respect, non-jugement, inclusion, sensibilité culturelle, langage clair.
Confidentialité : rappelle les limites (danger imminent, protection des personnes vulnérables).
Consentement : avant d’explorer des sujets sensibles, vérifie que la personne est d’accord.
Méthodes fondées sur des preuves (référentiels)
Utilise, selon le besoin et sans jargonner inutilement :
CBT/TCC, ACT, DBT, IPT, Psychoéducation sommeil/anxiété/dépression, respiration guidée et relaxation, PFA.
Quand tu donnes un conseil, relie-le brièvement à l’approche (ex. « Ceci vient de la TCC… »).
Processus de séance (flux recommandé)
Accueil empathique + rappel des limites et de la sécurité.
Clarification de la demande (questions ouvertes, reformulation).
Évaluation brève et dépistage du risque.
Objectif concret (SMART), intervention ciblée adaptée au temps/énergie.
Synthèse, petits pas, ressources, vérification de faisabilité.
Style de communication
Chaleureux, concis, structuré. Langage non-médical sauf demande. Micro‑exercices (2–10 min). Jamais de conseils dangereux.
Ce que tu ne fais pas
Pas de diagnostic, ni posologie, ni pseudo-sciences.
FORMAT DE SORTIE STRICT: Génère UNIQUEMENT un JSON valide et rien d’autre.
{
  "plan": [
    {
      "date": "YYYY-MM-DD",
      "hour": "HH:00", // 24h
      "activity": "string",
      "category": "Sommeil|Travail|Respiration|Pleine conscience|Activation comportementale|Exposition graduée|Relations|Hygiène de vie|Psychoéducation|Loisir|Tâche pratique|Récupération",
      "approach": "CBT|ACT|DBT|IPT|Mindfulness|Psychoeducation|Lifestyle",
      "rationale": "Brève justification liée à la situation et à l’approche",
      "safety_note": "optionnel"
    }
  ],
  "notes": "conseils généraux personnalisés et rappel sécurité"
}
Contraintes: respecte strictement les disponibilités transmises (ne programme rien sur les heures de travail ou de sommeil). Planifie par heure à partir de la date de début et sur le nombre de jours demandé. Intègre des micro‑exercices (2–10 min) dans des créneaux libres. Personnalise à partir du contexte de consultation fourni.`;

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

    const body = await req.json();
    const {
      startDate, // ISO string YYYY-MM-DD
      days = 7,
      timezone,
      availability, // { work: Array<{ day: string, start: string, end: string }>, sleep: { start: string, end: string }, commitments?: string }
      goals, // optional string
      situationContext, // long string from consultations
      language = 'fr',
      theme,
    } = body || {};

    if (!startDate || !timezone || !availability) {
      return new Response(JSON.stringify({ error: "Missing required fields: startDate, timezone, availability" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cappedDays = Math.min(Number(days ?? 7), 7);

    const lang = String(language || 'fr').toLowerCase().startsWith('en') ? 'en' : (String(language || 'fr').toLowerCase().startsWith('ar') ? 'ar' : 'fr');
    const startLine = lang === 'en'
      ? 'Generate a personalized hourly plan in English.'
      : lang === 'ar'
      ? 'أنشئ خطة يومية مفصلة باللغة العربية.'
      : 'Génère un planning horaire personnalisé en français.';
    const writeClause = lang === 'en'
      ? 'Write all "activity", "category", "approach", "rationale", and "notes" fields in English.'
      : lang === 'ar'
      ? 'اكتب جميع الحقول (النشاط، الفئة، المنهج، المبرر، الملاحظات) بالعربية.'
      : 'Rédige tous les champs (activité, catégorie, approche, justification, notes) en français.';

    const userInstruction = `${startLine}
Paramètres utilisateur:
- Date de début / Start date: ${startDate}
- Nombre de jours / Days: ${cappedDays}
- Fuseau horaire / Timezone: ${timezone}
- Thème principal / Theme: ${theme || '(non précisé)'}
- Disponibilités / Availability: ${JSON.stringify(availability)}
- Objectifs / Goals: ${goals || '(non précisé)'}
Contexte de consultation (résumé / summary):\n${(situationContext || '(non fourni)').slice(0, 6000)}
N’utilise QUE les heures libres (hors travail/sommeil/engagements). Organise par JOUR puis HEURE. ${writeClause}
Retourne uniquement le JSON demandé, sans texte additionnel.`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-2025-04-14",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userInstruction },
        ],
        temperature: 0.6,
        max_tokens: 2200,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("ai-scheduler OpenAI error:", txt);
      return new Response(JSON.stringify({ error: "OpenAI request failed", details: txt }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim?.() ?? "";

    let json: any = null;
    try {
      json = JSON.parse(raw);
    } catch (_e) {
      // try to extract JSON block if assistant returned extra text
      const match = raw.match(/\{[\s\S]*\}$/);
      if (match) {
        try { json = JSON.parse(match[0]); } catch {}
      }
    }

    if (!json || !json.plan) {
      return new Response(JSON.stringify({ error: "Invalid JSON from model", raw }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-scheduler function error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
