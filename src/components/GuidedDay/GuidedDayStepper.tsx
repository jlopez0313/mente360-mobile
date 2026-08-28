import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Info } from "lucide-react";
import React from "react";

interface GuidedDayStepperProps {
  currentStep: number; // 1, 2, 3
  completedSteps: number[];
  onBack: () => void;
  onStepClick?: (step: number) => void;
  onInfoClick?: () => void;
}

export const GuidedDayStepper: React.FC<GuidedDayStepperProps> = ({
  currentStep,
  completedSteps,
  onBack,
  onStepClick,
  onInfoClick,
}) => {
  const steps = [
    { id: 1, label: "Mensaje" },
    { id: 2, label: "Audio" },
    { id: 3, label: "Música" },
  ];

  return (
    <div className="w-full bg-background pt-3 pb-2 px-4 border-b border-border/40">
      {/* Top bar with back and title */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <h1 className="text-base font-bold font-display text-foreground">
          Mi día guiado
        </h1>

        <button
          onClick={onInfoClick}
          className="w-9 h-9 ml-auto shrink-0 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted active:scale-95 transition-all"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Stepper progress */}
      <div className="relative flex items-center justify-between px-6 pb-2">
        {/* Connecting line */}
        <div className="absolute left-10 right-10 top-3.5 h-[2px] bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width:
                currentStep === 1
                  ? "0%"
                  : currentStep === 2
                  ? "50%"
                  : "100%",
            }}
          />
        </div>

        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick && onStepClick(step.id)}
              className="flex flex-col items-center gap-1.5 z-10 focus:outline-none"
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isDone
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isActive
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium transition-colors",
                  isActive || isDone ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
