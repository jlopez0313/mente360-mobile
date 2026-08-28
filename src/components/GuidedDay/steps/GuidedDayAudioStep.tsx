import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GuidedDayLockedStep } from "@/components/GuidedDay/steps/GuidedDayLockedStep";
import { NetworkContext } from "@/context/NetworkContext";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Pause, Play, SkipForward } from "lucide-react";
import React, { useContext, useMemo, useRef } from "react";
import { useSelector } from "react-redux";

interface GuidedDayAudioStepProps {
  onContinue: () => void;
  onSkip?: () => void;
  locked?: boolean;
}

export const GuidedDayAudioStep: React.FC<GuidedDayAudioStepProps> = ({
  onContinue,
  onSkip,
  locked = false,
}) => {
  if (locked) {
    return (
      <GuidedDayLockedStep
        label="El audio de hoy"
        onSkip={onSkip || onContinue}
      />
    );
  }

  return <GuidedDayAudioStepInner onContinue={onContinue} onSkip={onSkip} />;
};

const GuidedDayAudioStepInner: React.FC<GuidedDayAudioStepProps> = ({
  onContinue,
  onSkip,
}) => {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // El crecimiento "actual" del usuario viene en user.crecimientos[0].
  const myCrecimiento = useMemo(() => user?.crecimientos?.[0], [user]);

  // Misma resolución que la pantalla de Crecimientos (y NivelCard):
  // se toma la lista del nivel y se ubica el crecimiento cuyo id coincide
  // con el progreso del usuario; si no está en la lista, el primero del nivel.
  const crecimiento = useLiveQuery(async () => {
    if (!myCrecimiento) return null;
    const lista = await db.crecimientos
      .filter((c: any) => c.nivel?.id == myCrecimiento?.nivel?.id)
      .toArray();
    if (!lista.length) return null;
    const found = lista.find((c: any) => c.id == myCrecimiento.id);
    return found ?? lista[0];
  }, [myCrecimiento]);

  // Fallback si el nivel aún no está sincronizado en Dexie.
  const podcast = crecimiento ?? myCrecimiento;

  const audioSource =
    status && podcast?.audio ? `${baseURL}${podcast.audio}` : "";

  const {
    progress,
    duration,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onPause,
    onPlay,
    onLoad,
  } = useAudio(audioRef, () => {
    onContinue();
  }, false);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const title = podcast?.titulo ?? "";
  const subtitle = (podcast?.nivel as any)?.nivel ?? "";
  const coverUrl =
    status && podcast?.imagen ? `${baseURL}${podcast.imagen}` : AudioNoWifi;

  // Sin crecimiento / sin audio: no hay reproductor que mostrar.
  const hasAudio = !!podcast?.audio;

  if (!hasAudio) {
    return (
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
            No hay un audio disponible para hoy.
          </p>
        </div>
        <Button
          onClick={onContinue}
          className="w-full h-12 shrink-0 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-4 overflow-y-auto">
      <div className="flex flex-col items-center text-center mt-2">
        {/* Cover Art */}
        <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-elevated mb-6 bg-muted">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-xl font-bold font-display text-foreground mb-1 leading-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mb-6">{subtitle}</p>

        {/* Scrubber & Timers */}
        <div className="w-full max-w-xs mb-6">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(val) => onLoad(val)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{currentTime || "00:00"}</span>
            <span>{duration || "00:00"}</span>
          </div>
        </div>

        {/* Controls Row: Saltar | Play/Pause | Next */}
        <div className="flex items-center justify-center gap-8 w-full max-w-xs mb-4">
          <Button
            variant="ghost"
            onClick={onSkip || onContinue}
            className="text-xs text-muted-foreground font-semibold hover:text-foreground"
          >
            Saltar
          </Button>

          <Button
            size="icon"
            onClick={handlePlayPause}
            className="w-16 h-16 !rounded-full bg-primary hover:bg-primary/90 shadow-glow"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-primary-foreground fill-current" />
            ) : (
              <Play className="w-7 h-7 text-primary-foreground fill-current ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onContinue}
            className="w-12 h-12 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioSource}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onUpdateBuffer}
        onEnded={() => onContinue()}
      />
    </div>
  );
};
