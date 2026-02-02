import Clips from "@/database/clips";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { TrackCard } from "./TrackCard";

interface TrackListProps {
  selectedCategory: number | undefined;
  searchQuery: string;
  page: number;
  setHasMore: (value: boolean) => void;
  onPlay: (track: Clips | undefined) => void;
  onToggleLike: (trackId: number | undefined) => void;
  onTogglePlaylist: (trackId: number | undefined) => void;
  onDownload: (trackId: number | undefined) => void;
  currentTrackId?: number;
}

export const TrackList = ({
  selectedCategory,
  searchQuery,
  page,
  setHasMore,
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
  currentTrackId,
}: TrackListProps) => {
  const tracks = useLiveQuery(async () => {
    const resultados = await db.clips
      .orderBy("titulo")
      .toArray()
      .then((resultados: Clips[]) =>
        resultados.filter((c) =>
          c.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .then((resultados: Clips[]) => {
        if (selectedCategory != undefined) {
          return resultados.filter(
            (r: any) => r.categoria?.id == Number(selectedCategory)
          );
        }
        return resultados;
      });

    const limit = page * 10;
    const paginados = resultados.slice(0, limit);

    setHasMore(paginados.length < resultados.length);

    // dispatch(setListAudios([...paginados]));

    return paginados;
  }, [selectedCategory, page, searchQuery]);

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
