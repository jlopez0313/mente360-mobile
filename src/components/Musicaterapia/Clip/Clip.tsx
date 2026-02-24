import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatCount } from "@/helpers/Format";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import { Heart, Pause, Play, Share2, SkipBack, SkipForward, Star } from "lucide-react";

export const Clip = () => {
  const {
    audioRef,
    activeTrack, // In Clip, track is implicitly the globalTrack
    isPlaying,
    likesCount,
    hasLiked,
    inMyPlaylist,
    status,
    baseURL,
    AudioNoWifi,
    getAudioSrc,
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
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    globalPos,
    listAudios,
  } = useAudioPlayer(null); // Passing null implies this is the primary Global Player

  return (
    <>
      {/* Cover Image */}
      <div className="flex-1 flex items-center justify-center px-10 py-6">
        <div className="w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden shadow-glow">
          <img
            src={!status ? AudioNoWifi : baseURL + activeTrack?.imagen}
            alt={activeTrack?.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info & Actions */}
      <div className="px-6 pb-8 space-y-6">
        {/* Title & Actions */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-heading !font-bold text-foreground truncate !m-0">
              {activeTrack?.titulo}
            </h1>
            <p className="text-sm text-muted-foreground">{activeTrack?.categoria?.categoria}</p>
          </div>
          <div className="flex items-center gap-1">
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
            disabled={globalPos === 0}
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
            onClick={goToNext}
            disabled={globalPos === listAudios?.length - 1}
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
        onEnded={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToNext();
        }}
      />
    </>
  );
};
