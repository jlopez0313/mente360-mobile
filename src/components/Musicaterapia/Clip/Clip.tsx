import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatCount } from "@/helpers/Format";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import { Heart, Pause, Play, Share2, SkipBack, SkipForward, Star } from "lucide-react";

export const Clip = () => {
  const {
    activeTrack, // In Clip, track is implicitly the globalTrack
    isPlaying,
    likesCount,
    hasLiked,
    inMyPlaylist,
    status,
    baseURL,
    AudioNoWifi,
    progress,
    duration,
    currentTime,
    buffer,
    onToggleLike,
    handleTogglePlaylist,
    onShareLink,
    onTogglePlay,
    goToPrev,
    goToNext,
    listAudios,
  } = useAudioPlayer(null); // Passing null implies this is the primary Global Player

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

      {/* Info & Actions */}
      <div className="px-6 pb-8 space-y-6">
        {/* Title & Actions */}

        <div className="space-y-3 flex flex-col justify-center gap-3">
          <h4 className="text-center text-xl font-heading !font-bold text-foreground !m-0">
            {activeTrack?.titulo}
          </h4>
          <p className="text-center text-sm text-muted-foreground">{activeTrack?.categoria?.categoria}</p>
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="gap-1"
              onClick={onToggleLike}
            >
              <Heart className={cn("w-5 h-5 text-muted-foreground",
                hasLiked ? "fill-sos text-sos" : "text-muted-foreground"
              )} />
              {likesCount > 0 && formatCount(likesCount)}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTogglePlaylist}
            >
              <Star
                className={cn(
                  "w-5 h-5",
                  inMyPlaylist ? "fill-sos text-sos" : "text-muted-foreground"
                )}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onShareLink(activeTrack?.id)}>
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            buffer={buffer}
            onValueChange={() => { }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            disabled={listAudios?.length <= 1}
            className="w-12 h-12"
          >
            <SkipBack className="w-6 h-6 text-foreground" />
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
            onClick={goToNext}
            disabled={listAudios?.length <= 1}
            className="w-12 h-12"
          >
            <SkipForward className="w-6 h-6 text-foreground" />
          </Button>
        </div>
      </div>
    </>
  );
};
