import {
  IonChip,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import styles from "../Musicaterapia.module.scss";

import { all as allClips, byCategory } from "@/services/clips";

import { useEffect, useState } from "react";

import {
  clearListAudios,
  setListAudios,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

import Categorias from "@/database/categorias";
import ClipsDB from "@/database/clips";

import { useDB } from "@/context/Context";
import { getUser } from "@/helpers/onboarding";
import { useNetwork } from "@/hooks/useNetwork";

export const Clips = () => {
  const dispatch = useDispatch();

  const { user } = getUser();
  const { sqlite } = useDB();
  const network = useNetwork();

  const { globalAudio, listAudios } = useSelector((state: any) => state.audio);

  const [present, dismiss] = useIonLoading();
  const [present2, dismiss2] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [categorias, setCategorias] = useState<any>([]);
  const [categoria, setCategoria] = useState("All");
  const [clips, setClips] = useState<any>([]);
  const [chip, setChip] = useState<any>("0");
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [hasMore, setHasMore] = useState(true);

  const onSetPage = (evt: any, page: any) => {
    if (hasMore) setPage(page);
    else evt.target.complete();
  };

  const onGetCategorias = async () => {
    try {
      present({
        message: "Cargando...",
        duration: 200,
      });

      const categoriasDB = new Categorias(sqlite.db);
      await categoriasDB.all(sqlite.performSQLAction, (data: any) => {
        setCategorias(data);
      });
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

  const onRefreshList = () => {
    return chip == "0" ? onGetClips(allClips) : onGetClips(byCategory);
  };

  const onGetClips = async (fn = allClips) => {
    try {
      present2({
        message: "Cargando...",
        duration: 200,
      });

      const clipsDB = new ClipsDB(sqlite.db);
      const methodName =
        fn === allClips ? "all" : fn === byCategory ? "byCategory" : null;

      await clipsDB[methodName](
        sqlite.performSQLAction,
        (lista: any) => {

          const clipToAdd = [
            ...listAudios,
            ...(lista || []).filter(
              (x: any) => !listAudios.some((y: any) => y.id == x.id)
            ),
          ].sort( (a, b) => a.titulo > b.titulo ? 1 : -1 );

          dispatch(setListAudios([...clipToAdd]));

          if (methodName == "byCategory" || lista?.length === 0) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        },
        {
          search: search,
          categoria: chip,
          limit: page,
          userID: user.id
        }
      );
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });

      dismiss2();
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

  const handleChipChange = (id: string) => {
    dispatch(clearListAudios());
    setHasMore(true);

    if (id == "0") {
      setCategoria("All");
    } else {
      setCategoria(categorias.find((item: any) => item.id == id)?.categoria);
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
    const lista = [...clips];
    lista[idx] = {...item}

    dispatch(setListAudios([...lista]))
  }

  useEffect(() => {
    if (sqlite.initialized) {
      onGetCategorias();
      dispatch(setShowGlobalAudio(true));
    }
  }, [sqlite.initialized]);

  useEffect(() => {
    if (sqlite.initialized) {
      onRefreshList();
    }
  }, [chip, search, page]);

  useEffect(() => {
    if (sqlite.initialized) {
      globalAudio && onUpdateList();
    }
  }, [sqlite.initialized, globalAudio]);

  useEffect(() => {
    setClips([...listAudios]);
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
            {categorias.map((item: any, idx: any) => {
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
          {sqlite &&
            clips.map((item: any, idx: any) => {
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
