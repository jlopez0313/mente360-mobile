import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GuidedDayLockedStep } from "@/components/GuidedDay/steps/GuidedDayLockedStep";
import { NetworkContext } from "@/context/NetworkContext";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import { dislike, like } from "@/services/likes";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Download,
  Heart,
  Music,
  Pause,
  Play,
  Share2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import React, { useContext, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface GuidedDayMusicStepProps {
  preferences: (number | string)[];
  onComplete: () => void;
  locked?: boolean;
}

export const GuidedDayMusicStep: React.FC<GuidedDayMusicStepProps> = ({
  preferences,
  onComplete,
  locked = false,
}) => {
  if (locked) {
    return <GuidedDayLockedStep label="La música de hoy" onSkip={onComplete} />;
  }

  return (
    <GuidedDayMusicStepInner preferences={preferences} onComplete={onComplete} />
  );
};

const GuidedDayMusicStepInner: React.FC<GuidedDayMusicStepProps> = ({
  preferences,
  onComplete,
}) => {
  const { baseURL, status } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);
  // Sub-phases: 'intro' (4) | 'selected' (5) | 'playing' (6)
  const [subPhase, setSubPhase] = useState<"intro" | "selected" | "playing">(
    "intro",
  );

  // Pick a clip matching preferences or random
  const allClips = useLiveQuery(() => db.clips.toArray());
  const selectedClip = useMemo(() => {
    if (!allClips || allClips.length === 0) return null;
    if (preferences.length > 0) {
      const matched = allClips.filter((c: any) =>
        preferences.some((p) => {
          if (typeof p === "number") {
            return c.categorias_id === p || c.categoria?.id === p;
          }
          const str = String(p).toLowerCase();
          return (
            c.titulo?.toLowerCase().includes(str) ||
            c.categoria?.categoria?.toLowerCase().includes(str)
          );
        }),
      );
      if (matched.length > 0) {
        return matched[Math.floor(Math.random() * matched.length)];
      }
    }
    return allClips[Math.floor(Math.random() * allClips.length)];
  }, [allClips, preferences]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc =
    status && selectedClip?.audio ? `${baseURL}${selectedClip.audio}` : "";

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
    onShareLink,
  } = useAudio(
    audioRef,
    () => {
      onComplete();
    },
    false,
  );

  // ── Favorito (likes: API + db.likes, igual que Musicoterapia) ──
  const myLike = useLiveQuery(async () => {
    if (!selectedClip || !user?.id) return undefined;
    return db.likes
      .where("users_id")
      .equals(user.id)
      .and((l: any) => l.clips_id === selectedClip.id)
      .first();
  }, [user?.id, selectedClip?.id]);
  const isLiked = !!myLike;

  const onToggleLike = async () => {
    const clipId = selectedClip?.id;
    if (clipId == null || !user?.id) return;
    try {
      if (myLike) {
        await dislike(myLike.id ?? 0);
        await db.likes.where("id").equals(myLike.id ?? 0).delete();
      } else {
        const payload = { clips_id: clipId, users_id: user.id };
        const {
          data: { data: added },
        } = await like(payload);
        await db.likes.add({ ...payload, id: added.id });
      }
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar el favorito");
    }
  };

  // ── Descargar (offline: archivo en dispositivo + flags en db.clips) ──
  const isDownloaded = !!(selectedClip as any)?.audio_local;

  const onToggleDownload = async () => {
    const clipId = selectedClip?.id;
    if (clipId == null || !selectedClip) return;
    try {
      if (isDownloaded) {
        await deleteAudio((selectedClip as any).audio_local);
        await db.clips.update(clipId, {
          audio_local: "",
          imagen_local: "",
          downloaded: 0,
        } as any);
        toast.success("Eliminado de descargas");
      } else {
        const ruta = await downloadAudio(
          `${baseURL}${selectedClip.audio}`,
          `audio_${clipId}`,
        );
        if (ruta) {
          await db.clips.update(clipId, {
            audio_local: ruta,
            imagen_local: selectedClip.imagen,
            downloaded: 1,
          } as any);
          toast.success("Descargado para offline");
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("No se pudo descargar el audio");
    }
  };

  const title = selectedClip?.titulo || "A cada segundo";
  const genre = selectedClip?.categoria?.categoria || "Pop";
  const coverUrl =
    status && selectedClip?.imagen
      ? `${baseURL}${selectedClip.imagen}`
      : "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500&auto=format&fit=crop&q=60";

  const handleStartPlaying = () => {
    setSubPhase("playing");
    setTimeout(() => {
      onPlay();
    }, 100);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  // Subphase 1: Intro (Pantalla 4)
  if (subPhase === "intro") {
    return (
      <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 shadow-soft animate-breathe">
            <Music className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-xl font-bold font-display text-foreground max-w-[280px] mb-3 leading-snug">
            Ahora deja que la música acompañe lo que acabas de trabajar.
          </h2>

          <p className="text-sm text-muted-foreground max-w-[240px]">
            Hemos elegido una canción especial para ti.
          </p>
        </div>

        <Button
          onClick={() => setSubPhase("selected")}
          className="w-full h-12 shrink-0 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Continuar
        </Button>
      </div>
    );
  }

  // Subphase 2: Selected Track Card (Pantalla 5)
  if (subPhase === "selected") {
    return (
      <div className="flex-1 flex flex-col justify-between px-6 py-6 overflow-y-auto">
        <div className="flex flex-col items-center text-center mt-2">
          <h2 className="text-base font-bold font-display text-foreground mb-6">
            Tu canción para hoy
          </h2>

          {/* Card */}
          <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-elevated mb-4 bg-muted group">
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleStartPlaying}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 text-teal-800 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </button>
          </div>

          {/* Title & Info */}
          <h3 className="text-lg font-bold font-display text-foreground mb-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mb-6">{genre} • 02:42</p>

          {/* Action icons: Favorito | Descargar | Compartir */}
          <div className="flex items-center justify-center gap-8 text-muted-foreground mb-4">
            <button
              onClick={onToggleLike}
              disabled={!selectedClip}
              className="flex flex-col items-center gap-1 text-[11px] hover:text-foreground disabled:opacity-40"
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isLiked ? "text-rose-500 fill-rose-500" : "",
                )}
              />
              <span>Favorito</span>
            </button>

            <button
              onClick={onToggleDownload}
              disabled={!selectedClip}
              className="flex flex-col items-center gap-1 text-[11px] hover:text-foreground disabled:opacity-40"
            >
              <Download
                className={cn("w-5 h-5", isDownloaded ? "text-primary" : "")}
              />
              <span>{isDownloaded ? "Descargado" : "Descargar"}</span>
            </button>

            <button
              onClick={() => selectedClip && onShareLink(selectedClip.id)}
              disabled={!selectedClip}
              className="flex flex-col items-center gap-1 text-[11px] hover:text-foreground disabled:opacity-40"
            >
              <Share2 className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        <Button
          onClick={handleStartPlaying}
          className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
        >
          Escuchar
        </Button>
      </div>
    );
  }

  // Subphase 3: Active Playing Screen with Vinyl turntable (Pantalla 6)
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 overflow-y-auto">
      <div className="flex flex-col items-center text-center mt-2">
        {/* Animated Vinyl Record */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <div
            className={cn(
              "w-60 h-60 rounded-full bg-zinc-900 shadow-2xl flex items-center justify-center p-3 border-4 border-zinc-800 transition-all",
              isPlaying ? "animate-spin [animation-duration:8s]" : "",
            )}
          >
            {/* Grooves */}
            <div className="w-full h-full rounded-full border-2 border-zinc-700/50 flex items-center justify-center p-8">
              <div className="w-full h-full rounded-full border border-zinc-600/40 flex items-center justify-center overflow-hidden">
                {/* Center album art */}
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-20 h-20 rounded-full object-cover shadow-inner"
                />
              </div>
            </div>
            {/* Center hole */}
            <div className="absolute w-4 h-4 rounded-full bg-zinc-950 border border-zinc-600" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-display text-foreground mb-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mb-6">{genre}</p>

        {/* Scrubber */}
        <div className="w-full max-w-xs mb-6">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(val) => onLoad(val)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{currentTime || "01:28"}</span>
            <span>{duration || "02:42"}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-8 w-full max-w-xs mb-4">
          <button className="text-muted-foreground hover:text-foreground active:scale-95">
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={onComplete}
            className="text-muted-foreground hover:text-foreground active:scale-95"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Button
        onClick={onComplete}
        className="w-full h-12 !rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-sm shadow-md"
      >
        Finalizar música
      </Button>

      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onUpdateBuffer}
        onEnded={onComplete}
      />
    </div>
  );
};
