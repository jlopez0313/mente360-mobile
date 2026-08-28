import { Slider } from "@/components/ui/slider";
import { NetworkContext } from "@/context/NetworkContext";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { useNightFavorites } from "@/hooks/useNightFavorites";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Download,
  Heart,
  Moon,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Share2,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function fmtRemaining(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface NightPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioItem: any;
  dayIndex?: number;
  totalDays?: number;
  onCompleted?: () => void;
}

export const NightPlayerModal: React.FC<NightPlayerModalProps> = ({
  isOpen,
  onClose,
  audioItem,
  dayIndex,
  totalDays = 21,
  onCompleted,
}) => {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isRestMode, setIsRestMode] = useState(false);
  const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null);
  const [, setTick] = useState(0);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [localSrc, setLocalSrc] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useNightFavorites();

  const isDownloaded = !!audioItem?.audio_local;
  const isLiked = isFavorite(audioItem?.id);

  const audioSrc =
    localSrc ||
    (status && audioItem?.audio ? `${baseURL}${audioItem.audio}` : "");

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
    downloadAudio,
    deleteAudio,
    getDownloadedAudio,
    onShareLink,
  } = useAudio(
    audioRef,
    () => {
      if (onCompleted) onCompleted();
    },
    false
  );

  // Resolver ruta local si el audio está descargado
  useEffect(() => {
    let cancelled = false;
    if (audioItem?.audio_local) {
      getDownloadedAudio(audioItem.audio_local).then((uri: string) => {
        if (!cancelled) setLocalSrc(uri || null);
      });
    } else {
      setLocalSrc(null);
    }
    return () => {
      cancelled = true;
    };
  }, [audioItem?.audio_local]);

  // Auto-play on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onPlay();
      }, 200);
    } else {
      onPause();
      setIsRestMode(false);
      setSleepEndsAt(null);
    }
  }, [isOpen]);

  // Sleep timer: cuenta regresiva; al llegar a 0 pausa el audio
  useEffect(() => {
    if (!sleepEndsAt) return;
    const id = setInterval(() => {
      if (Date.now() >= sleepEndsAt) {
        onPause();
        setSleepEndsAt(null);
      } else {
        setTick((t) => t + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [sleepEndsAt]);

  const sleepRemainingMs = sleepEndsAt ? sleepEndsAt - Date.now() : 0;

  const toggleFav = () => toggleFavorite(audioItem?.id);

  const onToggleDownload = async () => {
    if (!audioItem?.id) return;
    try {
      if (isDownloaded) {
        await deleteAudio(audioItem.audio_local);
        await db.audios_noche.update(audioItem.id, {
          audio_local: "",
          imagen_local: "",
          downloaded: 0,
        });
        toast.success("Eliminado de descargas");
      } else {
        const ruta = await downloadAudio(
          `${baseURL}${audioItem.audio}`,
          `noche_${audioItem.id}`
        );
        if (ruta) {
          await db.audios_noche.update(audioItem.id, {
            audio_local: ruta,
            imagen_local: audioItem.imagen,
            downloaded: 1,
          });
          toast.success("Descargado para offline");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("No se pudo descargar el audio");
    }
  };

  const handleSeekOffset = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds)
      );
    }
  };

  if (!isOpen) return null;

  const title = audioItem?.titulo ?? "";
  const coverUrl =
    status && audioItem?.imagen
      ? `${baseURL}${audioItem.imagen}`
      : AudioNoWifi;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#090e1a] via-[#0d1627] to-[#060b14] text-white flex flex-col safe-top safe-bottom overflow-y-auto">
     <div className="flex-1 flex flex-col px-6 pt-4 pb-7">
      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-zinc-300 hover:text-white active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
          <Moon className="w-4 h-4 text-amber-200 fill-amber-200" />
          <span>Noche</span>
        </div>

        <div className="w-10" />
      </div>

      {/* Center Visual Art */}
      <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
        {/* Cover Art with subtle glow */}
        <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl mb-8 border border-white/10 group">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Title & Series info */}
        <div className="w-full max-w-xs flex items-start justify-between mb-4">
          <div className="text-left">
            <h2 className="text-xl font-bold font-display text-white mb-1">
              {title}
            </h2>
            <p className="text-xs text-zinc-400">
              {[
                dayIndex ? `Día ${dayIndex} de ${totalDays}` : null,
                audioItem?.categoria?.nombre || null,
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>

          <button
            onClick={toggleFav}
            disabled={!audioItem?.id}
            className="p-2 text-zinc-400 hover:text-white active:scale-90 transition-transform disabled:opacity-40"
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isLiked ? "text-rose-500 fill-rose-500" : ""
              )}
            />
          </button>
        </div>

        {/* Scrubber */}
        <div className="w-full max-w-xs mb-6">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(val) => onLoad(val)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            <span>{currentTime || "00:00"}</span>
            <span>{duration || "--:--"}</span>
          </div>
        </div>

        {/* Playback Controls (-15s, Play/Pause, +15s) */}
        <div className="flex items-center justify-center gap-8 w-full max-w-xs mb-8">
          <button
            onClick={() => handleSeekOffset(-15)}
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-zinc-300 hover:text-white active:scale-95 transition-transform"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5">15</span>
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-xl active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={() => handleSeekOffset(15)}
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-zinc-300 hover:text-white active:scale-95 transition-transform"
          >
            <RotateCw className="w-6 h-6" />
            <span className="text-[9px] font-bold mt-0.5">15</span>
          </button>
        </div>

        {/* Secondary Tool Icons */}
        <div className="flex items-center justify-around w-full max-w-xs text-zinc-400 text-[11px] mb-8">
          <button
            onClick={onToggleDownload}
            disabled={!audioItem?.id}
            className={cn(
              "flex flex-col items-center gap-1 hover:text-white disabled:opacity-40",
              isDownloaded ? "text-amber-300" : ""
            )}
          >
            <Download className="w-5 h-5" />
            <span>{isDownloaded ? "Descargado" : "Descargar"}</span>
          </button>

          <button
            onClick={() => setShowTimerMenu(!showTimerMenu)}
            className={cn(
              "flex flex-col items-center gap-1 hover:text-white transition-colors",
              sleepEndsAt ? "text-amber-300 font-semibold" : ""
            )}
          >
            <Clock className="w-5 h-5" />
            <span>
              {sleepEndsAt ? fmtRemaining(sleepRemainingMs) : "Temporizador"}
            </span>
          </button>

          <button
            onClick={toggleFav}
            disabled={!audioItem?.id}
            className="flex flex-col items-center gap-1 hover:text-white disabled:opacity-40"
          >
            <Heart className={cn("w-5 h-5", isLiked ? "text-rose-500 fill-rose-500" : "")} />
            <span>Favorito</span>
          </button>

          <button
            onClick={() => audioItem?.id && onShareLink(audioItem.id)}
            disabled={!audioItem?.id}
            className="flex flex-col items-center gap-1 hover:text-white disabled:opacity-40"
          >
            <Share2 className="w-5 h-5" />
            <span>Compartir</span>
          </button>
        </div>

        {/* Sleep timer preset dropdown */}
        {showTimerMenu && (
          <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded-2xl p-3 mb-6 grid grid-cols-4 gap-2 text-xs">
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
                      ? "bg-amber-400 text-zinc-950"
                      : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
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
                className="col-span-4 !py-2 !rounded-xl text-center font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Cancelar temporizador
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Rest Mode Trigger Button */}
      <div className="shrink-0 flex flex-col items-center pt-4">
        <button
          onClick={() => setIsRestMode(true)}
          className="w-full max-w-xs !py-4 !px-6 !rounded-2xl bg-white/10 hover:bg-white/[0.16] !border !border-white/25 shadow-lg flex items-center justify-center gap-2.5 text-sm font-semibold text-white active:scale-[0.98] transition-all"
        >
          <Moon className="w-[18px] h-[18px] text-amber-200 fill-amber-200" />
          <span>Activar modo descanso</span>
        </button>
        <p className="text-[10px] text-zinc-500 mt-2.5 text-center">
          La pantalla se apagará automáticamente
        </p>
      </div>
     </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onUpdateBuffer}
        onEnded={() => {
          if (onCompleted) onCompleted();
        }}
      />

      {/* Modo descanso: overlay negro, NO desmonta el <audio> (sigue sonando) */}
      {isRestMode && (
        <div
          onClick={() => setIsRestMode(false)}
          className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center cursor-pointer select-none text-zinc-700 hover:text-zinc-500 transition-colors p-6 text-center safe-top safe-bottom"
        >
          <Moon className="w-10 h-10 mb-4 opacity-40 animate-pulse-soft" />
          <p className="text-xs tracking-widest uppercase">
            Modo descanso activo
          </p>
          <p className="text-[10px] mt-2 opacity-50">
            Toca la pantalla en cualquier lugar para despertar los controles
          </p>
        </div>
      )}
    </div>
  );
};
