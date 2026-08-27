import { AppLayout } from "@/components/layout";
import { GuidedNightAlternativeStep } from "@/components/Night/GuidedNight/GuidedNightAlternativeStep";
import { GuidedNightEmotionStep } from "@/components/Night/GuidedNight/GuidedNightEmotionStep";
import { GuidedNightRecommendationStep } from "@/components/Night/GuidedNight/GuidedNightRecommendationStep";
import { GuidedNightReflectionStep } from "@/components/Night/GuidedNight/GuidedNightReflectionStep";
import { NightPlayerModal } from "@/components/Night/NightPlayerModal";
import { useBackButton } from "@/hooks/useBackButton";
import { db } from "@/hooks/useDexie";
import { useNightFavorites } from "@/hooks/useNightFavorites";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const GuidedNightPage: React.FC = () => {
  const history = useHistory();
  useBackButton("/mi-noche");

  // Step state: 1 (Reflection), 2 (Emotion), 3 (Recommendation), 3.5 (Alternative List)
  const [step, setStep] = useState<number>(1);
  const [reflection, setReflection] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const [alternativeAudios, setAlternativeAudios] = useState<any[]>([]);

  const { favoriteIds } = useNightFavorites();

  // Categorías y audios de noche desde Dexie
  const nightCategories = useLiveQuery(() => db.categorias_noche.toArray());
  const allNightAudios = useLiveQuery(() => db.audios_noche.toArray());
  const fallbackAudios = useLiveQuery(() => db.audios.toArray());

  const availableAudios = useMemo(() => {
    if (allNightAudios && allNightAudios.length > 0) return allNightAudios;
    if (fallbackAudios && fallbackAudios.length > 0) return fallbackAudios;
    return [];
  }, [allNightAudios, fallbackAudios]);

  // Audios de la categoría elegida (o todos si no hay match)
  const categoryAudios = useMemo(() => {
    if (!categoryId) return availableAudios;
    const match = availableAudios.filter(
      (a: any) =>
        a.categorias_noche_id === categoryId || a.categoria?.id === categoryId
    );
    return match.length > 0 ? match : availableAudios;
  }, [availableAudios, categoryId]);

  // Audio recomendado: uno de la categoría (aleatorio), o el primero disponible
  const recommendedAudio = useMemo(() => {
    if (!categoryAudios || categoryAudios.length === 0) return null;
    return categoryAudios[Math.floor(Math.random() * categoryAudios.length)];
  }, [categoryAudios]);

  const activeAudioToPlay = selectedAudio || recommendedAudio;

  // "Ver otra opción": hasta 2 favoritos al azar + relleno con audios de noche
  // hasta completar 3 (0 favs → 3 audios, 1 → 2, 2+ → 1).
  const buildAlternatives = () => {
    const list: any[] = availableAudios;
    if (!list.length) return [];
    const byId = new Map(list.map((a) => [a.id, a]));
    const favAudios = shuffle(
      favoriteIds.map((id) => byId.get(id)).filter(Boolean) as any[]
    ).slice(0, 2);
    const chosen = new Set(favAudios.map((a) => a.id));
    const fillers = shuffle(list.filter((a) => !chosen.has(a.id))).slice(
      0,
      Math.max(0, 3 - favAudios.length)
    );
    return [...favAudios, ...fillers];
  };

  const handleSeeOther = () => {
    setAlternativeAudios(buildAlternatives());
    setStep(3.5);
  };

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
      <div className="min-h-full flex flex-col bg-background safe-top safe-bottom">
       <div className="flex-1 flex flex-col px-5 pt-4 pb-4">
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
            categories={nightCategories}
            initialCategoryId={categoryId}
            onContinue={(id) => {
              setCategoryId(id);
              setStep(3);
            }}
            onSkip={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <GuidedNightRecommendationStep
            audio={recommendedAudio}
            onPlay={() => {
              setSelectedAudio(recommendedAudio);
              setIsPlayerOpen(true);
            }}
            onSeeOther={handleSeeOther}
            onLater={() => history.push("/home")}
          />
        )}

        {step === 3.5 && (
          <GuidedNightAlternativeStep
            audios={alternativeAudios}
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
      </div>
    </AppLayout>
  );
};

export default GuidedNightPage;
