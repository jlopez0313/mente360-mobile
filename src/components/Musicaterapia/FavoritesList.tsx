import { cn } from "@/lib/utils";
import { Track } from "@/pages/Musicaterapia/Musicaterapia";
import { Heart } from "lucide-react";

interface FavoritesListProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  currentTrackId?: string;
}

export function FavoritesList({ 
  tracks, 
  onPlay, 
  onToggleLike,
  currentTrackId 
}: FavoritesListProps) {
  const favoriteTracks = tracks.filter(t => t.isLiked);

  if (favoriteTracks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">
          Sin favoritos aún
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Marca audios como favoritos tocando el corazón para verlos aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        {favoriteTracks.length} {favoriteTracks.length === 1 ? 'audio' : 'audios'} en favoritos
      </p>
      
      {favoriteTracks.map((track) => (
        <div
          key={track.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all",
            "bg-card border border-border hover:border-primary/30",
            currentTrackId === track.id && "border-primary bg-primary/5"
          )}
        >
          <button
            onClick={() => onPlay(track)}
            className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
          >
            <img
              src={track.coverImage}
              alt={track.title}
              className="w-full h-full object-cover"
            />
            {currentTrackId === track.id && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </button>

          <div className="flex-1 min-w-0" onClick={() => onPlay(track)}>
            <h4 className="font-medium text-foreground truncate">
              {track.title}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {track.artist}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, "0")}
            </p>
          </div>

          <button
            onClick={() => onToggleLike(track.id)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Heart
              className="w-5 h-5 text-sos fill-sos"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
