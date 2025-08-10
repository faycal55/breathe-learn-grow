import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import RelaxBackground from "@/components/RelaxBackground";
const Auth = () => {
  const navigate = useNavigate();
  // Connexion (email/password)
  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");
  const [loadingIn, setLoadingIn] = useState(false);

  // Inscription (email/password + profil)
  const [emailUp, setEmailUp] = useState("");
  const [passwordUp, setPasswordUp] = useState("");
  const [firstNameUp, setFirstNameUp] = useState("");
  const [lastNameUp, setLastNameUp] = useState("");
  const [countryUp, setCountryUp] = useState("");
  const [phoneUp, setPhoneUp] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loadingUp, setLoadingUp] = useState(false);

  // Auth par téléphone (OTP SMS)
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);
  const [verifyingSms, setVerifyingSms] = useState(false);

  useEffect(() => {
    // Titre via Helmet ci-dessous
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        toast({ title: "Connecté", description: "Redirection en cours..." });
        navigate("/dashboard", { replace: true });
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
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
    if (!acceptTerms) {
      toast({ title: "Conditions requises", description: "Vous devez accepter les Conditions Générales pour continuer.", variant: "destructive" });
      return;
    }
    setLoadingUp(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: emailUp,
        password: passwordUp,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstNameUp,
            last_name: lastNameUp,
            country: countryUp,
            phone: phoneUp,
          },
        },
      });
      if (error) throw error;
      toast({
        title: "Inscription créée",
        description: "Si la vérification par email est activée, vérifiez votre boîte mail. Sinon, connectez-vous.",
      });
    } catch (e: any) {
      toast({ title: "Erreur d'inscription", description: e.message, variant: "destructive" });
    } finally {
      setLoadingUp(false);
    }
  };

  const sendSmsCode = async () => {
    try {
      setSendingSms(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneOtp,
        options: { channel: "sms" },
      });
      if (error) throw error;
      setSmsSent(true);
      toast({ title: "Code envoyé", description: "Un code a été envoyé par SMS." });
    } catch (e: any) {
      toast({ title: "Échec de l'envoi", description: e.message, variant: "destructive" });
    } finally {
      setSendingSms(false);
    }
  };

  const verifySmsCode = async () => {
    try {
      setVerifyingSms(true);
      const { data, error } = await supabase.auth.verifyOtp({
        type: "sms",
        phone: phoneOtp,
        token: otpCode,
      });
      if (error) throw error;
      // Ajoute des métadonnées de profil après vérification si besoin
      if (data.session?.user) {
        await supabase.auth.updateUser({
          data: {
            phone: phoneOtp,
          },
        });
      }
      toast({ title: "Vérifié", description: "Connexion par SMS réussie." });
      navigate("/dashboard", { replace: true });
    } catch (e: any) {
      toast({ title: "Code invalide", description: e.message, variant: "destructive" });
    } finally {
      setVerifyingSms(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Helmet>
        <title>Connexion | Respira</title>
        <meta name="description" content="Connectez-vous ou inscrivez-vous à Respira. Connexion par email ou vérification par SMS." />
        <link rel="canonical" href={`${window.location.origin}/auth`} />
      </Helmet>
      <RelaxBackground />
      <main className="relative z-10">
        <section className="container mx-auto px-4 pt-16 md:pt-24 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Respira</h1>
          <p className="mt-3 text-muted-foreground">Un espace apaisant, sécurisé et respectueux de votre confidentialité.</p>
        </section>
        <article className="container mx-auto py-8 md:py-12 max-w-md">
        <Card className="glass-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Accéder à votre espace</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                <TabsTrigger value="phone">Téléphone</TabsTrigger>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstNameUp">Prénom</Label>
                    <Input id="firstNameUp" value={firstNameUp} onChange={(e) => setFirstNameUp(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastNameUp">Nom</Label>
                    <Input id="lastNameUp" value={lastNameUp} onChange={(e) => setLastNameUp(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="countryUp">Pays</Label>
                    <Input id="countryUp" value={countryUp} onChange={(e) => setCountryUp(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneUp">Téléphone</Label>
                    <Input id="phoneUp" type="tel" placeholder="Ex: +33612345678" value={phoneUp} onChange={(e) => setPhoneUp(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailUp">Email</Label>
                  <Input id="emailUp" type="email" value={emailUp} onChange={(e) => setEmailUp(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordUp">Mot de passe</Label>
                  <Input id="passwordUp" type="password" value={passwordUp} onChange={(e) => setPasswordUp(e.target.value)} />
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <input id="acceptTerms" type="checkbox" className="mt-1" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                  <label htmlFor="acceptTerms" className="leading-tight">
                    J’accepte les <a href="/conditions-generales" className="underline">Conditions Générales</a> et j’ai lu les <a href="/legal" className="underline">Mentions légales & RGPD</a>.
                  </label>
                </div>
                <Button className="w-full" onClick={handleSignup} disabled={loadingUp || !acceptTerms}>
                  {loadingUp ? "Inscription..." : "Créer un compte"}
                </Button>
                <p className="text-xs text-muted-foreground">Après inscription, vous pouvez aussi utiliser la vérification par SMS.</p>
              </TabsContent>

              <TabsContent value="phone" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneOtp">Numéro de téléphone</Label>
                  <Input id="phoneOtp" type="tel" placeholder="Ex: +33612345678" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} />
                </div>
                {!smsSent ? (
                  <Button className="w-full" onClick={sendSmsCode} disabled={sendingSms || !phoneOtp}>
                    {sendingSms ? "Envoi du code..." : "Recevoir un code par SMS"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otpCode">Code reçu par SMS</Label>
                      <Input id="otpCode" inputMode="numeric" pattern="[0-9]*" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="secondary" onClick={sendSmsCode} disabled={sendingSms}>
                        Renvoyer le code
                      </Button>
                      <Button onClick={verifySmsCode} disabled={verifyingSms || otpCode.length === 0}>
                        {verifyingSms ? "Vérification..." : "Valider"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Aucun mot de passe requis. La connexion se fait via le code reçu.</p>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-xs text-muted-foreground space-x-4">
          <a href="/legal" className="underline">Mentions légales</a>
          <a href="/conditions-generales" className="underline">Conditions générales</a>
          <a href="/conditions-paiement" className="underline">Conditions de paiement</a>
          <a href="/contact" className="underline">Contact</a>
        </div>
      </article>
    </main>
  </div>
  );
};

export default Auth;
