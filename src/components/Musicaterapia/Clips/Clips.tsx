import {
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import styles from "../Musicaterapia.module.scss";

import { useEffect, useState } from "react";

import { clearListAudios } from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

// import ClipsDB from "@/database/clips";

import { useDB } from "@/context/Context";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { useLiveQuery } from "dexie-react-hooks";

export const Clips = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const { sqlite } = useDB();
  const network = useNetwork();

  const { globalAudio, listAudios } = useSelector((state: any) => state.audio);

  const [categoria, setCategoria] = useState("All");
  const [chip, setChip] = useState<string>("0");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);

  const categorias = useLiveQuery(() => db.categorias.toArray());

  const clips = useLiveQuery(async () => {
    const resultados = await db.clips
      .orderBy("titulo")
      .toArray()
      .then((resultados) =>
        resultados.filter((c) =>
          c.titulo.toLowerCase().includes(search.toLowerCase())
        )
      )
      .then((resultados) => {
        if (chip != "0") {
          return resultados.filter((r: any) => r.categoria?.id == Number(chip));
        }
        return resultados;
      });

    const limit = page * 10;
    const paginados = resultados.slice(0, limit);

    setHasMore(paginados.length < resultados.length);
    return paginados;
  }, [chip, page, search]);

  const onSetPage = (evt: any, page: any) => {
    if (hasMore) setPage(page);
    else evt.target.complete();
  };

  const onUpdateList = () => {
    const tmpClips = clips?.map((item: any) => {
      return item.id == globalAudio.id ? globalAudio : item;
    });

    // setClips([...tmpClips]);
  };

  const handleChipChange = (id: string) => {
    dispatch(clearListAudios());
    setHasMore(true);

    if (id == "0") {
      setCategoria("All");
    } else {
      setCategoria(
        categorias?.find((item: any) => item.id == id)?.categoria ?? "All"
      );
    }

    setChip(id);
    setSearch("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    dispatch(clearListAudios());
    setHasMore(true);
    setSearch(value);

    if (value !== "") {
      setPage(1);
    }
  };

  const onSetClips = (idx: number, item: any) => {
    /*
    const lista = [...clips];
    lista[idx] = {...item}

    dispatch(setListAudios([...lista]))
    */
  };

  useEffect(() => {
    if (sqlite.initialized) {
      globalAudio && onUpdateList();
    }
  }, [sqlite.initialized, globalAudio]);

  useEffect(() => {
    //setClips([...listAudios]);
  }, [listAudios]);

  return (
    <>
      <div className={styles["ion-content"]}>
        <div className={`ion-margin-bottom ${styles.chips}`}>
          <div className={styles["chip-list"]}>
            <IonChip
              onClick={() => handleChipChange("0")}
              className={categoria == "All" ? styles.checked : ""}
            >
              {" "}
              All{" "}
            </IonChip>
            {categorias?.map((item: any, idx: any) => {
              return (
                <IonChip
                  key={idx}
                  onClick={() => handleChipChange(item.id)}
                  className={categoria == item.categoria ? styles.checked : ""}
                >
                  {" "}
                  {item.categoria}{" "}
                </IonChip>
              );
            })}
          </div>

          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["search"]}`}
            placeholder="Buscar..."
            color="warning"
            debounce={1000}
            onIonInput={(ev) => handleSearchChange(ev.detail.value!)}
          ></IonSearchbar>
        </div>

        <IonList className="ion-no-padding ion-margin-bottom" lines="none">
          {clips?.map((item: any, idx: any) => {
            return (
              <Item
                key={idx}
                idx={idx}
                item={item}
                sqlite={sqlite}
                network={network}
                onSetClips={onSetClips}
              />
            );
          })}
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={(ev) => {
            onSetPage(ev, page + 1);
            setTimeout(() => ev.target.complete(), 1000);
          }}
        >
          <IonInfiniteScrollContent
            loadingText="Cargando..."
            loadingSpinner="bubbles"
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </div>
    </>
  );
};
