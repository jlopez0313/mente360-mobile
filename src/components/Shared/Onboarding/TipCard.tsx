import { useOnboardingTip } from "@/hooks/useOnboardingTips";
import { getOnboardingTip } from "@/lib/onboardingTips";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TipCardProps {
  /** Debe existir en ONBOARDING_TIPS (src/lib/onboardingTips.ts). */
  tipKey: string;
  className?: string;
}

/**
 * Tarjeta de onboarding contextual: aparece la primera vez que el usuario
 * entra a una pantalla registrada en ONBOARDING_TIPS y se descarta para
 * siempre al tocar "Entendido" o la X (ver useOnboardingTip). El mismo
 * storage alimenta el checklist "Primeros pasos" de Home.
 */
export const TipCard: React.FC<TipCardProps> = ({ tipKey, className }) => {
  const tip = getOnboardingTip(tipKey);
  const { visible, dismiss } = useOnboardingTip(tipKey);

  if (!tip || !visible) return null;

  const Icon = tip.icon;

  return (
    <div
      className={cn(
        "relative flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 pr-9",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-foreground mb-1">{tip.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
          {tip.description}
        </p>
        <button
          onClick={dismiss}
          className="text-xs font-bold text-primary hover:underline"
        >
          Entendido
        </button>
      </div>
      <button
        onClick={dismiss}
        aria-label="Cerrar"
        className="absolute top-3 right-3 text-muted-foreground/60 hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
