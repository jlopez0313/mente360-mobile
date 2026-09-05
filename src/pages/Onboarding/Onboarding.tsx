import { OnboardingCarrusel } from "@/components/Onboarding/OnboardingCarrusel";
import { OnboardingPerfecto } from "@/components/Onboarding/OnboardingPerfecto";
import { OnboardingRuta } from "@/components/Onboarding/OnboardingRuta";
import { OnboardingTemas } from "@/components/Onboarding/OnboardingTemas";
import { OnboardingWelcome } from "@/components/Onboarding/OnboardingWelcome";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ONBOARDING_COPY } from "@/lib/onboardingContent";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useHistory } from "react-router";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const history = useHistory();
  const { saveTemas, finish, setFirstGuidedDayPending } = useOnboarding();

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);

  // Datos de la pantalla 3, por si el usuario retrocede.
  const [temas, setTemas] = useState<string[]>([]);
  const [tiempo, setTiempo] = useState<number | null>(null);

  const goHome = async () => {
    if (busy) return;
    setBusy(true);
    await finish();
    history.replace("/home");
  };

  const goToPrimerDia = async () => {
    if (busy) return;
    setBusy(true);
    await finish();
    await setFirstGuidedDayPending(true);
    history.replace("/dia-guiado");
  };

  const handleTemasNext = (t: string[], min: number) => {
    setTemas(t);
    setTiempo(min);
    saveTemas(t, min); // en segundo plano; no bloquea el avance
    setStep(4);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Barra superior: puntos de progreso + salida siempre visible */}
      <div className="flex items-center justify-between px-5 pt-3 safe-top">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i + 1 === step ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {step > 1 && (
          <button
            onClick={goHome}
            disabled={busy}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {ONBOARDING_COPY.skipShort}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto pb-[calc(var(--ion-safe-area-bottom,env(safe-area-inset-bottom,0px))+1rem)]">
        {step === 1 && (
          <OnboardingWelcome onNext={() => setStep(2)} onSkip={goHome} />
        )}
        {step === 2 && <OnboardingRuta onNext={() => setStep(3)} />}
        {step === 3 && (
          <OnboardingTemas
            initialTemas={temas}
            initialTiempo={tiempo}
            onNext={handleTemasNext}
          />
        )}
        {step === 4 && <OnboardingCarrusel onNext={() => setStep(5)} />}
        {step === 5 && <OnboardingPerfecto onStart={goToPrimerDia} busy={busy} />}
      </div>
    </div>
  );
}
