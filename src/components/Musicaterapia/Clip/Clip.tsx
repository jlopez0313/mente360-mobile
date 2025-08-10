import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonChip,
  IonIcon,
  IonProgressBar,
  IonSkeletonText,
  IonText,
  useIonAlert,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import {
  downloadOutline,
  heart,
  heartOutline,
  musicalNotesOutline,
  pause,
  play,
  playSkipBack,
  playSkipForward,
  shareSocial,
  star,
  starOutline,
  trashBinOutline,
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import styles from "./Clip.module.scss";

import { useAudio } from "@/hooks/useAudio";
import {
  putGlobalAudio,
  setAudioItem,
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";

import { startBackground } from "@/helpers/background";
import { create, updateElapsed } from "@/helpers/musicControls";

import AudioProgressCircle from "@/components/Shared/Animations/ProgressCircle/ProgressCircle";
// import ClipsDB from "@/database/clips";
import LikesDB from "@/database/likes";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { dislike, like } from "@/services/likes";
import { add, trash } from "@/services/playlist";

export const Clip = () => {
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();
  const network = useNetwork();

  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();

  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);

  const { audioSrc, globalAudio, globalPos, listAudios } = useSelector(
    (state: any) => state.audio
  );

  const audioRef = useRef<any>();

  const {
    baseURL,
    progress,
    duration,
    real_duration,
    buffer,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onPause,
    onPlay,
    onShareLink,
    downloadAudio,
    deleteAudio,
    getDownloadedAudio,
  } = useAudio(
    audioRef,
    () => {},
    () => {}
  );

  const onPresentToast = (
    position: "top" | "middle" | "bottom",
    message: string,
    icon: any
  ) => {
    presentToast({
      message: message,
      duration: 2000,
      position: position,
      icon: icon,
    });
  };

  const onDownload = async () => {
    try {
      onPresentToast(
        "bottom",
        "Descargando " + globalAudio.titulo + "...",
        downloadOutline
      );

      const ruta = await downloadAudio(
        baseURL + globalAudio.audio,
        "audio_" + globalAudio.id,
        async (p: any) => {
          setPercent(p);
          console.log("P es ", p);
        }
      );

      console.log("Ruta es ", ruta);
      setPercent(0);

      /*const clipsDB = new ClipsDB(db);
      await clipsDB.download(performSQLAction, () => { }, {
        id: globalAudio.id,
        imagen: globalAudio.imagen,
        audio: ruta,
      });
      */

      dispatch(
        setAudioItem({
          index: globalPos,
          newData: {
            imagen_local: globalAudio.imagen,
            audio_local: ruta,
            downloaded: 1,
          },
        })
      );

      onPresentToast(
        "bottom",
        globalAudio.titulo + " está listo para escucharse sin conexión.",
        musicalNotesOutline
      );
    } catch (error) {
      console.log(" error ondownload", error);
    }
  };

  const onRemoveLocal = async () => {
    /*
    const clipsDB = new ClipsDB(db);
    await clipsDB.unload(performSQLAction, () => { }, { id: globalAudio.id });
    */

    await deleteAudio(globalAudio.audio_local);

    dispatch(
      setAudioItem({
        index: globalPos,
        newData: {
          imagen_local: null,
          audio_local: null,
          downloaded: 0,
        },
      })
    );

    dispatch(putGlobalAudio({ ...globalAudio, audio_local: null }));

    onPresentToast(
      "bottom",
      globalAudio.titulo + " ha sido eliminado de tu biblioteca.",
      musicalNotesOutline
    );
  };

  const onTrashFromPlaylist = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(globalAudio.in_my_playlist);

      await db.playlist.where("id").equals(globalAudio.in_my_playlist).delete();

      const newItem = {
        ...globalAudio,
        in_my_playlist: null,
      };

      dispatch(setGlobalAudio({ newItem }));
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

  const onAddToPlaylist = async () => {
    try {
      present({
        message: "Cargando ...",
      });
      const data = {
        clips_id: globalAudio.id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await add(data);

      await db.playlist.add({
        id: added.id,
        clip: globalAudio,
        users_id: user.id,
      });

      const newItem = {
        ...globalAudio,
        in_my_playlist: added.id,
      };

      dispatch(setGlobalAudio(newItem));
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

  const onDislike = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await dislike(globalAudio.my_like);

      const likes = new LikesDB(db);
      // await likes.delete(performSQLAction, () => {}, globalAudio.my_like);

      const newItem = {
        ...globalAudio,
        all_likes: globalAudio.all_likes - 1,
        my_like: null,
      };

      dispatch(setGlobalAudio(newItem));
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

  const onLike = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const data = {
        clips_id: globalAudio.id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await like(data);

      const likesDB = new LikesDB(db);
      /*
      await likesDB.create(performSQLAction, () => {}, [
        {
          ...data,
          id: added.id,
        },
      ]);
      */

      const newItem = {
        ...globalAudio,
        all_likes: globalAudio.all_likes + 1,
        my_like: added.id,
      };

      dispatch(setGlobalAudio(newItem));
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

  const onUpdateElapsed = () => {
    onTimeUpdate();
    updateElapsed(audioRef.current?.currentTime);
  };

  const goToPrev = async () => {
    const prevIdx = globalPos == 0 ? listAudios.length - 1 : globalPos - 1;
    dispatch(setGlobalPos(prevIdx));

    const prev = listAudios[prevIdx];

    if (prev.audio_local) {
      const audioBlob = await getDownloadedAudio(prev.audio_local);
      dispatch(setAudioSrc(audioBlob));
    } else {
      dispatch(setAudioSrc(baseURL + prev.audio));
    }

    dispatch(setGlobalAudio(prev));
  };

  const goToNext = async () => {
    // onEnd();
    const nextIdx = globalPos == listAudios.length - 1 ? 0 : globalPos + 1;
    dispatch(setGlobalPos(nextIdx));

    const next = listAudios[nextIdx];

    if (next.audio_local) {
      const audioBlob = await getDownloadedAudio(next.audio_local);
      dispatch(setAudioSrc(audioBlob));
    } else {
      dispatch(setAudioSrc(baseURL + next.audio));
    }

    dispatch(setGlobalAudio(next));
  };

  useEffect(() => {
    if (real_duration) {
      startBackground();
      create(
        baseURL,
        globalAudio,
        real_duration,
        onPlay,
        onPause,
        goToPrev,
        goToNext
      );
    }
  }, [real_duration]);

  useEffect(() => {
    onPlay();
    dispatch(setShowGlobalAudio(false));
  }, [globalAudio]);

  return (
    <div className={styles["ion-content"]}>
      <IonCard className={styles.card}>
        {isLoading && (
          <IonSkeletonText
            animated
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "5px",
            }}
          />
        )}
        <img
          alt=""
          src={!network.status ? AudioNoWifi : baseURL + globalAudio.imagen}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
          className="ion-margin-bottom"
        />

        <IonCardHeader className="ion-no-padding">
          <IonCardSubtitle className="ion-no-padding">
            <IonText> {globalAudio.titulo} </IonText>
            <span> {globalAudio.categoria} </span>
          </IonCardSubtitle>

          <IonCardSubtitle className={"ion-no-padding"}>
            <div className={styles["chip-list"]}>
              <IonChip
                disabled={!network.status && !globalAudio.audio_local}
                onClick={() =>
                  globalAudio.audio_local ? onRemoveLocal() : onDownload()
                }
              >
                <IonIcon
                  className={`${styles["share-icon"]}`}
                  icon={
                    globalAudio.audio_local ? trashBinOutline : downloadOutline
                  }
                />
                {globalAudio.audio_local ? "Eliminar" : "Descargar"}
              </IonChip>

              <IonChip
                disabled={!network.status}
                onClick={() =>
                  globalAudio.in_my_playlist
                    ? onTrashFromPlaylist()
                    : onAddToPlaylist()
                }
              >
                <IonIcon
                  className={`${styles["share-icon"]}`}
                  icon={globalAudio.in_my_playlist ? star : starOutline}
                />
                Favoritos
              </IonChip>

              <IonChip
                disabled={!network.status}
                onClick={() => (globalAudio.my_like ? onDislike() : onLike())}
              >
                <IonIcon
                  className={`${styles["share-icon"]}`}
                  icon={globalAudio.my_like ? heart : heartOutline}
                />
                {globalAudio.all_likes > 0
                  ? globalAudio.all_likes + " Me gusta"
                  : "Me gusta"}
              </IonChip>

              <IonChip
                disabled={!network.status}
                onClick={() => onShareLink(globalAudio.id)}
              >
                <IonIcon
                  className={`${styles["share-icon"]}`}
                  icon={shareSocial}
                />
                Compartir
              </IonChip>
            </div>
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent className="ion-no-padding">
          <div className={`${styles["unread-indicator"]}`}>
            <IonProgressBar
              color="warning"
              buffer={buffer}
              value={progress / 100}
            />
          </div>

          <div className={`ion-margin-top ${styles.time}`}>
            <span> {currentTime} </span>
            <span> {duration} </span>
          </div>

          <div className={`${styles.controls}`}>
            <IonIcon
              onClick={goToPrev}
              className={styles.previous}
              icon={playSkipBack}
            ></IonIcon>

            <div className={`${styles.play}`}>
              {isPlaying ? (
                <IonIcon onClick={onPause} icon={pause}></IonIcon>
              ) : (
                <IonIcon onClick={onPlay} icon={play}></IonIcon>
              )}
            </div>

            <IonIcon
              onClick={goToNext}
              className={styles.next}
              icon={playSkipForward}
            ></IonIcon>
          </div>
          <audio
            ref={audioRef}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onUpdateElapsed}
            onProgress={onUpdateBuffer}
            onEnded={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            src={audioSrc}
          />

          {percent > 0 && (
            <div
              style={{ width: "100%", display: "flex", justifyContent: "end" }}
            >
              <AudioProgressCircle />
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};
