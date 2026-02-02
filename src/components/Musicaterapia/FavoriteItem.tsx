import { Button } from "@/components/ui/button";
import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import { cn } from "@/lib/utils";
import {
  Check,
  Download,
  Heart,
  ListMinus,
  ListPlus,
  MoreVertical,
  Share2,
} from "lucide-react";
import { useContext } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TrackCardProps {
  track: Clips;
  isPlaying: boolean;
  currentTrackId: number | undefined;
  onPlay: () => void;
  onToggleLike: () => void;
  onTogglePlaylist: () => void;
  onDownload: () => void;
}

export const FavoriteItem = ({
  track,
  currentTrackId,
  onToggleLike,
  onPlay,
  onTogglePlaylist,
  onDownload,
}: TrackCardProps) => {
  const { baseURL, status, AudioNoWifi } = useContext(NetworkContext);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: track.titulo,
        text: `Escucha "${track.titulo}" de la categoría ${
          track.categoria?.categoria
        } en ${import.meta.env.VITE_NAME}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <div
      key={track.id}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl transition-all",
        "bg-card border border-border hover:border-primary/30",
        currentTrackId === track.id && "border-primary bg-primary/5"
      )}
    >
      <button
        onClick={onPlay}
        className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
      >
        <img
          src={status ? baseURL + track.imagen : AudioNoWifi}
          alt={track.titulo}
          className="w-full h-full object-cover"
        />
        {currentTrackId === track.id && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </button>

      <div className="flex-1 min-w-0" onClick={onPlay}>
        <h4 className="font-medium text-foreground truncate">{track.titulo}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {track.categoria?.categoria}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.floor(track.duration / 60)}:
          {String(track.duration % 60).padStart(2, "0")}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleLike}
          className="w-8 h-8"
        >
          <Heart className="w-5 h-5 text-sos fill-sos" />
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
                  Quitar de favoritos
                </>
              ) : (
                <>
                  <ListPlus className="w-4 h-4 mr-2" />
                  Agregar a favoritos
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
  );
};
