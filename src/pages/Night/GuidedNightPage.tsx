import { AppLayout } from "@/components/layout";
import { GuidedNightAlternativeStep } from "@/components/Night/GuidedNight/GuidedNightAlternativeStep";
import { GuidedNightEmotionStep } from "@/components/Night/GuidedNight/GuidedNightEmotionStep";
import { GuidedNightRecommendationStep } from "@/components/Night/GuidedNight/GuidedNightRecommendationStep";
import { GuidedNightReflectionStep } from "@/components/Night/GuidedNight/GuidedNightReflectionStep";
import { NightPlayerModal } from "@/components/Night/NightPlayerModal";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

const GuidedNightPage: React.FC = () => {
  const history = useHistory();
  useBackButton("/mi-noche");

  // Step state: 1 (Reflection), 2 (Emotion), 3 (Recommendation), 3.5 (Alternative List)
  const [step, setStep] = useState<number>(1);
  const [reflection, setReflection] = useState<string>("");
  const [emotion, setEmotion] = useState<string>("Ansiedad");
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<any>(null);

  // Load night audios from Dexie
  const allNightAudios = useLiveQuery(() => db.audios_noche.toArray());
  const fallbackAudios = useLiveQuery(() => db.audios.toArray());

  const availableAudios = useMemo(() => {
    if (allNightAudios && allNightAudios.length > 0) return allNightAudios;
    if (fallbackAudios && fallbackAudios.length > 0) return fallbackAudios;
    return [];
  }, [allNightAudios, fallbackAudios]);

  // Recommended audio based on emotion or random
  const recommendedAudio = useMemo(() => {
    if (!availableAudios || availableAudios.length === 0) return null;
    if (emotion) {
      const match = availableAudios.filter(
        (a: any) =>
          a.titulo?.toLowerCase().includes(emotion.toLowerCase()) ||
          a.descripcion?.toLowerCase().includes(emotion.toLowerCase())
      );
      if (match.length > 0) {
        return match[Math.floor(Math.random() * match.length)];
      }
    }
    return availableAudios[0];
  }, [availableAudios, emotion]);

  const activeAudioToPlay = selectedAudio || recommendedAudio;

  const handleBack = () => {
    if (step === 3.5) {
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      history.replace("/mi-noche");
    }
  };

  const stepDisplay = step === 3.5 ? "3/4" : `${step}/4`;
  const stepPercent = step === 1 ? "25%" : step === 2 ? "50%" : "75%";

  return (
    <AppLayout>
      <div className="h-full safe-top safe-bottom flex flex-col bg-background px-5 py-4 overflow-y-auto">
        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-xs font-semibold text-foreground font-display">
              Mi noche guiada
            </span>
          </div>

          <span className="text-xs font-bold text-muted-foreground w-9 text-right font-display">
            {stepDisplay}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: stepPercent }}
          />
        </div>

        {/* Step Views */}
        {step === 1 && (
          <GuidedNightReflectionStep
            initialValue={reflection}
            onContinue={(text) => {
              setReflection(text);
              setStep(2);
            }}
            onSkip={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <GuidedNightEmotionStep
            initialEmotion={emotion}
            onContinue={(emo) => {
              setEmotion(emo);
              setStep(3);
            }}
            onSkip={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <GuidedNightRecommendationStep
            audio={recommendedAudio}
            emotion={emotion}
            onPlay={() => {
              setSelectedAudio(recommendedAudio);
              setIsPlayerOpen(true);
            }}
            onSeeOther={() => setStep(3.5)}
            onLater={() => history.push("/home")}
          />
        )}

        {step === 3.5 && (
          <GuidedNightAlternativeStep
            audios={availableAudios}
            onSelectAudio={(aud) => {
              setSelectedAudio(aud);
              setIsPlayerOpen(true);
            }}
          />
        )}

        {/* Night Player */}
        <NightPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          audioItem={activeAudioToPlay}
          onCompleted={() => {
            setIsPlayerOpen(false);
            history.push("/home");
          }}
        />
      </div>
    </AppLayout>
  );
};

export default GuidedNightPage;
