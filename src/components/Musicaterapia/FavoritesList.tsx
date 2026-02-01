import Clips from "@/database/clips";
import { Heart } from "lucide-react";
import { FavoriteItem } from "./FavoriteItem";

interface FavoritesListProps {
  tracks: Clips[] | undefined;
  onPlay: (track: Clips | undefined) => void;
  onToggleLike: (trackId: number | undefined) => void;
  currentTrackId?: number;
}

export function FavoritesList({ 
  tracks, 
  onPlay, 
  onToggleLike,
  currentTrackId 
}: FavoritesListProps) {
  const favoriteTracks = tracks?.filter(t => t.isLiked);

  if (favoriteTracks?.length === 0) {
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
        {favoriteTracks?.length} {favoriteTracks?.length === 1 ? 'audio' : 'audios'} en favoritos
      </p>
      
      {favoriteTracks?.map((track) => (
        <FavoriteItem
          key={track.id}
          track={track}
          currentTrackId={currentTrackId}
          isPlaying={track.id === currentTrackId}
          onPlay={() => onPlay(track)}
          onToggleLike={() => onToggleLike(track.id)}
        />
      ))}
    </div>
  );
}
