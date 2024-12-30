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
import { useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  setAudioRef,
  setGlobalAudio,
  setListAudios,
  setGlobalPos,
  clearListAudios,
  resetStore,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { setIsGlobalPlaying } from "@/store/slices/audioSlice";

export const Clips = () => {
  const dispatch = useDispatch();

  const { globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const [present, dismiss] = useIonLoading();
  const [present2, dismiss2] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const { user } = getUser();

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
    if ( hasMore )
      setPage(page);
    else 
      evt.target.complete();
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

      if (data.data.length === 0) {
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

  const onTrash = async (idx: number, audio: any, usuarios_clips: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedClips = [...clips];

      const userClip = hasThisUser(usuarios_clips);

      await trash(userClip?.id);

      const updatedUsuariosClips = updatedClips[idx].usuarios_clips.filter(
        (item: any) => item.id !== userClip?.id
      );

      updatedClips[idx] = {
        ...updatedClips[idx],
        usuarios_clips: updatedUsuariosClips,
      };

      setClips([...updatedClips]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            usuarios_clips: updatedClips[idx].usuarios_clips,
          })
        );
      }

      // onGetClips();
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

  const onAdd = async (idx: number, audio: any, id: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedClips = [...clips];

      const data = {
        clips_id: id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await add(data);

      const updatedUsuariosClips = [
        ...updatedClips[idx].usuarios_clips,
        {
          users_id: user.id,
          clips_id: id,
          id: added.id,
        },
      ];

      updatedClips[idx] = {
        ...updatedClips[idx],
        usuarios_clips: updatedUsuariosClips,
      };

      setClips([...updatedClips]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            usuarios_clips: updatedClips[idx].usuarios_clips,
          })
        );
      }

      // onGetPlaylist();
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

  const onPlayClicked = (idx: number, audio: any) => {

    console.log( audio )

    if (!globalAudio || audio.id != globalAudio.id) {
      dispatch(setAudioRef(audio.audio));
      dispatch(setGlobalAudio(audio));
      dispatch(setGlobalPos(idx));
    }

    dispatch(setIsGlobalPlaying(true));
  };

  const onDoPause = () => {
    dispatch(setIsGlobalPlaying(false));
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
              {globalAudio?.id == item.id && isGlobalPlaying ? (
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={pauseCircle}
                  onClick={onDoPause}
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
                  onClick={() => onTrash(idx, item, item.usuarios_clips)}
                />
              ) : (
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={starOutline}
                  onClick={() => onAdd(idx, item, item.id)}
                />
              )}
            </IonItem>
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
