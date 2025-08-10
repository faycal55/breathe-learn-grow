import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
const schema = z.object({
  startDate: z.string(),
  days: z.number().min(1).max(14),
  workWeekStart: z.string(),
  workWeekEnd: z.string(),
  weekendWork: z.boolean().optional(),
  weekendStart: z.string().optional(),
  weekendEnd: z.string().optional(),
  sleepStart: z.string(),
  sleepEnd: z.string(),
  commitments: z.string().optional(),
  goals: z.string().optional()
});
type FormValues = z.infer<typeof schema>;
type PlanEntry = {
  date: string;
  hour: string; // HH:00
  activity: string;
  category: string;
  approach: string;
  rationale?: string;
  safety_note?: string;
};
type PlanResponse = {
  plan: PlanEntry[];
  notes?: string;
};
const toISODate = (d: Date) => d.toISOString().slice(0, 10);
export default function Planning() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [situationContext, setSituationContext] = useState("");
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  // Fetch latest consultation context
  useEffect(() => {
    (async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session?.user?.id) return;
        // Latest conversation
        const {
          data: convs,
          error: cErr
        } = await supabase.from("conversations").select("id").order("created_at", {
          ascending: false
        }).limit(1);
        if (cErr) throw cErr;
        if (!convs || convs.length === 0) return;
        const convId = convs[0].id;
        const {
          data: msgs,
          error: mErr
        } = await supabase.from("messages").select("role, content").eq("conversation_id", convId).order("created_at", {
          ascending: true
        }).limit(100);
        if (mErr) throw mErr;
        const transcript = (msgs || []).map(m => `${m.role === "assistant" ? "Assistant" : "Utilisateur"}: ${m.content}`).join("\n");
        setSituationContext(transcript);
      } catch (e: any) {
        console.error("Erreur chargement contexte:", e);
      }
    })();
  }, []);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: toISODate(new Date()),
      days: 3,
      workWeekStart: "09:00",
      workWeekEnd: "17:00",
      weekendWork: false,
      weekendStart: "",
      weekendEnd: "",
      sleepStart: "23:00",
      sleepEnd: "07:00",
      commitments: "",
      goals: ""
    }
  });
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setPlan(null);
    try {
      const availability = {
        work: [{
          day: "Mon",
          start: values.workWeekStart,
          end: values.workWeekEnd
        }, {
          day: "Tue",
          start: values.workWeekStart,
          end: values.workWeekEnd
        }, {
          day: "Wed",
          start: values.workWeekStart,
          end: values.workWeekEnd
        }, {
          day: "Thu",
          start: values.workWeekStart,
          end: values.workWeekEnd
        }, {
          day: "Fri",
          start: values.workWeekStart,
          end: values.workWeekEnd
        }, ...(values.weekendWork ? [{
          day: "Sat",
          start: values.weekendStart,
          end: values.weekendEnd
        }, {
          day: "Sun",
          start: values.weekendStart,
          end: values.weekendEnd
        }] : [])],
        sleep: {
          start: values.sleepStart,
          end: values.sleepEnd
        },
        commitments: values.commitments || ""
      };
      const {
        data,
        error
      } = await supabase.functions.invoke("ai-scheduler", {
        body: {
          startDate: values.startDate,
          days: values.days,
          timezone: tz,
          availability,
          goals: values.goals,
          situationContext
        }
      });
      if (error) throw error;
      setPlan(data as PlanResponse);
      toast({
        title: "Planning généré",
        description: "Votre planning personnalisé est prêt."
      });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Erreur",
        description: e?.message || "Impossible de générer le planning",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const groupedByDate = useMemo(() => {
    if (!plan?.plan) return {} as Record<string, PlanEntry[]>;
    return plan.plan.reduce((acc, item) => {
      (acc[item.date] ||= []).push(item);
      return acc;
    }, {} as Record<string, PlanEntry[]>);
  }, [plan]);
  return <div className="space-y-6">
      <Helmet>
        <title>Planning personnalisé IA | Organisation du temps</title>
        <meta name="description" content="Générez un planning personnalisé avec l'IA selon vos disponibilités et votre situation. Conseils fondés sur des preuves." />
        <link rel="canonical" href="/dashboard/planning" />
      </Helmet>

      <header>
        <h1 className="text-2xl font-semibold">Planning personnalisé </h1>
        <p className="text-sm text-muted-foreground mt-1">
      </p>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Vos disponibilités</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField name="startDate" control={form.control} render={({
                field
              }) => <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>} />

                <FormField name="days" control={form.control} render={({
                field
              }) => <FormItem>
                    <FormLabel>Durée (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={14} value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormDescription>3 à 14 jours recommandés.</FormDescription>
                  </FormItem>} />

                <div className="grid grid-cols-2 gap-3">
                  <FormField name="workWeekStart" control={form.control} render={({
                  field
                }) => <FormItem>
                      <FormLabel>Travail (Lun-Ven) début</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                    </FormItem>} />
                  <FormField name="workWeekEnd" control={form.control} render={({
                  field
                }) => <FormItem>
                      <FormLabel>Travail (Lun-Ven) fin</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                    </FormItem>} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField name="sleepStart" control={form.control} render={({
                  field
                }) => <FormItem>
                      <FormLabel>Sommeil début</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                    </FormItem>} />
                  <FormField name="sleepEnd" control={form.control} render={({
                  field
                }) => <FormItem>
                      <FormLabel>Sommeil fin</FormLabel>
                      <FormControl><Input type="time" {...field} /></FormControl>
                    </FormItem>} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormField name="weekendWork" control={form.control} render={({
                  field
                }) => <FormItem>
                      <FormLabel>Travail le week-end ? (oui/non)</FormLabel>
                      <FormControl>
                        <Input type="checkbox" checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />
                      </FormControl>
                    </FormItem>} />
                </div>

                {form.watch("weekendWork") && <div className="grid grid-cols-2 gap-3">
                    <FormField name="weekendStart" control={form.control} render={({
                  field
                }) => <FormItem>
                        <FormLabel>Week-end début</FormLabel>
                        <FormControl><Input type="time" {...field} /></FormControl>
                      </FormItem>} />
                    <FormField name="weekendEnd" control={form.control} render={({
                  field
                }) => <FormItem>
                        <FormLabel>Week-end fin</FormLabel>
                        <FormControl><Input type="time" {...field} /></FormControl>
                      </FormItem>} />
                  </div>}

                <FormField name="commitments" control={form.control} render={({
                field
              }) => <FormItem>
                    <FormLabel>Engagements/contraintes</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="RDV, trajets, garde, etc." {...field} /></FormControl>
                  </FormItem>} />

                <FormField name="goals" control={form.control} render={({
                field
              }) => <FormItem>
                    <FormLabel>Objectifs/préférences</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Priorités: sommeil, anxiété, activité physique..." {...field} /></FormControl>
                  </FormItem>} />

                <Button type="submit" disabled={loading} className="w-full">{loading ? "Génération..." : "Générer le planning"}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning</CardTitle>
            </CardHeader>
            <CardContent>
              {!plan ? <p className="text-sm text-muted-foreground">Remplissez le formulaire puis générez votre planning.</p> : <div className="space-y-6">
                  {Object.entries(groupedByDate).map(([date, items]) => <div key={date} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted px-4 py-2 font-medium">{date}</div>
                      <div className="divide-y">
                        {items.sort((a, b) => a.hour.localeCompare(b.hour)).map((it, idx) => <div key={idx} className="grid grid-cols-[80px_1fr] gap-3 px-4 py-3">
                              <div className="text-sm text-muted-foreground">{it.hour}</div>
                              <div>
                                <div className="font-medium">{it.activity}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {it.category} · {it.approach}
                                </div>
                                {it.rationale && <div className="text-xs mt-1">{it.rationale}</div>}
                                {it.safety_note && <div className="text-xs mt-1 text-destructive">Sécurité: {it.safety_note}</div>}
                              </div>
                            </div>)}
                      </div>
                    </div>)}

                  {plan?.notes && <div className="text-sm text-muted-foreground">{plan.notes}</div>}
                </div>}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>;
}