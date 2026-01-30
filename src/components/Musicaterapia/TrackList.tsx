import type { Track } from "@/pages/Musicaterapia/Musicaterapia";
import { TrackCard } from "./TrackCard";

interface TrackListProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onTogglePlaylist: (trackId: string) => void;
  onDownload: (trackId: string) => void;
  currentTrackId?: string;
}

export const TrackList = ({
  tracks,
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
  currentTrackId,
}: TrackListProps) => {
  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron canciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          isPlaying={track.id === currentTrackId}
          onPlay={() => onPlay(track)}
          onToggleLike={() => onToggleLike(track.id)}
          onTogglePlaylist={() => onTogglePlaylist(track.id)}
          onDownload={() => onDownload(track.id)}
        />
      ))}
    </div>
  );
};
