import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import { startBackground } from "@/helpers/background";
import { create, destroy, updateElapsed } from "@/helpers/musicControls";
import { useAudio } from "@/hooks/useAudio";
import { cn } from "@/lib/utils";
import {
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";
import { Pause, Play, SkipBack, SkipForward, Star, X } from "lucide-react";
import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export const Toast = () => {
  const { AudioNoWifi, baseURL, status } = useContext(NetworkContext);
  const history = useHistory();

  const dispatch = useDispatch();
  const { audioSrc, globalAudio, listAudios, globalPos, isGlobalPlaying } =
    useSelector((state: any) => state.audio);

  const audioRef: any = useRef();
  const {
    real_duration,
    progress,
    buffer,
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
    onUpdateBuffer,
    getDownloadedAudio,
    onTogglePlaylist,
  } = useAudio(audioRef, () => { });

  const onUpdateElapsed = () => {
    onTimeUpdate();
    updateElapsed(audioRef.current?.currentTime);
  };

  const onClear = () => {
    destroy();
    onPause();
    dispatch(setGlobalPos(0));
    dispatch(setGlobalAudio(null));
  };

  const onTogglePlay = () => {
    if (isGlobalPlaying) {
      onPause();
      dispatch(setIsGlobalPlaying(false));
    } else {
      onPlay();
      dispatch(setIsGlobalPlaying(true));
    }
  };

  const goToPrev = async () => {
    const prevIdx = (globalPos - 1 + listAudios.length) % listAudios.length;
    const prev = listAudios[prevIdx];

    handleNextPrev(prevIdx, prev);
  };

  const goToNext = async () => {
    const nextIdx = (globalPos + 1) % listAudios.length;
    const next = listAudios[nextIdx];

    handleNextPrev(nextIdx, next);
  };

  const handleNextPrev = async (index: number, track: Clips) => {
    if (track.audio_local) {
      const audioBlob = await getDownloadedAudio(track.audio_local);
      dispatch(setAudioSrc(audioBlob));
    } else {
      dispatch(setAudioSrc(baseURL + track.audio));
    }

    dispatch(setGlobalPos(index));
    dispatch(setGlobalAudio(track));
    dispatch(setIsGlobalPlaying(true));
  };

  const handleTogglePlaylist = async () => {
    const playlistToggled = await onTogglePlaylist(globalAudio, globalAudio?.inMyPlaylist);
    console.log(globalAudio, playlistToggled)

    if (!globalAudio?.inMyPlaylist) {
      dispatch(setGlobalAudio({ ...globalAudio, inMyPlaylist: playlistToggled }));
    } else {
      dispatch(setGlobalAudio({ ...globalAudio, inMyPlaylist: null }));
    }
  };

  useEffect(() => {
    onPause();
    onPlay();
  }, [globalAudio]);

  useEffect(() => {
    if (real_duration) {
      startBackground();
      create(
        baseURL,
        globalAudio,
        real_duration,
        onPlay,
        onPause,
        goToPrev,
        goToNext
      );
    }
  }, [real_duration]);

  useEffect(() => {
    if (isGlobalPlaying) {
      onPlay();
    } else {
      onPause();
    }
  }, [isGlobalPlaying]);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 px-2">
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
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onUpdateElapsed}
        onProgress={onUpdateBuffer}
        onEnded={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToNext();
        }}
        src={audioSrc}
      />
    </div>
  );
};
