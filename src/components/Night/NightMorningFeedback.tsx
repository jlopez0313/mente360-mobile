import { Button } from "@/components/ui/button";
import { FeedbackManana } from "@/database/diario";
import { useDiario } from "@/hooks/useDiario";
import { cn } from "@/lib/utils";
import { Sunrise } from "lucide-react";
import React, { useState } from "react";

const OPTIONS: { value: FeedbackManana; label: string; hint: string }[] = [
  { value: "igual", label: "Igual", hint: "Me costó descansar" },
  { value: "algo_mejor", label: "Algo mejor", hint: "Dormí un poco mejor" },
  { value: "mucho_mejor", label: "Mucho mejor", hint: "Descansé muy bien" },
];

/**
 * Se muestra en el Home a la mañana siguiente si anoche hubo un cierre de día
 * (Mi noche guiada) sin responder cómo amaneció. Escribe `feedback_manana` en
 * la entrada de ayer del Diario. Se puede posponer por hoy.
 */
export const NightMorningFeedback: React.FC = () => {
  const { yesterdayEntry, setYesterdayFeedback } = useDiario();
  const [answered, setAnswered] = useState<FeedbackManana | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return (
        localStorage.getItem("mente360_morning_feedback_dismissed") ===
        new Date().toISOString().split("T")[0]
      );
    } catch {
      return false;
    }
  });

  const didNightFlow =
    !!yesterdayEntry &&
    (!!yesterdayEntry.texto_cierre_dia ||
      !!yesterdayEntry.estado_emocional ||
      yesterdayEntry.audio_escuchado_id != null);

  if (!didNightFlow || (yesterdayEntry?.feedback_manana && !answered)) return null;
  if (dismissed && !answered) return null;

  const audio =
    yesterdayEntry?.audio_escuchado?.titulo ||
    yesterdayEntry?.audio_recomendado?.titulo;

  const dismiss = () => {
    try {
      localStorage.setItem(
        "mente360_morning_feedback_dismissed",
        new Date().toISOString().split("T")[0]
      );
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  const pick = (value: FeedbackManana) => {
    setAnswered(value);
    setYesterdayFeedback(value);
  };

  return (
    <div className="px-4 mb-4">
      <div className="bg-card rounded-2xl border border-border/60 shadow-card p-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-full bg-morning/15 flex items-center justify-center flex-shrink-0">
            <Sunrise className="w-5 h-5 text-morning-foreground" />
          </div>
          <h3 className="text-sm font-bold font-display text-foreground">
            {answered ? "¡Gracias por contarnos!" : "¿Cómo amaneciste hoy?"}
          </h3>
        </div>

        {answered ? (
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seguimos acompañándote en tu camino. Esto nos ayuda a recomendarte
            mejor cada noche.
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {audio
                ? `Anoche escuchaste "${audio}".`
                : "Sobre tu cierre de anoche."}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => pick(o.value)}
                  className={cn(
                    "flex flex-col items-center text-center gap-0.5 rounded-xl border border-border/70 px-2 py-2.5",
                    "hover:border-primary/50 active:scale-95 transition-all"
                  )}
                >
                  <span className="text-xs font-bold text-foreground">
                    {o.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {o.hint}
                  </span>
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={dismiss}
              className="w-full mt-2 h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Ahora no
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
