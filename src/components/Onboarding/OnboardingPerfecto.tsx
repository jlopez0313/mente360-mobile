import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { ONBOARDING_COPY } from "@/lib/onboardingContent";
import { ChevronRight } from "lucide-react";

interface Props {
  /** CTA principal: abre Mi Día Guiado directamente. */
  onStart: () => void;
  busy?: boolean;
}

/** Pantalla 5 · Perfecto — cierre del onboarding. */
export const OnboardingPerfecto: React.FC<Props> = ({ onStart, busy }) => {
  const c = ONBOARDING_COPY.perfecto;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
      <img src={logo} alt="Mente360" className="mb-6 w-16 object-contain" />

      <h1 className="mb-2 font-display text-2xl font-bold text-foreground">
        {c.titulo}
      </h1>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {c.cuerpo}
      </p>

      <div className="mb-10 rounded-2xl bg-primary/5 px-5 py-4">
        <p className="max-w-xs text-sm font-medium text-foreground">{c.frase}</p>
      </div>

      <Button
        size="lg"
        onClick={onStart}
        disabled={busy}
        className="w-full max-w-sm gap-2"
      >
        {busy ? "Un momento…" : c.cta}
        {!busy && <ChevronRight className="h-5 w-5" />}
      </Button>
    </div>
  );
};
