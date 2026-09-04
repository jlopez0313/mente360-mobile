import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface Props {
  initialValue?: string;
  onContinue: (reflection: string) => void;
  onSkip: () => void;
}

export const GuidedNightReflectionStep: React.FC<Props> = ({
  initialValue = "",
  onContinue,
  onSkip,
}) => {
  const [reflection, setReflection] = useState(initialValue);
  const maxChars = 300;

  return (
    <div className="flex-1 flex flex-col justify-between pt-2 pb-4">
      <div>
        <h1 className="text-xl font-bold font-display text-foreground mb-1">
          ¿Qué fue lo más importante de tu día?
        </h1>
        <p className="text-xs text-muted-foreground mb-4">
          Tómate un momento para recordar.
        </p>

        {/* Textarea Box */}
        <div className="relative bg-card rounded-2xl border border-border/80 p-4 shadow-sm mb-4">
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value.slice(0, maxChars))}
            placeholder="Escribe aquí..."
            className="w-full h-32 bg-transparent text-sm !text-foreground placeholder:!text-muted-foreground/60 resize-none outline-none"
          />
          <div className="text-right text-[11px] text-muted-foreground">
            {reflection.length}/{maxChars}
          </div>
        </div>

        {/* Examples Card */}
        <div className="bg-muted/40 rounded-2xl p-4 border border-border/40">
          <p className="text-xs font-semibold text-foreground mb-2">Ejemplos:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Una conversación</li>
            <li>• Un logro</li>
            <li>• Un desafío</li>
            <li>• Un momento especial</li>
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-8 flex flex-col items-center gap-5">
        <button
          onClick={onSkip}
          type="button"
          className="text-xs text-primary font-semibold hover:underline py-1"
        >
          Saltar por ahora
        </button>

        <Button
          onClick={() => onContinue(reflection)}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
