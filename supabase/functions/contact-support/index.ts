import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactPayload {
  name?: string;
  email?: string;
  subject: string;
  message: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactPayload = await req.json();
    const { name = "", email = "", subject, message } = body;

    const html = `
      <h2>Nouveau message - Contact Service Client</h2>
      <p><strong>Nom:</strong> ${name || "(non fourni)"}</p>
      <p><strong>Email:</strong> ${email || "(non fourni)"}</p>
      <p><strong>Sujet:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `;

    const to = "service-client@respira-care.fr";

    const resp = await resend.emails.send({
      from: "Respira <onboarding@resend.dev>",
      to: [to],
      subject: `[Contact] ${subject}`,
      html,
    });

    return new Response(JSON.stringify(resp), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
