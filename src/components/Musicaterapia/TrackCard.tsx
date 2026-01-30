import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Track } from "@/pages/Musicaterapia/Musicaterapia";
import {
    Check,
    Download,
    Heart,
    ListMinus,
    ListPlus,
    MoreVertical,
    Pause,
    Play,
    Share2
} from "lucide-react";
import { toast } from "sonner";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  onPlay: () => void;
  onToggleLike: () => void;
  onTogglePlaylist: () => void;
  onDownload: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const TrackCard = ({
  track,
  isPlaying,
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
}: TrackCardProps) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: track.title,
        text: `Escucha "${track.title}" de ${track.artist} en Mente 360`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden border-border/50 transition-all",
      isPlaying && "border-primary/50 bg-primary/5"
    )}>
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-3">
          {/* Cover & Play */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted">
              <img
                src={track.coverImage}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              size="icon"
              onClick={onPlay}
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
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm truncate">
              {track.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDuration(track.duration)}
              </span>
              {track.isDownloaded && (
                <Check className="w-3 h-3 text-success" />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLike}
              className="w-8 h-8"
            >
              <Heart 
                className={cn(
                  "w-4 h-4 transition-colors",
                  track.isLiked ? "fill-sos text-sos" : "text-muted-foreground"
                )} 
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onTogglePlaylist}>
                  {track.inMyPlaylist ? (
                    <>
                      <ListMinus className="w-4 h-4 mr-2" />
                      Quitar de mi playlist
                    </>
                  ) : (
                    <>
                      <ListPlus className="w-4 h-4 mr-2" />
                      Agregar a mi playlist
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  {track.isDownloaded ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-success" />
                      Descargado
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
