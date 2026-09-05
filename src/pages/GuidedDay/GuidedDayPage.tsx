import { AppLayout } from "@/components/layout";
import { GuidedDayStepper } from "@/components/GuidedDay/GuidedDayStepper";
import { MusicPreferencesModal } from "@/components/GuidedDay/MusicPreferencesModal";
import { GuidedDayAudioStep } from "@/components/GuidedDay/steps/GuidedDayAudioStep";
import { GuidedDayCompletedStep } from "@/components/GuidedDay/steps/GuidedDayCompletedStep";
import { GuidedDayMessageStep } from "@/components/GuidedDay/steps/GuidedDayMessageStep";
import { GuidedDayMusicStep } from "@/components/GuidedDay/steps/GuidedDayMusicStep";
import { OnboardingPrimerDia } from "@/components/Onboarding/OnboardingPrimerDia";
import { useGuidedDay } from "@/hooks/useGuidedDay";
import { useOnboarding } from "@/hooks/useOnboarding";
import { usePayment } from "@/hooks/usePayment";
import { useIonAlert } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const GuidedDayPage: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  // Audio y Música son premium: sin plan activo se muestra el paywall.
  const { userEnabled, payment_status } = usePayment();
  const contentLocked = !userEnabled || payment_status === "free";

  const {
    completedSteps,
    currentStep,
    isCompleted,
    hasMusicPreferences,
    preferences,
    completeStep,
    saveMusicPreferences,
  } = useGuidedDay();

  // Cuando se llega acá desde el onboarding, al terminar se muestra la pantalla
  // 7 ("Tu primer día ha comenzado") en vez del cierre normal.
  const { getFirstGuidedDayPending, setFirstGuidedDayPending } = useOnboarding();
  const [firstRun, setFirstRun] = useState(false);

  useEffect(() => {
    getFirstGuidedDayPending().then(setFirstRun);
  }, [getFirstGuidedDayPending]);

  const finishFirstRun = async () => {
    await setFirstGuidedDayPending(false);
    setFirstRun(false);
    history.replace("/home");
  };

  // When reviewing or starting fresh, start at Step 1 if completed or at currentStep
  const initialStep = isCompleted ? 1 : currentStep || 1;

  const [activeStep, setActiveStep] = useState<number>(initialStep);

  // Only prompt for music preferences when the user actually reaches step 3,
  // not on the first entry to "Mi día guiado".
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(
    initialStep === 3 && !hasMusicPreferences && !contentLocked
  );

  const handleBack = () => {
    history.push("/home");
  };

  const handleInfo = () => {
    presentAlert({
      header: "Mi día guiado",
      message:
        "Una experiencia de 3 pasos (Mensaje, Audio y Música) diseñada para orientar tu mente y tu corazón cada mañana.",
      buttons: ["Entendido"],
    });
  };

  const handleStepClick = (stepId: number) => {
    // Can switch to completed steps, current step, or any step if already finished for today
    if (
      isCompleted ||
      completedSteps.includes(stepId) ||
      stepId === currentStep
    ) {
      setActiveStep(stepId);
      if (stepId === 3 && !hasMusicPreferences && !contentLocked) {
        setShowPreferencesModal(true);
      }
    }
  };

  const handleCompleteMessage = () => {
    completeStep(1);
    setActiveStep(2);
  };

  const handleCompleteAudio = () => {
    completeStep(2);
    // If user has no music preferences yet, show modal before step 3
    // (skip it for locked users — they won't get to the music player anyway)
    if (!hasMusicPreferences && !contentLocked) {
      setShowPreferencesModal(true);
    }
    setActiveStep(3);
  };

  const handleCompleteMusic = () => {
    completeStep(3);
    setActiveStep(4);
  };

  const handleFinish = () => {
    history.push("/home");
  };

  const handleReview = () => {
    setActiveStep(1);
  };

  return (
    <AppLayout>
      <div className="h-full safe-top flex flex-col bg-background">
        {/* Stepper Header (only when not in completion celebration) */}
        {activeStep <= 3 && (
          <GuidedDayStepper
            currentStep={activeStep}
            completedSteps={completedSteps}
            onBack={handleBack}
            onStepClick={handleStepClick}
            onInfoClick={handleInfo}
          />
        )}

        {/* Step Content */}
        {activeStep === 1 && (
          <GuidedDayMessageStep onContinue={handleCompleteMessage} />
        )}

        {activeStep === 2 && (
          <GuidedDayAudioStep
            onContinue={handleCompleteAudio}
            onSkip={handleCompleteAudio}
            locked={contentLocked}
          />
        )}

        {activeStep === 3 && (
          <GuidedDayMusicStep
            preferences={preferences}
            onComplete={handleCompleteMusic}
            locked={contentLocked}
          />
        )}

        {activeStep === 4 &&
          (firstRun ? (
            <OnboardingPrimerDia
              onVolver={finishFirstRun}
              onExplorar={finishFirstRun}
            />
          ) : (
            <GuidedDayCompletedStep
              onFinish={handleFinish}
              onReview={handleReview}
            />
          ))}

        {/* Music Preferences Modal */}
        <MusicPreferencesModal
          isOpen={showPreferencesModal}
          initialPreferences={preferences}
          onClose={() => setShowPreferencesModal(false)}
          onSave={(genres) => {
            saveMusicPreferences(genres);
            setShowPreferencesModal(false);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default GuidedDayPage;
