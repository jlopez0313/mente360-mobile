import { Slider } from "@/components/ui/slider";
import { formatCount } from "@/helpers/Format";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import {
  Clock,
  Download,
  Heart,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useState } from "react";

function fmtRemaining(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const Clip = () => {
  const {
    activeTrack, // In Clip, track is implicitly the globalTrack
    isPlaying,
    hasLiked,
    likesCount,
    status,
    baseURL,
    AudioNoWifi,
    progress,
    duration,
    currentTime,
    buffer,
    onToggleLike,
    onShareLink,
    onToggleDownload,
    onTogglePlay,
    goToPrev,
    goToNext,
    pause,
    listAudios,
  } = useAudioPlayer(null); // Passing null implies this is the primary Global Player

  const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [, setTick] = useState(0);

  const isDownloaded = !!activeTrack?.audio_local;
  const canSkip = (listAudios?.length ?? 0) > 1;

  // Temporizador de apagado: al llegar a 0 pausa el audio.
  useEffect(() => {
    if (!sleepEndsAt) return;
    const id = setInterval(() => {
      if (Date.now() >= sleepEndsAt) {
        pause();
        setSleepEndsAt(null);
      } else {
        setTick((t) => t + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [sleepEndsAt]);

  const sleepRemainingMs = sleepEndsAt ? sleepEndsAt - Date.now() : 0;

  return (
    <>
      {/* Cover Image */}
      <div className="flex items-center justify-center px-10 py-6">
        <div className="flex items-center w-full max-w-[480px] aspect-square overflow-hidden shadow-glow">
          <img
            src={!status ? AudioNoWifi : baseURL + activeTrack?.imagen}
            alt={activeTrack?.titulo}
            className="w-full object-contain rounded-3xl"
          />
        </div>
      </div>

      <div className="px-6 pb-8 space-y-5">
        {/* Title & me gusta (con contador, igual que en la lista) */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 text-center">
            <h4 className="text-xl font-heading !font-bold text-foreground !m-0">
              {activeTrack?.titulo}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTrack?.categoria?.categoria}
            </p>
          </div>
          <button
            onClick={onToggleLike}
            className="shrink-0 flex items-center gap-1 p-2 text-muted-foreground active:scale-90 transition-transform"
          >
            <Heart className={cn("w-5 h-5", hasLiked ? "fill-sos text-sos" : "")} />
            {likesCount > 0 && (
              <span className="text-xs">{formatCount(likesCount)}</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            buffer={buffer}
            onValueChange={() => {}}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Playback Controls (anterior / Play-Pause / siguiente) */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={goToPrev}
            disabled={!canSkip}
            className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 !rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-glow active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={goToNext}
            disabled={!canSkip}
            className="w-12 h-12 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Secondary Tool Icons */}
        <div className="flex items-center justify-around text-muted-foreground text-[11px]">
          <button
            onClick={() => onToggleDownload("clips")}
            className={cn(
              "flex flex-col items-center gap-1 hover:text-foreground",
              isDownloaded ? "text-primary" : ""
            )}
          >
            <Download className="w-5 h-5" />
            <span>{isDownloaded ? "Descargado" : "Descargar"}</span>
          </button>

          <button
            onClick={() => setShowTimerMenu(!showTimerMenu)}
            className={cn(
              "flex flex-col items-center gap-1 hover:text-foreground transition-colors",
              sleepEndsAt ? "text-primary font-semibold" : ""
            )}
          >
            <Clock className="w-5 h-5" />
            <span>
              {sleepEndsAt ? fmtRemaining(sleepRemainingMs) : "Temporizador"}
            </span>
          </button>

          <button
            onClick={onToggleLike}
            className={cn(
              "flex flex-col items-center gap-1 hover:text-foreground",
              hasLiked ? "text-sos" : ""
            )}
          >
            <Heart
              className={cn("w-5 h-5", hasLiked ? "fill-sos text-sos" : "")}
            />
            <span>Favorito</span>
          </button>

          <button
            onClick={() => activeTrack?.id && onShareLink(activeTrack.id)}
            className="flex flex-col items-center gap-1 hover:text-foreground"
          >
            <Share2 className="w-5 h-5" />
            <span>Compartir</span>
          </button>
        </div>

        {/* Sleep timer preset dropdown */}
        {showTimerMenu && (
          <div className="bg-card border border-border rounded-2xl p-3 grid grid-cols-4 gap-2 text-xs">
            {[15, 30, 45, 60].map((mins) => {
              const active =
                sleepEndsAt != null &&
                Math.round(sleepRemainingMs / 60000) === mins;
              return (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepEndsAt(Date.now() + mins * 60 * 1000);
                    setShowTimerMenu(false);
                  }}
                  className={cn(
                    "!py-2 !rounded-xl text-center font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {mins} m
                </button>
              );
            })}
            {sleepEndsAt != null && (
              <button
                onClick={() => {
                  setSleepEndsAt(null);
                  setShowTimerMenu(false);
                }}
                className="col-span-4 !py-2 !rounded-xl text-center font-semibold bg-muted text-muted-foreground hover:bg-muted/70"
              >
                Cancelar temporizador
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
