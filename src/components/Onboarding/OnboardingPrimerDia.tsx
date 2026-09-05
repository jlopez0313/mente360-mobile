import { Button } from "@/components/ui/button";
import { ONBOARDING_COPY } from "@/lib/onboardingContent";
import { Sprout } from "lucide-react";

interface Props {
  onVolver: () => void;
  onExplorar: () => void;
}

/**
 * Pantalla 7 · Primer día completado. Solo aparece la primera vez que se
 * completa el Día Guiado, viniendo del onboarding (flag firstGuidedDayPending).
 * Refuerza el logro sin gamificación.
 */
export const OnboardingPrimerDia: React.FC<Props> = ({ onVolver, onExplorar }) => {
  const c = ONBOARDING_COPY.primerDia;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Sprout className="h-9 w-9 text-primary" />
      </div>

      <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
        {c.titulo}
      </h1>
      <p className="mb-10 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {c.cuerpo}
      </p>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <Button size="lg" onClick={onExplorar} className="w-full">
          {c.explorar}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onVolver}
          className="w-full"
        >
          {c.volver}
        </Button>
      </div>
    </div>
  );
};
