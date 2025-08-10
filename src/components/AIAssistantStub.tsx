import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AIAssistantStub() {
  const [text, setText] = useState("");

  const handleSend = () => {
    toast({
      title: "Assistant IA",
      description:
        "Pour activer l'aide psychologique IA, connectez votre projet à Supabase et ajoutez une clé API de modèle (ex: OpenAI/Anthropic).",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Soutien psychologique (IA)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Exprimez ce que vous traversez. L'IA répondra avec empathie selon des principes de
          psychoéducation, thérapies brèves et pleine conscience. Limites éthiques: pas de
          diagnostic médical; orientation vers un professionnel si nécessaire.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez ici (stress, anxiété, séparation, burn-out, deuil, solitude, etc.)"
          className="min-h-[140px]"
        />
        <div className="flex gap-2">
          <Button onClick={handleSend}>Envoyer</Button>
          <Button variant="secondary" onClick={() => setText("")}>Effacer</Button>
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
