import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Headphones, MessageSquare, Music } from "lucide-react";
import React from "react";
import { useHistory } from "react-router-dom";

interface GuidedDayCardProps {
  completedSteps: number[];
  isCompleted: boolean;
  onDismiss?: () => void;
}

export const GuidedDayCard: React.FC<GuidedDayCardProps> = ({
  completedSteps,
  isCompleted,
  onDismiss,
}) => {
  const history = useHistory();
  const stepCount = completedSteps.length;

  const handleStart = () => {
    history.push("/dia-guiado");
  };

  return (
    <div className="px-4 mb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 text-white px-5 pt-3 pb-5 shadow-lg">
        {/* Background decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-lg font-bold font-display leading-tight mb-1 text-white">
            Mi día guiado
          </h2>

          {/* Icons Row */}
          <div className="flex items-center justify-center gap-6 mb-2 text-teal-100/90 text-xs font-medium">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                completedSteps.includes(1) ? "bg-white text-teal-700" : "bg-white/20 text-white"
              )}>
                {completedSteps.includes(1) ? <CheckCircle2 className="w-5 h-5" /> : <MessageSquare className="w-4 h-4" />}
              </div>
              <span>Mensaje</span>
            </div>

            <span className="text-white/40 mb-3">•</span>

            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                completedSteps.includes(2) ? "bg-white text-teal-700" : "bg-white/20 text-white"
              )}>
                {completedSteps.includes(2) ? <CheckCircle2 className="w-5 h-5" /> : <Headphones className="w-4 h-4" />}
              </div>
              <span>Audio</span>
            </div>

            <span className="text-white/40 mb-3">•</span>

            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                completedSteps.includes(3) ? "bg-white text-teal-700" : "bg-white/20 text-white"
              )}>
                {completedSteps.includes(3) ? <CheckCircle2 className="w-5 h-5" /> : <Music className="w-4 h-4" />}
              </div>
              <span>Música</span>
            </div>
          </div>

          {/* Subtitle / Progress */}
          {isCompleted ? (
            <p className="text-xs text-teal-100 mb-4">
              ¡Completaste tu día guiado de hoy!
            </p>
          ) : stepCount > 0 ? (
            <p className="text-xs text-teal-100 mb-4 font-medium">
              {stepCount} de 3 completados
            </p>
          ) : (
            <p className="text-xs text-teal-100 mb-4 max-w-[240px]">
              Unos minutos para orientar tu mente y tu corazón.
            </p>
          )}

          {/* Action Button */}
          <Button
            onClick={handleStart}
            className="w-full h-12 !rounded-2xl bg-white text-teal-800 font-bold hover:bg-teal-50 text-sm shadow-md"
          >
            {isCompleted
              ? "Repasar mi día"
              : stepCount > 0
              ? "Continuar mi día"
              : "Comenzar mi día"}
          </Button>

          {/* Secondary Ghost Action */}
          {!isCompleted && stepCount === 0 && (
            <button
              onClick={onDismiss}
              className="mt-4 py-1.5 px-4 text-xs text-teal-200/80 hover:text-white transition-colors"
            >
              Ahora no
            </button>
          )}

          {!isCompleted && stepCount > 0 && (
            <button
              onClick={handleStart}
              className="mt-4 py-1.5 px-4 text-xs text-teal-200/80 hover:text-white transition-colors"
            >
              Ver mi progreso
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
