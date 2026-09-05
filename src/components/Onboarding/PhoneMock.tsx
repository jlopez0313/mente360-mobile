import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PhoneMockProps {
  icon: LucideIcon;
  titulo: string;
  chips?: string[];
  className?: string;
}

/**
 * Marco de teléfono estilizado para el carrusel de herramientas del onboarding.
 * No es una captura real: evoca la pantalla con un ícono, un título y unos
 * "chips" (categorías/pestañas) más un par de filas skeleton. Usa tokens del
 * tema, así que funciona en claro y oscuro.
 */
export const PhoneMock: React.FC<PhoneMockProps> = ({
  icon: Icon,
  titulo,
  chips = [],
  className,
}) => {
  return (
    <div
      className={cn(
        "relative mx-auto w-[190px] rounded-[2rem] border-[6px] border-foreground/10 bg-card shadow-card overflow-hidden",
        className
      )}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-foreground/10" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-6 pb-3 bg-primary/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-[11px] font-bold text-foreground">{titulo}</span>
      </div>

      {/* Body */}
      <div className="space-y-2.5 px-3 py-3">
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-border/60 p-2">
            <div className="h-7 w-7 flex-shrink-0 rounded-md bg-primary/15" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/25" />
              <div className="h-1.5 w-1/2 rounded-full bg-muted-foreground/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
