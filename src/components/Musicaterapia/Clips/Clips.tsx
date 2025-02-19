import styles from "../Musicaterapia.module.scss";
import {
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonSearchbar,
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";


import { all as allCategorias } from "@/services/categorias";
import { all as allClips, byCategory } from "@/services/clips";

import { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  setGlobalAudio,
  setListAudios,
  clearListAudios,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Item } from './Item';

export const Clips = () => {
  const dispatch = useDispatch();

  const { globalAudio } = useSelector(
    (state: any) => state.audio
  );

  const [present, dismiss] = useIonLoading();
  const [present2, dismiss2] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [categorias, setCategorias] = useState<any>([]);
  const [categoria, setCategoria] = useState("All");
  const [todosClips, setTodosClips] = useState<any>([]);
  const [clips, setClips] = useState<any>([]);
  const [chip, setChip] = useState<any>("0");
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [hasMore, setHasMore] = useState(true);

  const oSetSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const onSetPage = (evt: any, page: any) => {
    if (hasMore) setPage(page);
    else evt.target.complete();
  };

  const onGetCategorias = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const { data } = await allCategorias();

      setCategorias(data.data);
      await onGetClips(allClips);

      dismiss();
    } catch (error: any) {
      console.log(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const onGetClips = async (fn = allClips) => {
    try {
      present2({
        message: "Cargando ...",
      });

      const { data } = await fn(chip, page, search);

      const clipToAdd = [
        ...todosClips,
        ...(data.data || []).filter(
          (x: any) => !todosClips.some((y: any) => y.id == x.id)
        ),
      ];

      setTodosClips([...clipToAdd]);

      if (fn == byCategory || data.data.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss2();
    }
  };

  const onUpdateList = () => {
    const tmpClips = clips.map((item: any) => {
      return item.id == globalAudio.id ? globalAudio : item;
    });

    setClips([...tmpClips]);
  };

  const onRefreshList = () => {
    return chip == "0" ? onGetClips(allClips) : onGetClips(byCategory);
  };


  useEffect(() => {
    // dispatch(resetStore());
    onGetCategorias();
    dispatch(setShowGlobalAudio(true));
  }, []);

  useEffect(() => {
    setClips([...todosClips]);
    dispatch(setListAudios([...todosClips]));
  }, [todosClips]);

  useEffect(() => {
    globalAudio && onUpdateList();
  }, [globalAudio]);

  useEffect(() => {
    if (chip == "0") {
      setCategoria("All");
    } else {
      setCategoria(categorias.find((item: any) => item.id == chip)?.categoria);
    }

    if (search === "") {
      setSearch("__empty__");
      setTimeout(() => setSearch(""), 0);
    } else {
      setSearch("");
    }
  }, [chip]);

  useEffect(() => {
    setTodosClips([]);
    dispatch(clearListAudios());
    setPage(0);
    setHasMore(true);

    const delayDebounceFn = setTimeout(() => {
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    if (page) onRefreshList();
  }, [page]);

  return (
    <div className={styles["ion-content"]}>
      <div className={`ion-margin-bottom ${styles.chips}`}>
        <div className={styles["chip-list"]}>
          <IonChip
            onClick={() => setChip("0")}
            className={categoria == "All" ? styles.checked : ""}
          >
            {" "}
            All{" "}
          </IonChip>
          {categorias.map((item: any, idx: any) => {
            return (
              <IonChip
                key={idx}
                onClick={() => setChip(item.id)}
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
          onIonInput={(ev) => oSetSearch(ev)}
          value={search == "__empty__" ? "" : search}
        ></IonSearchbar>
      </div>

      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {clips.map((item: any, idx: any) => {
          return (
            <Item key={idx} idx={idx} item={item} clips={clips} setClips={setClips} />            
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
  );
};
