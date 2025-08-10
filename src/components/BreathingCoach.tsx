import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

 type Technique = "box" | "coherent" | "extended";

 interface Phase {
  name: string;
  seconds: number;
  scale: "min" | "max"; // visual target for the ball
}

const TECHNIQUE_LABELS: Record<Technique, string> = {
  box: "Box breathing (4-4-4-4)",
  coherent: "Respiration cohérente (~6 cycles/min)",
  extended: "Inspiration 4s, expir 6s (exhalation prolongée)",
};

export default function BreathingCoach() {
  const [technique, setTechnique] = useState<Technique>("coherent");
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);

  const phases: Phase[] = useMemo(() => {
    switch (technique) {
      case "box":
        return [
          { name: "Inspirez", seconds: 4, scale: "max" },
          { name: "Retenez", seconds: 4, scale: "max" },
          { name: "Expirez", seconds: 4, scale: "min" },
          { name: "Retenez", seconds: 4, scale: "min" },
        ];
      case "extended":
        return [
          { name: "Inspirez", seconds: 4, scale: "max" },
          { name: "Retenez", seconds: 1, scale: "max" },
          { name: "Expirez (long)", seconds: 6, scale: "min" },
          { name: "Retenez", seconds: 1, scale: "min" },
        ];
      case "coherent":
      default:
        return [
          { name: "Inspirez", seconds: 4, scale: "max" },
          { name: "Expirez", seconds: 6, scale: "min" },
        ];
    }
  }, [technique]);

  const current = phases[phaseIndex % phases.length];

  useEffect(() => {
    if (!running) return;
    setRemaining(current.seconds);

    timerRef.current = window.setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          // Next phase
          setPhaseIndex((i) => (i + 1) % phases.length);
          return phases[(phaseIndex + 1) % phases.length]?.seconds ?? current.seconds;
        }
        return s - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // We intentionally omit dependencies that would restart interval mid-phase
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIndex, phases]);

  const toggle = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setPhaseIndex(0);
    setRemaining(0);
  };

  // Pointer-reactive gradient in hero is handled in the page; here we focus on the module UI
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Chronomètre de respiration guidée</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 items-center">
        <div className="order-2 md:order-1 space-y-4">
          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">Technique</label>
            <Select value={technique} onValueChange={(v: Technique) => { setTechnique(v); reset(); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisissez une technique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coherent">{TECHNIQUE_LABELS["coherent"]}</SelectItem>
                <SelectItem value="extended">{TECHNIQUE_LABELS["extended"]}</SelectItem>
                <SelectItem value="box">{TECHNIQUE_LABELS["box"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-muted-foreground">Phase</p>
              <p className="text-sm text-muted-foreground">Temps restant</p>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-semibold">{current?.name}</div>
              <div className="text-3xl tabular-nums font-bold">{remaining}s</div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Rythme cible ~5–6 cycles/min. Expirations plus longues → activation parasympathique.
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={toggle}>{running ? "Pause" : "Démarrer"}</Button>
            <Button variant="secondary" onClick={reset}>Réinitialiser</Button>
          </div>
        </div>

        <div className="order-1 md:order-2 mx-auto">
          <div
            className="breath-ball"
            style={{
              // Inform the CSS transition of the current phase length
              // @ts-ignore - custom CSS var
              "--phase-duration": `${Math.max(current?.seconds || 2, 1)}s`,
            } as React.CSSProperties}
            data-scale={current?.scale === "max" ? "max" : "min"}
            aria-label="Guide visuel de respiration"
          />
        </div>
      </CardContent>
    </Card>
  );
}
