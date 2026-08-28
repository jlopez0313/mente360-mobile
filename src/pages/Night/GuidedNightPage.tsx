import { AppLayout } from "@/components/layout";
import { GuidedNightAlternativeStep } from "@/components/Night/GuidedNight/GuidedNightAlternativeStep";
import { GuidedNightEmotionStep } from "@/components/Night/GuidedNight/GuidedNightEmotionStep";
import { GuidedNightRecommendationStep } from "@/components/Night/GuidedNight/GuidedNightRecommendationStep";
import { GuidedNightReflectionStep } from "@/components/Night/GuidedNight/GuidedNightReflectionStep";
import { NightPlayerModal } from "@/components/Night/NightPlayerModal";
import { useBackButton } from "@/hooks/useBackButton";
import { useDiario } from "@/hooks/useDiario";
import { db } from "@/hooks/useDexie";
import { useNightFavorites } from "@/hooks/useNightFavorites";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const { upsertToday } = useDiario();

  // Categorías y audios de noche desde Dexie (sincronizados de la API).
  const nightCategories = useLiveQuery(() => db.categorias_noche.toArray());
  const availableAudios =
    useLiveQuery(() => db.audios_noche.toArray()) ?? [];

  // Audios de una categoría (o todos si no hay id / no hay match)
  const audiosForCategory = (id: number | null): any[] => {
    if (!id) return availableAudios;
    const match = availableAudios.filter(
      (a: any) =>
        a.categorias_noche_id === id || a.categoria?.id === id
    );
    return match.length > 0 ? match : availableAudios;
  };

  // La recomendación se elige UNA vez (al pasar al paso 3), no en cada render,
  // así no cambia sola mientras el usuario la mira.
  const [recommendedAudio, setRecommendedAudio] = useState<any>(null);

  const pickRecommendation = (id: number | null) => {
    const pool = audiosForCategory(id);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const goToRecommendation = (id: number | null, nombre?: string) => {
    setCategoryId(id);
    const rec = pickRecommendation(id);
    setRecommendedAudio(rec);
    setStep(3);
    upsertToday({
      categoria_noche_id: id,
      estado_emocional: nombre ?? null,
      audio_recomendado_id: rec?.id ?? null,
    });
  };

  // Si al pasar al paso 3 los audios aún no estaban en Dexie, elegir apenas lleguen.
  useEffect(() => {
    if (step === 3 && !recommendedAudio && availableAudios.length) {
      setRecommendedAudio(pickRecommendation(categoryId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, availableAudios.length]);

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
      <div className="min-h-full flex flex-col bg-background safe-top">
       <div className="flex-1 flex flex-col px-5 pt-1 pb-[calc(var(--ion-safe-area-bottom,env(safe-area-inset-bottom,0px))+2rem)]">
        {/* Header with Step Indicator */}
        <div className="flex items-center gap-2 mb-4 border-b border-border/40 pb-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 -ml-1.5 shrink-0 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <h1 className="text-base font-bold font-display text-foreground">
            Mi noche guiada
          </h1>

          <span className="text-xs font-bold text-muted-foreground ml-auto shrink-0 font-display">
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
              if (text.trim()) upsertToday({ texto_cierre_dia: text.trim() });
              setStep(2);
            }}
            onSkip={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <GuidedNightEmotionStep
            categories={nightCategories}
            initialCategoryId={categoryId}
            onContinue={(id, nombre) => goToRecommendation(id, nombre)}
            onSkip={() => goToRecommendation(null)}
          />
        )}

        {step === 3 && (
          <GuidedNightRecommendationStep
            audio={recommendedAudio}
            onPlay={() => {
              setSelectedAudio(recommendedAudio);
              if (recommendedAudio?.id)
                upsertToday({ audio_escuchado_id: recommendedAudio.id });
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
              if (aud?.id) upsertToday({ audio_escuchado_id: aud.id });
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
