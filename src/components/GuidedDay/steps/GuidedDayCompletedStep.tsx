import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import React from "react";

interface GuidedDayCompletedStepProps {
  onFinish: () => void;
  onReview?: () => void;
}

export const GuidedDayCompletedStep: React.FC<GuidedDayCompletedStepProps> = ({
  onFinish,
  onReview,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-8">
      <div className="flex flex-col items-center text-center mt-8">
        {/* Animated Check Bubble with celebratory glow */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center animate-scale-in">
            <div className="w-18 h-18 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
          </div>
          {/* Confetti particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <div className="absolute -bottom-1 -left-3 w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <div className="absolute top-2 -left-4 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <div className="absolute -bottom-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </div>

        <h1 className="text-2xl font-bold font-display text-foreground mb-3">
          ¡Listo!
        </h1>

        <p className="text-sm text-muted-foreground max-w-[260px] mb-8 leading-relaxed">
          Has completado tu día guiado. Lleva contigo lo que aprendiste e
          intégralo en tu vida diaria.
        </p>

        {/* Inspirational quote */}
        <div className="w-full bg-card rounded-2xl p-5 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "Lo importante no es escuchar más. Es llevar algo de lo escuchado a
            tu vida."
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-3">
        <Button
          onClick={onFinish}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Finalizar
        </Button>

        {onReview && (
          <Button
            variant="ghost"
            onClick={onReview}
            className="w-full h-11 !rounded-2xl text-muted-foreground font-semibold hover:text-foreground text-sm"
          >
            Repasar mi día
          </Button>
        )}
      </div>
    </div>
  );
};
