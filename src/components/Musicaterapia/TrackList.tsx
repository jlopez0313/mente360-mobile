import { db } from "@/hooks/useDexie";
import { setListAudios } from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { Virtuoso } from 'react-virtuoso';
import { AudioCard } from "./AudioCard";

interface TrackListProps {
  selectedCategory: number | undefined;
  searchQuery: string;
  currentTrackId?: number;
}

export const TrackList = ({
  selectedCategory,
  searchQuery,
  currentTrackId,
}: TrackListProps) => {

  const dispatch = useDispatch();

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

    const lista = await collection.toArray();
    dispatch(setListAudios([...lista]));

    return lista;
  }, [selectedCategory, searchQuery]);
  

  if (!tracks || tracks?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron canciones</p>
      </div>
    );
  }

  return (
    <div className="h-full pb-24 space-y-3">
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
};
