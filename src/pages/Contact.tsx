import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : "";
  const canonical = `${baseUrl}/contact`;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const userEmail = data.user?.email ?? "";
      setEmail(userEmail);
    });
  }, []);

  const onSubmit = async () => {
    if (!subject || !message) {
      toast({ title: "Champs requis", description: "Sujet et message sont obligatoires.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("contact-support", {
        body: { name, email, subject, message },
      });
      if (error) throw error;
      toast({ title: "Message envoyé", description: "Notre équipe vous répondra rapidement." });
      setSubject("");
      setMessage("");
    } catch (e: any) {
      toast({ title: "Échec de l'envoi", description: e.message ?? "Veuillez réessayer.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Respira',
    url: baseUrl,
    contactPoint: [{
      '@type': 'ContactPoint',
      email: 'service-client@respira-care.fr',
      contactType: 'customer support',
      availableLanguage: ['fr']
    }]
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Helmet>
        <title>Contact service client | Respira</title>
        <meta name="description" content="Contactez le service client Respira: assistance, facturation, compte. Réponse rapide par email." />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(contactJsonLd)}</script>
      </Helmet>
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Contact service client</h1>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <Button onClick={onSubmit} disabled={sending} className="w-full">
              {sending ? "Envoi en cours..." : "Envoyer"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Votre message sera envoyé vers service-client@respira-care.fr.
            </p>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
