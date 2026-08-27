import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Props {
  initialEmotion?: string;
  onContinue: (emotion: string) => void;
  onSkip: () => void;
}

const EMOTIONS = [
  "Ansiedad",
  "Miedo",
  "Tristeza",
  "Cansancio",
  "Ira / Molestia",
  "Agotamiento",
  "Paz / Tranquilidad",
  "Gratitud",
];

export const GuidedNightEmotionStep: React.FC<Props> = ({
  initialEmotion = "",
  onContinue,
  onSkip,
}) => {
  const [selected, setSelected] = useState<string>(initialEmotion || "Ansiedad");

  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-4">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground mb-1">
          ¿Cómo te sientes ahora?
        </h1>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Elige la opción que mejor describe lo que estás viviendo.
        </p>

        {/* 2-column Grid of Emotions */}
        <div className="grid grid-cols-2 gap-3">
          {EMOTIONS.map((emotion) => {
            const isSelected = selected === emotion;
            return (
              <button
                key={emotion}
                type="button"
                onClick={() => setSelected(emotion)}
                className={cn(
                  "w-full h-12 rounded-2xl px-3 font-semibold text-xs transition-all active:scale-95 border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground border-border/70 hover:border-primary/40"
                )}
              >
                {emotion}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-6 flex flex-col items-center gap-3">
        <button
          onClick={onSkip}
          type="button"
          className="text-xs text-primary font-semibold hover:underline"
        >
          No sé cómo me siento
        </button>

        <Button
          onClick={() => onContinue(selected)}
          disabled={!selected}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
