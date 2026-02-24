import Playlist from "@/database/playlist";
import { db } from "@/hooks/useDexie";
import { setListAudios } from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { Heart } from "lucide-react";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
import { AudioCard } from "./AudioCard";

interface FavoritesListProps {
  searchQuery: string;
  currentTrackId?: number;
}

export function FavoritesList({
  searchQuery,
  currentTrackId,
}: FavoritesListProps) {

  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);

  const playlist = useLiveQuery(async () => {
    let collection = db.playlist.where("users_id").equals(user.id);

    if (searchQuery) {
      collection = collection.filter((c: Playlist) =>
        c.clip.titulo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const lista = await collection.toArray();
    dispatch(setListAudios([...lista]));

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

  return (
    <div className="h-full pb-24 space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {playlist?.length} {playlist?.length === 1 ? "audio" : "audios"} en
        favoritos
      </p>

      <Virtuoso
        key={searchQuery}
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
        totalCount={playlist.length}
        itemContent={(index) => {
          const track = playlist[index].clip;

          return (
            <AudioCard
              idx={index}
              key={track.id}
              track={track}
              isPlaying={track.id === currentTrackId}
            />
          );
        }}
      />
    </div>
  );
}
