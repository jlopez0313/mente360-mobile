import styles from "../Musicaterapia.module.scss";
import {
  IonChip,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import {
  pauseCircle,
  playCircle,
  shareSocialOutline,
  star,
  starOutline,
} from "ionicons/icons";

import { all as allCategorias } from "@/services/categorias";
import { all as allClips, byCategory } from "@/services/clips";
import { add, trash } from "@/services/playlist";

import { getUser } from "@/helpers/onboarding";
import { useContext, useEffect, useState } from "react";
import UIContext from "@/context/Context";

export const Clips = () => {
  const {
    globalAudio,
    isPlaying,
    onPause,
    onPlay,
    setGlobalAudio,
    listAudios,
    setListAudios,
    globalPos,
    setGlobalPos,
    setShowGlobalAudio,
  }: any = useContext(UIContext);

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const { user } = getUser();

  const [categorias, setCategorias] = useState<any>([]);
  const [categoria, setCategoria] = useState("All");
  const [todosClips, setTodosClips] = useState<any>([]);
  const [clips, setClips] = useState<any>([]);
  const [chip, setChip] = useState<any>("0");
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");

  const oSetSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const onSetPage = (page: any) => {
    setPage(page);
  };

  const hasThisUser = (usuarios_clips: any[]) => {
    const hasUserClip = usuarios_clips.find(
      (item) => item.users_id == user?.id
    );
    return hasUserClip;
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
      if (chip == "0") {
        setCategoria("All");
      } else {
        setCategoria(
          categorias.find((item: any) => item.id == chip)?.categoria
        );
      }

      const { data } = await fn(chip, page, search);

      setTodosClips( (lista: any) => [...lista, ...(data.data || [])]);
      setListAudios( (lista: any) => [...lista, ...(data.data || [])]);

    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    }
  };

  const onTrash = async (idx: number, usuarios_clips: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const userClip = hasThisUser(usuarios_clips);

      await trash(userClip?.id);
      clips[idx].usuarios_clips = clips[idx].usuarios_clips.filter(
        (item: any) => item.id != userClip?.id
      );
      setClips([...clips]);
      // onGetClips();
    } catch (error: any) {
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

  const onAdd = async (idx: number, id: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const data = {
        clips_id: id,
        users_id: user.id,
      };

      await add(data);
      clips[idx].usuarios_clips.push({
        users_id: user.id,
        clips_id: id,
      });

      setClips([...clips]);
      // onGetPlaylist();
    } catch (error: any) {
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

  const onPlayClicked = (idx: number, audio: any) => {
    if (!globalAudio || audio != globalAudio) {
      setGlobalAudio(audio);
      setGlobalPos(idx);
    }
    onPlay();
  };

  const onUpdateList = () => {
    onPlay();

    const tmpClips = clips.map((item: any) => {
      return item.id == globalAudio.id ? globalAudio : item;
    });

    setClips(tmpClips);
  };

  const onRefreshList = () => {
    if (chip == "0") {
      onGetClips(allClips);
    } else {
      onGetClips(byCategory);
    }
  };

  useEffect(() => {
    onGetCategorias();
    setShowGlobalAudio(true);
  }, []);

  useEffect(() => {
    setClips(todosClips);
  }, [todosClips]);

  useEffect(() => {
    setTodosClips([]);

    if (page != 1) {
      setPage(1);
    } else {
      onRefreshList();
    }
  }, [chip]);

  useEffect(() => {
    setTodosClips([]);

    const delayDebounceFn = setTimeout(() => {
      if (page != 1) {
        setPage(1);
      } else {
        onRefreshList();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    onRefreshList();
  }, [page]);

  useEffect(() => {
    globalAudio && onUpdateList();
  }, [globalAudio]);

  return (
    <div className={styles["ion-content"]}>
      <div className={`ion-margin-bottom ${styles.chips}`}>
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

        <IonSearchbar
          className={`ion-no-padding ion-margin-top ion-margin-bottom ${styles["searc"]}`}
          placeholder="Buscar..."
          color="warning"
          onIonInput={(ev) => oSetSearch(ev)}
        ></IonSearchbar>
      </div>

      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {clips.map((item: any, idx: any) => {
          return (
            <IonItem key={idx} button={true}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <IonLabel className={`ion-text-left ${styles["titulo"]}`}>
                  {" "}
                  {item.titulo}{" "}
                </IonLabel>
                <span className={styles["categoria"]}>
                  {" "}
                  {item.categoria?.categoria}{" "}
                </span>
              </div>
              {globalAudio?.id == item.id && isPlaying ? (
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={pauseCircle}
                  onClick={onPause}
                />
              ) : (
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={playCircle}
                  onClick={() => onPlayClicked(idx, item)}
                />
              )}

              {hasThisUser(item.usuarios_clips) ? (
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={star}
                  onClick={() => onTrash(idx, item.usuarios_clips)}
                />
              ) : (
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={starOutline}
                  onClick={() => onAdd(idx, item.id)}
                />
              )}
            </IonItem>
          );
        })}
      </IonList>

      <IonInfiniteScroll
        onIonInfinite={(ev) => {
          onSetPage(page + 1);
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
