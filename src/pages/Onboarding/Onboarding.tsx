import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Heart,
    Music,
    Sparkles,
    Users
} from "lucide-react";
import { useState } from "react";
import { useHistory } from "react-router";

interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    icon: Sparkles,
    title: `¡Bienvenido a ${import.meta.env.VITE_NAME}!`,
    description: "Tu compañero de bienestar mental. Aquí encontrarás herramientas, contenido y una comunidad para cuidar tu salud emocional.",
    color: "primary",
  },
  {
    id: "content",
    icon: Heart,
    title: "Contenido diario",
    description: "Cada día recibirás un mensaje inspirador, audio de relajación, tareas semanales y apoyo emocional cuando lo necesites.",
    color: "sos",
  },
  {
    id: "music",
    icon: Music,
    title: "Musicaterapia",
    description: "Accede a una biblioteca de sonidos y música diseñada para reducir el estrés, mejorar el sueño y aumentar tu concentración.",
    color: "accent",
  },
  {
    id: "community",
    icon: Users,
    title: "Comunidades",
    description: "Únete a grupos de apoyo, escucha podcasts de expertos y conecta con personas que comparten tu camino de crecimiento.",
    color: "premium",
  },
  {
    id: "reminders",
    icon: Bell,
    title: "Recordatorios",
    description: "Configura alarmas personalizadas para tus momentos de mindfulness, meditación o cualquier hábito saludable.",
    color: "night",
  },
];

const colorStyles: Record<string, { bg: string; iconBg: string }> = {
  primary: { bg: "bg-primary/10", iconBg: "gradient-primary" },
  sos: { bg: "bg-sos/10", iconBg: "gradient-sos" },
  accent: { bg: "bg-accent/10", iconBg: "gradient-accent" },
  premium: { bg: "bg-premium/10", iconBg: "gradient-premium" },
  night: { bg: "bg-night/10", iconBg: "gradient-night" },
};

export default function OnboardingPage() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const Icon = step.icon;
  const styles = colorStyles[step.color];

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem("mente360_onboarding_complete", "true");
      history.replace("/home");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("mente360_onboarding_complete", "true");
    history.replace("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <img src={logo} alt="Mente 360" className="w-10 object-contain" />
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Omitir
        </button>
      </header>

      {/* Progress */}
      <div className="px-6">
        <Progress value={progress} className="h-1" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {currentStep + 1} de {steps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Icon */}
        <div
          className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center mb-8",
            styles.bg
          )}
        >
          <div
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center",
              styles.iconBg
            )}
          >
            <Icon className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-4">
          {step.title}
        </h1>
        <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
          {step.description}
        </p>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentStep
                  ? "w-6 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 flex items-center gap-3">
        {currentStep > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrev}
            className="flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleNext}
          className="flex-1 gap-2"
        >
          {isLastStep ? "Comenzar" : "Siguiente"}
          {!isLastStep && <ChevronRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
