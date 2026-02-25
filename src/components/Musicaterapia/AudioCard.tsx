import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Clips from "@/database/clips";
import { formatCount } from "@/helpers/Format";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { cn } from "@/lib/utils";
import {
  Check,
  Download,
  Heart,
  MoreVertical,
  Pause,
  Play,
  Share2,
  Star,
} from "lucide-react";
import MusicBar from "../Shared/MusicBar/MusicBar";

interface AudioCardProps {
  idx: number;
  track: Clips;
  isPlaying: boolean;
}

export const AudioCard = ({ idx, track }: AudioCardProps) => {
  const {
    audioRef,
    activeTrack,
    isPlaying,
    likesCount,
    hasLiked,
    inMyPlaylist,
    status,
    baseURL,
    AudioNoWifi,
    getAudioSrc,
    duration,
    onToggleLike,
    handleTogglePlaylist,
    onShareLink,
    onToggleDownload,
    onTogglePlay,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
  } = useAudioPlayer(track, idx);

  // Checks if this card is currently active in global playback to show background highlight
  const isGlobalActive = isPlaying || activeTrack?.id === track.id;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/50 transition-all",
        isGlobalActive && "border-primary/50 bg-primary/5"
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-3">
          {/* Cover & Play */}
          <div className="relative shrink-0" onClick={onTogglePlay}>
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted">
              <img
                src={status ? baseURL + track.imagen : AudioNoWifi}
                alt={track.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              size="icon"
              className={cn(
                "absolute inset-0 m-auto w-8 h-8 rounded-full shadow-medium",
                isPlaying
                  ? "bg-primary/90 hover:bg-primary"
                  : "bg-foreground/80 hover:bg-foreground"
              )}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 text-primary-foreground" />
              ) : (
                <Play className="w-3.5 h-3.5 text-background ml-0.5" />
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0" onClick={onTogglePlay}>
            <div className="flex gap-1 items-end">
              {isGlobalActive && (
                <MusicBar paused={!isPlaying} />
              )}{" "}
              <h6 className="!m-0 font-semibold text-foreground truncate">
                {track.titulo}
              </h6>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {track.categoria?.categoria}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{duration}</span>
              {track.audio_local && <Check className="w-3 h-3 text-success" />}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLike}
              className="w-8 h-8 gap-1"
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  hasLiked ? "fill-sos text-sos" : "text-muted-foreground"
                )}
              />
              {likesCount > 0 && formatCount(likesCount)}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleTogglePlaylist}>
                  {inMyPlaylist ? (
                    <>
                      <Star className="w-4 h-4 mr-2 fill-yellow-500 text-yellow-500" />
                      Quitar de favoritos
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Agregar a favoritos
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShareLink(track.id)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleDownload('clips')}>
                  {track.audio_local ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-success" />
                      Eliminar Descarga
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar offline
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
