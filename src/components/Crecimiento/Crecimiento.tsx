import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Crecimientos from "@/database/crecimientos";
import Niveles from "@/database/niveles";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import {
  Download,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Trash2,
} from "lucide-react";

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

  const {
    activeTrack,
    isPlaying,
    status,
    baseURL,
    AudioNoWifi,
    progress,
    duration,
    currentTime,
    buffer,
    onTogglePlay,
    onToggleDownload,
    onLoad,
    audioRef,
    getAudioSrc,
    onTimeUpdate,
    onLoadedMetadata,
    onUpdateBuffer,
  } = useAudioPlayer(currentAudio, currentIndex, false);

  const handlePrevious = () => {
    if (crecimientos?.length && currentIndex > 0) {
      setCurrentAudio(crecimientos[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (crecimientos?.length && currentIndex < crecimientos.length - 1) {
      setCurrentAudio(crecimientos[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
      if (isPlaying) onTogglePlay(); // Pause current before changing
    }
  };

  const handleSaveNext = () => {
    onSaveNext(currentIndex + 1);
    handleNext();
  };

  return (
    <>
      {/* Cover Image */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-[480px] aspect-square rounded-3xl overflow-hidden shadow-glow">
          <img
            src={status ? baseURL + activeTrack?.imagen : AudioNoWifi}
            alt={activeTrack?.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info & Controls */}
      <div className="px-6 pb-8 space-y-6">
        {/* Title & Level */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-heading font-bold text-foreground !m-0">
            {activeTrack?.titulo}
          </h1>
          <span className="text-xs font-heading text-foreground">
            {nivel?.nivel}
          </span>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {activeTrack?.descripcion}
          </p>

          {/* Level Selector */}
          <div className="flex justify-center pt-2">
            <Button size="sm" className="gap-1" variant="outline" onClick={() => onToggleDownload('crecimientos')}>
              {!activeTrack?.audio_local ? (
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
            onValueChange={(value) => {
              onLoad(value[0]);
            }}
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
            onClick={onTogglePlay}
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
            disabled={currentIndex === crecimientos?.length - 1}
            className="w-12 h-12"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={getAudioSrc()}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onUpdateBuffer}
        onEnded={handleSaveNext}
      />
    </>
  );
};
