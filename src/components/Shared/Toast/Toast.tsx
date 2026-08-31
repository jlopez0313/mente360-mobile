import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import { startBackground } from "@/helpers/background";
import { create, destroy, updateTrack } from "@/helpers/musicControls";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { cn } from "@/lib/utils";
import {
  selectAudioSrc,
  selectGlobalAudio,
  selectIsGlobalPlaying,
  selectListAudios,
  selectShowGlobalAudio,
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setIsGlobalPlaying,
  setListAudios
} from "@/store/slices/audioSlice";
import { Pause, Play, SkipBack, SkipForward, Star, X } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export const Toast = () => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);
  const history = useHistory();

  const dispatch = useDispatch();
  const audioSrc = useSelector(selectAudioSrc);
  const globalAudio = useSelector(selectGlobalAudio);
  const listAudios = useSelector(selectListAudios);
  const isGlobalPlaying = useSelector(selectIsGlobalPlaying);
  const showGlobalAudio = useSelector(selectShowGlobalAudio);

  const audioRef: any = useRef();
  const hasCreatedControls = useRef(false);

  // ──────────────────────────────────────────────────────────────────
  // Refs always pointing to the LATEST values so callbacks never go stale
  // ──────────────────────────────────────────────────────────────────
  const globalAudioRef = useRef(globalAudio);
  const listAudiosRef = useRef(listAudios);
  const isGlobalPlayingRef = useRef(isGlobalPlaying);
  const currentBlobUrl = useRef<string | null>(null);

  globalAudioRef.current = globalAudio;
  listAudiosRef.current = listAudios;
  isGlobalPlayingRef.current = isGlobalPlaying;

  const onConfirmRef = useRef(() => { });

  const {
    real_duration,
    progress,
    buffer,
    onPlay,
    onPause,
    onLoad,
    onTimeUpdate,
    onLoadedMetadata: baseOnLoadedMetadata,
    onUpdateBuffer,
    getDownloadedAudio,
    onTogglePlaylist,
    onEnd,
    onError,
  } = useAudio(audioRef, () => onConfirmRef.current(), { isGlobalControllable: true, needsProgress: true });

  const onUpdateElapsed = () => {
    onTimeUpdate();
  };

  const onClear = () => {
    onPause();
    dispatch(setIsGlobalPlaying(false));
    dispatch(setGlobalPos(0));
    dispatch(setGlobalAudio(null));
    hasCreatedControls.current = false;
    destroy();
  };

  const onTogglePlay = () => {
    if (isGlobalPlayingRef.current) {
      onPause();
      dispatch(setIsGlobalPlaying(false));
    } else {
      onPlay();
      dispatch(setIsGlobalPlaying(true));
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // Always reads from refs → never stale
  // ──────────────────────────────────────────────────────────────────
  // Si la cola de Redux quedó vacía (p. ej. la lista se desmontó o un resync
  // de clips la limpió), la reconstruimos con los clips de la misma categoría
  // del track actual, para que el auto-avance nunca se quede sin lista.
  const resolveQueue = async (): Promise<Clips[]> => {
    const audios = listAudiosRef.current;
    if (audios && audios.length > 0) return audios;

    const current = globalAudioRef.current;
    const catId = (current as any)?.categoria?.id;
    if (!catId) return [];

    const rebuilt = await db.clips
      .orderBy("titulo")
      .filter((c: any) => c.categoria?.id === catId)
      .toArray();

    if (rebuilt.length) dispatch(setListAudios(rebuilt));
    return rebuilt;
  };

  const goToPrev = async () => {
    const audios = await resolveQueue();
    const current = globalAudioRef.current;
    if (!audios || audios.length === 0) return;
    const currentIdx = audios.findIndex((a: Clips) => a.id === current?.id);
    const prevIdx = currentIdx <= 0 ? audios.length - 1 : currentIdx - 1;
    const prev = audios[prevIdx];
    if (prev) await handleNextPrev(prevIdx, prev);
  };

  const goToNext = async () => {
    const audios = await resolveQueue();
    const current = globalAudioRef.current;
    if (!audios || audios.length === 0) return;
    const currentIdx = audios.findIndex((a: Clips) => a.id === current?.id);
    const nextIdx = (currentIdx === -1 || currentIdx === audios.length - 1) ? 0 : currentIdx + 1;
    const next = audios[nextIdx];
    if (next) await handleNextPrev(nextIdx, next);
  };

  const handleNextPrev = async (index: number, track: Clips) => {
    onPause();

    if (track.audio_local) {
      const audioBlob = await getDownloadedAudio(track.audio_local);

      // Cleanup previous blob URL to prevent memory leaks
      if (currentBlobUrl.current && currentBlobUrl.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobUrl.current);
      }
      currentBlobUrl.current = audioBlob;
      dispatch(setAudioSrc(audioBlob));
    } else {
      // Cleanup previous blob URL even if switching to a remote URL
      if (currentBlobUrl.current && currentBlobUrl.current.startsWith('blob:')) {
        URL.revokeObjectURL(currentBlobUrl.current);
        currentBlobUrl.current = null;
      }
      dispatch(setAudioSrc(baseURL + track.audio));
    }

    // El load() lo dispara el efecto "Source Change detection" de useAudio con
    // el src YA aplicado al DOM. Llamarlo aquí corría sobre el src viejo (aún
    // sin re-render) y solo servía para abortar la carga siguiente.

    dispatch(setGlobalPos(index));
    dispatch(setGlobalAudio(track));
    dispatch(setIsGlobalPlaying(true));

    // Update background notification info immediately, but marked as paused (loading)
    updateTrack(baseURL, track, 0, false);
  };

  const handleTogglePlaylist = async () => {
    const ga = globalAudioRef.current;
    const playlistToggled = await onTogglePlaylist(ga, ga?.inMyPlaylist);
    if (!ga?.inMyPlaylist) {
      dispatch(setGlobalAudio({ ...ga, inMyPlaylist: playlistToggled }));
    } else {
      dispatch(setGlobalAudio({ ...ga, inMyPlaylist: null }));
    }
  };



  // ──────────────────────────────────────────────────────────────────
  // Stable refs for background callbacks — these NEVER change identity,
  // so the listeners registered in create() always call the latest handler
  // ──────────────────────────────────────────────────────────────────
  const stableGoToPrevRef = useRef(async () => { await goToPrev(); });
  const stableGoToNextRef = useRef(async () => { await goToNext(); });
  const stableBgPlayRef = useRef(() => { dispatch(setIsGlobalPlaying(true)); onPlay(); });
  const stableBgPauseRef = useRef(() => { dispatch(setIsGlobalPlaying(false)); onPause(); });

  // Keep the stable refs pointing to the latest implementations
  stableGoToPrevRef.current = async () => { await goToPrev(); };
  stableGoToNextRef.current = async () => { await goToNext(); };
  stableBgPlayRef.current = () => { dispatch(setIsGlobalPlaying(true)); onPlay(); };
  stableBgPauseRef.current = () => { dispatch(setIsGlobalPlaying(false)); onPause(); };

  const stableGoToPrev = useRef(() => stableGoToPrevRef.current()).current;
  const stableGoToNext = useRef(() => stableGoToNextRef.current()).current;
  const stableBgPlay = useRef(() => stableBgPlayRef.current()).current;
  const stableBgPause = useRef(() => stableBgPauseRef.current()).current;

  // Break circular dependency: Link useAudio's confirm callback to the actual stableGoToNext
  onConfirmRef.current = stableGoToNext;

  // Seek: background sends a percentage (0-100), onLoad sets audio.currentTime accordingly
  const stableOnSeekRef = useRef((pct: number) => { onLoad(pct); });
  stableOnSeekRef.current = (pct: number) => { onLoad(pct); };
  const stableOnSeek = useRef((pct: number) => stableOnSeekRef.current(pct)).current;





  // ──────────────────────────────────────────────────────────────────
  // Create/update background music controls once real_duration is known
  // ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!real_duration) return;

    startBackground();

    if (!hasCreatedControls.current) {
      hasCreatedControls.current = true;
      create(
        baseURL,
        globalAudioRef.current,
        real_duration,
        stableBgPlay,
        stableBgPause,
        stableGoToPrev,
        stableGoToNext,
        stableOnSeek
      );
    } else {
      updateTrack(baseURL, globalAudioRef.current, real_duration, isGlobalPlayingRef.current);
      // Removed toggle(true, 0) because onPlay() will handle toggling upon successful playback.
    }
  }, [real_duration, globalAudio?.id]);

  return (
    <div
      className={cn(
        "fixed bottom-24 left-0 right-0 z-40 px-2",
        !showGlobalAudio && "hidden"
      )}
    >
      <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl  shadow-md overflow-hidden">
        <div className="flex items-center gap-3 p-3">
          {/* Cover */}
          <div
            className="w-12 h-12 rounded-xl overflow-hidden bg-muted cursor-pointer shrink-0"
            onClick={() => history.replace('/musicaterapia/clip')}
          >
            <img
              src={!status ? AudioNoWifi : baseURL + globalAudio?.imagen}
              alt={globalAudio?.titulo}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => history.replace('/musicaterapia/clip')}
          >
            <h6 className="!m-0 font-medium text-foreground text-sm truncate">
              {globalAudio?.titulo}
            </h6>
            <p className="text-xs text-muted-foreground truncate">
              {globalAudio?.categoria?.categoria}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={handleTogglePlaylist}
            >
              <Star
                className={cn(
                  "w-4 h-4 transition-colors",
                  globalAudio?.inMyPlaylist
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-muted-foreground"
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              className="w-8 h-8"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePlay}
              className="w-10 h-10"
            >
              {isGlobalPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="w-8 h-8"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="w-8 h-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-2">
          <Progress
            buffer={buffer * 100}
            value={progress}
            className="h-1 rounded-none"
          />
        </div>
      </div>

      <audio
        // controls
        ref={audioRef}
        onLoadedMetadata={baseOnLoadedMetadata}
        onTimeUpdate={onUpdateElapsed}
        onProgress={onUpdateBuffer}
        onEnded={onEnd}
        onError={onError}
        src={audioSrc}
      />
    </div>
  );
};
