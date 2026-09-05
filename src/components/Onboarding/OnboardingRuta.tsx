import { Button } from "@/components/ui/button";
import { RUTA_MOMENTOS } from "@/lib/onboardingContent";
import { ChevronRight } from "lucide-react";

interface Props {
  onNext: () => void;
}

/** Pantalla 2 · Tu ruta de crecimiento — tres momentos del día. */
export const OnboardingRuta: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="flex flex-1 flex-col px-6 py-6">
      <div className="mb-6">
        <h1 className="mb-1 font-display text-2xl font-bold text-foreground">
          Tu ruta de crecimiento
        </h1>
        <p className="text-sm text-muted-foreground">
          Pequeños pasos, grandes cambios.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {RUTA_MOMENTOS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.titulo}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="mb-0.5 font-semibold text-foreground">{m.titulo}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {m.descripcion}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Tu bienestar también se construye en lo cotidiano.
      </p>

      <div className="mt-auto pt-8">
        <Button size="lg" onClick={onNext} className="w-full gap-2">
          Siguiente
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
