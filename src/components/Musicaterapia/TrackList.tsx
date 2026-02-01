import Clips from "@/database/clips";
import { TrackCard } from "./TrackCard";

interface TrackListProps {
  tracks: Clips[] | undefined;
  onPlay: (track: Clips | undefined) => void;
  onToggleLike: (trackId: number | undefined) => void;
  onTogglePlaylist: (trackId: number | undefined) => void;
  onDownload: (trackId: number | undefined) => void;
  currentTrackId?: number;
}

export const TrackList = ({
  tracks,
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
  currentTrackId,
}: TrackListProps) => {
  if (tracks?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron canciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tracks?.map((track) => (
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
