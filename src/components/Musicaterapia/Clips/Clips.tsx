import {
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import styles from "../Musicaterapia.module.scss";

import { useState } from "react";

import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { clearListAudios, setListAudios } from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Clips = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const network = useNetwork();

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

    dispatch(setListAudios([...paginados]));

    return paginados;
  }, [chip, page, search]);

  const onSetPage = (evt: any, page: any) => {
    if (hasMore) setPage(page);
    else evt.target.complete();
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
                network={network}
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
