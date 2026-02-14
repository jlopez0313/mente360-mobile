import Clips from "@/database/clips";
import Playlist from "@/database/playlist";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Heart } from "lucide-react";
import { forwardRef } from "react";
import { useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
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
  onPlay,
  onToggleLike,
  onTogglePlaylist,
  onDownload,
  currentTrackId,
}: FavoritesListProps) {
  const { user } = useSelector((state: any) => state.user);

  const playlist = useLiveQuery(async () => {
    let collection = db.playlist.where("users_id").equals(user.id);

    if (searchQuery) {
      collection = collection.filter((c: Playlist) =>
        c.clip.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return await collection.toArray();
  }, [user?.id, searchQuery]);

  if (!playlist || playlist?.length === 0) {
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

  console.log( playlist )

  return (
    <div className="h-[calc(100vh-370px)] space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {playlist?.length} {playlist?.length === 1 ? "audio" : "audios"} en
        favoritos
      </p>

      <Virtuoso
        key={`${searchQuery}`}
        components={{
          List: forwardRef((props, ref) => (
            <div {...props} ref={ref} className="space-y-3 p-1" />
          )),
        }}
        style={{ height: "100%" }}
        totalCount={playlist.length}
        itemContent={(index) => {
          const track = playlist[index].clip;
          return (
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
          );
        }}
      />
    </div>
  );
}
