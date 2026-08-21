import { IonScrollContext } from "@/components/layout";
import { db } from "@/hooks/useDexie";
import { setListAudios } from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { forwardRef, memo, useContext } from "react";
import { useDispatch } from "react-redux";
import { Virtuoso } from 'react-virtuoso';
import { AudioCard } from "./AudioCard";

interface TrackListProps {
  selectedCategory: number | undefined;
  searchQuery: string;
}

export const TrackList = memo(({
  selectedCategory,
  searchQuery,
}: TrackListProps) => {

  const dispatch = useDispatch();
  const scrollElement = useContext(IonScrollContext);

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
    <div className="pb-24">
      <Virtuoso
        key={`${selectedCategory}-${searchQuery}`}
        customScrollParent={scrollElement ?? undefined}
        components={{
          List: forwardRef((props, ref) => (
            <div
              {...props}
              ref={ref}
              className="space-y-3 p-1"
            />
          )),
        }}
        totalCount={tracks.length}
        itemContent={(index) => {
          const track = tracks[index];

          return (
            <AudioCard
              idx={index}
              key={track.id}
              track={track}
            />
          );
        }}
      />
    </div>
  );
});
