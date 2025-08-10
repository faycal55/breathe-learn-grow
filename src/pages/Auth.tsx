import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");
  const [emailUp, setEmailUp] = useState("");
  const [passwordUp, setPasswordUp] = useState("");
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingUp, setLoadingUp] = useState(false);

  useEffect(() => {
    document.title = "Connexion / Inscription | Respira";
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        toast({ title: "Connecté", description: "Redirection en cours..." });
        navigate("/", { replace: true });
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoadingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: emailIn, password: passwordIn });
      if (error) throw error;
      toast({ title: "Connexion réussie" });
    } catch (e: any) {
      toast({ title: "Erreur de connexion", description: e.message, variant: "destructive" });
    } finally {
      setLoadingIn(false);
    }
  };

  const handleSignup = async () => {
    setLoadingUp(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: emailUp,
        password: passwordUp,
        options: { emailRedirectTo: redirectUrl },
      });
      if (error) throw error;
      toast({ title: "Vérifiez vos emails", description: "Confirmez votre adresse pour activer votre compte." });
    } catch (e: any) {
      toast({ title: "Erreur d'inscription", description: e.message, variant: "destructive" });
    } finally {
      setLoadingUp(false);
    }
  };

  return (
    <main>
      <article className="container mx-auto py-16 md:py-24 max-w-md">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Accéder à votre espace</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">S'inscrire</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailIn">Email</Label>
                  <Input id="emailIn" type="email" value={emailIn} onChange={(e) => setEmailIn(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordIn">Mot de passe</Label>
                  <Input id="passwordIn" type="password" value={passwordIn} onChange={(e) => setPasswordIn(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleLogin} disabled={loadingIn}>
                  {loadingIn ? "Connexion..." : "Se connecter"}
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailUp">Email</Label>
                  <Input id="emailUp" type="email" value={emailUp} onChange={(e) => setEmailUp(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordUp">Mot de passe</Label>
                  <Input id="passwordUp" type="password" value={passwordUp} onChange={(e) => setPasswordUp(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleSignup} disabled={loadingUp}>
                  {loadingUp ? "Inscription..." : "Créer un compte"}
                </Button>
                <p className="text-xs text-muted-foreground">Après inscription, vérifiez votre email pour confirmer.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </article>
    </main>
  );
};

export default Auth;
