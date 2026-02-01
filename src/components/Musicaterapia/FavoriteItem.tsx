import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useContext } from "react";

interface TrackCardProps {
  track: Clips;
  isPlaying: boolean;
  currentTrackId: number | undefined;
  onPlay: () => void;
  onToggleLike: () => void;
}

export const FavoriteItem = ({track, currentTrackId, onToggleLike, onPlay}: TrackCardProps) => {
  const {baseURL, status} = useContext(NetworkContext);

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
        <h4 className="font-medium text-foreground truncate">
          {track.titulo}
        </h4>
        <p className="text-sm text-muted-foreground truncate">
          {track.categoria?.categoria}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.floor(track.duration / 60)}:
          {String(track.duration % 60).padStart(2, "0")}
        </p>
      </div>

      <button
        onClick={onToggleLike}
        className="p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Heart className="w-5 h-5 text-sos fill-sos" />
      </button>
    </div>
  );
};
