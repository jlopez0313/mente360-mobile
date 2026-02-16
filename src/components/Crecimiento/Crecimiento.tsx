import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NetworkContext } from "@/context/NetworkContext";
import Crecimientos from "@/database/crecimientos";
import Niveles from "@/database/niveles";
import { useAudio } from "@/hooks/useAudio";
import {
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Trash2,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

interface Props {
  crecimientos: Crecimientos[];
  nivel: Niveles;
  currentAudio: Crecimientos | null;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onSaveNext: (index: number) => void;
  setCurrentAudio: (audio: Crecimientos) => void;
}

export const Crecimiento = ({
  crecimientos,
  nivel,
  currentAudio,
  currentIndex,
  setCurrentIndex,
  onSaveNext,
  setCurrentAudio,
}: Props) => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);

  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);

  const audioRef: any = useRef({
    currentTime: 0,
    duration: 0,
    pause: () => {},
    play: () => {},
    fastSeek: (time: number) => {},
  });

  const {
    progress,
    buffer,
    duration,
    real_duration,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onStart,
    onEnd,
    onPause,
    onPlay,
    onLoad,
    downloadAudio,
    deleteAudio,
    getDownloadedAudio,
  } = useAudio(audioRef, () => {});

  const handlePrevious = () => {
    if (crecimientos?.length && currentIndex > 0) {
      setCurrentAudio(crecimientos[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
      // navigate(`/comunidades/${comunidad?.id}/podcasts/${communityPodcasts[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (crecimientos?.length && currentIndex < crecimientos.length - 1) {
      setCurrentAudio(crecimientos[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
      onPause();
      // navigate(`/comunidades/${communityId}/podcasts/${communityPodcasts[currentIndex + 1].id}`);
    }
  };

  const handleSaveNext = () => {
    onSaveNext(currentIndex + 1);
    handleNext();
  };

  useEffect(() => {
    const loadAudio = async () => {
      if (!currentAudio) {
        setAudioSrc(undefined);
        return;
      }

      if (currentAudio.downloaded == 1) {
        const src = await getDownloadedAudio(currentAudio.audio_local);
        setAudioSrc(src);
      } else {
        setAudioSrc(baseURL + currentAudio.audio);
      }
    };

    loadAudio();
  }, [currentAudio]);
  return (
    <>
      {/* Cover Image */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden shadow-glow">
          <img
            src={status ? baseURL + currentAudio?.imagen : AudioNoWifi}
            alt={currentAudio?.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info & Controls */}
      <div className="px-6 pb-8 space-y-6">
        {/* Title & Level */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-heading font-bold text-foreground !m-0">
            {currentAudio?.titulo}
          </h1>
          <span className="text-xs font-heading text-foreground">
            {nivel?.nivel}
          </span>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {currentAudio?.descripcion}
          </p>

          {/* Level Selector */}
          <div className="flex justify-center pt-2">
            <Button size="sm" className="gap-1" variant="outline">
              {!currentAudio?.audio_local ? (
                <>
                  {" "}
                  <Download className="w-5 h-5" /> Descargar{" "}
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 text-success" /> Eliminar Descarga{" "}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            buffer={buffer * 100}
            onValueChange={(value) => onLoad(value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-12 h-12"
          >
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            size="icon"
            onClick={() => (isPlaying ? onPause() : onPlay())}
            className="w-16 h-16 !rounded-full bg-primary hover:bg-primary/90 shadow-glow"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-primary-foreground" />
            ) : (
              <Play className="w-7 h-7 text-primary-foreground ml-1" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === crecimientos.length - 1}
            className="w-12 h-12"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onUpdateBuffer}
        onEnded={handleSaveNext}
      />
    </>
  );
};
