import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { add, trash } from "@/services/playlist";
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonProgressBar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";

import {
  closeCircle,
  ellipsisVertical,
  pauseCircle,
  playCircle,
  playSkipBack,
  playSkipForward,
  star,
  starOutline,
} from "ionicons/icons";
import styles from "./Toast.module.scss";

import { useAudio } from "@/hooks/useAudio";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import {
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";

import { startBackground } from "@/helpers/background";
import { create, destroy, updateElapsed } from "@/helpers/musicControls";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";

export const Toast = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    baseURL,
    audioSrc,
    globalAudio,
    listAudios,
    globalPos,
    isGlobalPlaying,
  } = useSelector((state: any) => state.audio);

  const audioRef: any = useRef();
  const network = useNetwork();

  const {
    duration,
    real_duration,
    progress,
    buffer,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onPause,
    onPlay,
    getDownloadedAudio,
  } = useAudio(audioRef, () => { });

  const { user } = useSelector((state: any) => state.user);
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [hasClip, setHasClip] = useState<any>(null);
  const [ev, setEv] = useState<MouseEvent | undefined>(undefined);

  const onClear = () => {
    // setShowGlobalAudio( false );
    destroy();
    onPause();
    dispatch(setGlobalPos(0));
    dispatch(setGlobalAudio(""));
  };

  const goToPrev = async () => {
    const prevIdx = (globalPos - 1 + listAudios.length) % listAudios.length;
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
    const nextIdx = (globalPos + 1) % listAudios.length;
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

  const onTrash = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(globalAudio.id);
      await db.playlist.where("id").equals(globalAudio.id).delete();

      const newItem = {
        ...globalAudio,
        in_my_playlist: null,
      };

      dispatch(setGlobalAudio({ ...newItem }));
      // onGetClips();
    } catch (error: any) {
      console.error(error);

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

  const onAdd = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const formData = {
        clips_id: globalAudio.id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await add(formData);

      await db.playlist.add({
        id: added.id,
        clip: globalAudio,
        users_id: user.id,
      });

      const newItem = {
        ...globalAudio,
        in_my_playlist: added.id,
      };

      dispatch(setGlobalAudio({ ...newItem }));
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

  const goToClip = () => {
    history.replace("/musicaterapia/clip");
  };

  const onDoPlay = () => {
    onPlay();
    dispatch(setIsGlobalPlaying(true));
  };

  const onDoPause = () => {
    onPause();
    dispatch(setIsGlobalPlaying(false));
  };

  const onUpdateElapsed = () => {
    onTimeUpdate();
    updateElapsed(audioRef.current?.currentTime);
  };

  useEffect(() => {
    onPause();
    onPlay();
  }, [globalAudio]);

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
    if (isGlobalPlaying) {
      onPlay();
    } else {
      onPause();
    }
  }, [isGlobalPlaying]);

  return (
    <div id="player" className={`${styles["custom-toast"]}`}>
      <IonItem lines="none" button={true} detail={false}>
        <IonAvatar slot="start">
          <img
            alt=""
            src={!network.status ? AudioNoWifi : baseURL + globalAudio.imagen}
          />
        </IonAvatar>

        <div
          style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}
          onClick={goToClip}
        >
          <IonLabel class={`ion-text-justify ${styles.title}`}>
            {" "}
            {globalAudio.titulo}{" "}
          </IonLabel>
          <span className={`${styles.categoria}`}>
            {" "}
            {globalAudio.categoria?.categoria}{" "}
          </span>
        </div>

        <IonIcon
          className={styles['backward']}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrev();
          }}
          aria-hidden="true"
          slot="end"
          icon={playSkipBack}
        />

        {isPlaying ? (
          <IonIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDoPause();
            }}
            aria-hidden="true"
            slot="end"
            icon={pauseCircle}
          ></IonIcon>
        ) : (
          <IonIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDoPlay();
            }}
            aria-hidden="true"
            slot="end"
            icon={playCircle}
          ></IonIcon>
        )}

        <IonIcon
          className={styles['forward']}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNext();
          }}
          aria-hidden="true"
          slot="end"
          icon={playSkipForward}
        />

        <IonIcon
          className={styles['ellipsis']}
          aria-hidden="true"
          slot="end"
          icon={ellipsisVertical}
          onClick={(e) => {
            setEv(e.nativeEvent);
          }}
        />

        <IonPopover
          isOpen={!!ev}
          event={ev}
          onDidDismiss={() => setEv(undefined)}
          side="top"
          alignment="center"
        >
          <IonContent class="ion-no-padding">
            <IonList className={styles.listplayer}>
              {globalAudio.in_my_playlist ? (
                <IonItem
                  button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTrash();
                  }}
                  detail={false}
                  aria-label="Quitar de mi playlist"
                >
                  <IonIcon aria-hidden="true" slot="start" icon={star} />
                  <IonLabel>Quitar de mi playlist</IonLabel>
                </IonItem>
              ) : (
                <IonItem
                  button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAdd();
                  }}
                  detail={false}
                  aria-label="Agregar a mi playlist"
                >
                  <span className="material-symbols-outlined marginright10">star</span>
                  <IonLabel className="ion-left" >Agregar a mi playlist</IonLabel>
                </IonItem>
              )}

              <IonItem
                lines="none"
                button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClear();
                }}
                detail={false}
                aria-label="Cerrar Reproductor"
              >
                <span className="material-symbols-outlined marginright10">close</span>

                <IonLabel className="ion-left">Cerrar Reproductor</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <div className={`${styles["unread-indicator"]}`}>
          <IonProgressBar
            buffer={buffer}
            value={progress / 100}
            color="warning"
          />
        </div>
      </IonItem>

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
    </div>
  );
};
