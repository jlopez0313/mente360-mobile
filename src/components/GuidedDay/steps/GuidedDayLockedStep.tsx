import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import React from "react";
import { useHistory } from "react-router-dom";

interface Props {
  /** Título opcional según el paso (Audio / Música). */
  label?: string;
  /** Avanzar sin reproducir (saltar este paso). */
  onSkip: () => void;
}

export const GuidedDayLockedStep: React.FC<Props> = ({
  label = "Este contenido",
  onSkip,
}) => {
  const history = useHistory();

  return (
    <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Lock className="w-9 h-9 text-primary" />
        </div>

        <h2 className="text-xl font-bold font-display text-foreground mb-2 max-w-[280px]">
          Desbloquea con un plan
        </h2>
        <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
          {label} es parte de la experiencia completa de Mente 360. Activa un
          plan para escucharlo dentro de tu día guiado.
        </p>
      </div>

      <div className="mt-auto pt-6 flex flex-col items-center gap-3">
        <Button
          onClick={() => history.push("/planes")}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Ver planes
        </Button>

        <button
          onClick={onSkip}
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground font-medium py-1.5"
        >
          Saltar por ahora
        </button>
      </div>
    </div>
  );
};
