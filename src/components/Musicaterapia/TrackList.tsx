import Clips from "@/database/clips";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { forwardRef } from "react";
import { Virtuoso } from 'react-virtuoso';
import { TrackCard } from "./TrackCard";

interface TrackListProps {
  selectedCategory: number | undefined;
  searchQuery: string;
  onPlay: (track: Clips | undefined) => void;
  onToggleLike: (trackId: number | undefined) => void;
  onTogglePlaylist: (trackId: number | undefined) => void;
  onDownload: (trackId: number | undefined) => void;
  currentTrackId?: number;
}

export const TrackList = ({
  selectedCategory,
  searchQuery,
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
  currentTrackId,
}: TrackListProps) => {

  const tracks = useLiveQuery(async () => {
    let collection = db.clips.orderBy("titulo");

    if (selectedCategory !== undefined) {
      collection = collection.filter(
        (c: any) => c.categoria?.id === Number(selectedCategory)
      );
    }

    if (searchQuery) {
      collection = collection.filter((c: any) =>
        c.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return await collection.toArray();
  }, [selectedCategory, searchQuery]);

  if (!tracks || tracks?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron canciones</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-370px)] space-y-3">
      <Virtuoso
        key={`${selectedCategory}-${searchQuery}`}
        components={{
          List: forwardRef((props, ref) => (
            <div
              {...props}
              ref={ref}
              className="space-y-3 p-1"
            />
          )),
        }}
        style={{ height: "100%" }}
        totalCount={tracks.length}
        itemContent={(index) => {
          const track = tracks[index];

          return (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={track.id === currentTrackId}
              onPlay={() => onPlay(track)}
              onToggleLike={() => onToggleLike(track.id)}
              onTogglePlaylist={() => onTogglePlaylist(track.id)}
              onDownload={() => onDownload(track.id)}
            />
          );
        }}
      />
    </div>
  );
};
