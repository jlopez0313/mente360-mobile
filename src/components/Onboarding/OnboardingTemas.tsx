import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_TEMAS,
  TEMAS_MAX,
  TIEMPO_DIARIO_DEFAULT,
  TIEMPOS_DIARIOS,
} from "@/lib/onboardingContent";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Props {
  initialTemas?: string[];
  initialTiempo?: number | null;
  /** Reporta la selección al contenedor, que persiste y avanza. */
  onNext: (temas: string[], tiempoDiario: number) => void;
}

/** Pantalla 3 · Conocerte un poco mejor — hasta 3 temas + tiempo diario. */
export const OnboardingTemas: React.FC<Props> = ({
  initialTemas = [],
  initialTiempo,
  onNext,
}) => {
  const [temas, setTemas] = useState<string[]>(initialTemas);
  const [tiempo, setTiempo] = useState<number>(
    initialTiempo ?? TIEMPO_DIARIO_DEFAULT
  );

  const toggleTema = (key: string) => {
    setTemas((prev) => {
      if (prev.includes(key)) return prev.filter((t) => t !== key);
      if (prev.length >= TEMAS_MAX) return prev;
      return [...prev, key];
    });
  };

  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <div className="mb-4">
        <h1 className="mb-1 font-display text-2xl font-bold text-foreground">
          Conocerte un poco mejor
        </h1>
        <p className="text-sm text-muted-foreground">
          ¿Qué te gustaría trabajar en este momento? Elige hasta {TEMAS_MAX}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {ONBOARDING_TEMAS.map((tema) => {
          const Icon = tema.icon;
          const activo = temas.includes(tema.key);
          const bloqueado = !activo && temas.length >= TEMAS_MAX;
          return (
            <button
              key={tema.key}
              type="button"
              disabled={bloqueado}
              onClick={() => toggleTema(tema.key)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl border p-3 text-left transition-colors",
                activo
                  ? "border-primary bg-primary/10"
                  : "border-border/70 bg-card",
                bloqueado && "opacity-40"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 flex-shrink-0",
                  activo ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="text-xs font-medium text-foreground">
                {tema.label}
              </span>
              {activo && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <p className="mb-2 text-sm font-semibold text-foreground">
          ¿Cuánto tiempo quieres dedicarte al día?
        </p>
        <div className="flex gap-2">
          {TIEMPOS_DIARIOS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setTiempo(min)}
              className={cn(
                "flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors",
                tiempo === min
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-card text-foreground"
              )}
            >
              {min} min
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button
          size="lg"
          onClick={() => onNext(temas, tiempo)}
          className="w-full gap-2"
        >
          Siguiente
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
