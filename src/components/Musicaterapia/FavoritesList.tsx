import Clips from "@/database/clips";
import Playlist from "@/database/playlist";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { FavoriteItem } from "./FavoriteItem";

interface FavoritesListProps {
  selectedCategory: number | undefined;
  searchQuery: string;
  page: number;
  setHasMore: (value: boolean) => void;
  tracks: Clips[] | undefined;
  onPlay: (track: Clips | undefined) => void;
  onDownload: (trackId: number | undefined) => void;
  onTogglePlaylist: (trackId: number | undefined) => void;
  onToggleLike: (trackId: number | undefined) => void;
  currentTrackId?: number;
}

export function FavoritesList({
  selectedCategory,
  searchQuery,
  page,
  setHasMore,
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
  currentTrackId,
}: FavoritesListProps) {
  const { user } = useSelector((state: any) => state.user);

  const playlist = useLiveQuery(async () => {
    const resultados = await db.playlist
      .where("users_id")
      .equals(user.id)
      .toArray()
      .then((resultados: Playlist[]) =>
        resultados.filter(
          (c) =>
            c?.clip &&
            c.clip.titulo.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      .then((lista: Playlist[]) => {
        const results = lista
          .filter((item) => item?.clip)
          .map((item: any) => {
            return item.clip;
          })
          .sort((a, b) => a?.titulo.localeCompare(b?.titulo));
        return results;
      });

    const limit = page * 10;
    const paginados = resultados.slice(0, limit);

    setHasMore(paginados.length < resultados.length);

    // dispatch(setListAudios([...paginados]));

    return paginados;
  }, [selectedCategory, page, searchQuery]);

  if (playlist?.length === 0) {
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
        {playlist?.length} {playlist?.length === 1 ? "audio" : "audios"} en
        favoritos
      </p>

      {playlist?.map((track) => (
        <FavoriteItem
          key={track.id}
          track={track}
          currentTrackId={currentTrackId}
          isPlaying={track.id === currentTrackId}
          onPlay={() => onPlay(track)}
          onToggleLike={() => onToggleLike(track.id)}
          onTogglePlaylist={() => onTogglePlaylist(track.id)}
          onDownload={() => onDownload(track.id)}
        />
      ))}
    </div>
  );
}
