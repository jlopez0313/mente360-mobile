import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Clip.module.scss";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonProgressBar,
  IonRange,
  IonSkeletonText,
  IonText,
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import {
  downloadOutline,
  musicalNotesOutline,
  pause,
  play,
  playSkipBack,
  playSkipForward,
  shareSocial,
  trashBinOutline,
} from "ionicons/icons";

import UIContext from "@/context/Context";
import { useAudio } from "@/hooks/useAudio";
import { useDispatch, useSelector } from "react-redux";
import {
  setGlobalPos,
  setAudioSrc,
  setGlobalAudio,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";

import { startBackground } from "@/helpers/background";
import {
  create,
  updateElapsed,
  toggle,
  destroy,
} from "@/helpers/musicControls";

export const Clip = () => {
  const dispatch = useDispatch();

  const { db }: any = useContext(UIContext);

  const [presentToast] = useIonToast();

  const [isLoading, setIsLoading] = useState(true);
  const [localSrc, setLocalSrc] = useState<any>(null);
  const [audioSrc, setAudioSrc] = useState<any>(null);

  const { globalAudio, globalPos, listAudios } = useSelector(
    (state: any) => state.audio
  );

  const audioRef = useRef();

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
    getDownloadedAudio
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

  const onDownload = async (audio: any) => {
    try {
      onPresentToast(
        "bottom",
        "Descargando " + audio.titulo + "...",
        downloadOutline
      );

      const ruta = await downloadAudio(
        baseURL + audio.audio,
        "audio_" + audio.id,
        async (p) => {
          console.log("P es ", p);
        }
      );

      console.log("Ruta es ", ruta);

      await db.set("audio_" + audio.id, ruta);
      onPresentToast(
        "bottom",
        audio.titulo + " está listo para escucharse sin conexión.",
        musicalNotesOutline
      );

      setLocalSrc(ruta);
    } catch (error) {
      console.log(" error ondownload", error);
    }
  };

  const onRemoveLocal = async (audio: any) => {
    await db.remove("audio_" + audio.id);

    await deleteAudio(localSrc);

    onPresentToast(
      "bottom",
      audio.titulo + " ha sido eliminado de tu biblioteca.",
      musicalNotesOutline
    );

    setLocalSrc(null);
  };

  const onUpdateElapsed = () => {
    onTimeUpdate();
    updateElapsed(audioRef.current?.currentTime);
  };

  const goToPrev = async () => {
    const prevIdx = globalPos == 0 ? listAudios.length - 1 : globalPos - 1;
    dispatch(setGlobalPos(prevIdx));

    const prev = listAudios[prevIdx];
    dispatch(setAudioSrc(prev.audio));
    dispatch(setGlobalAudio(prev));
  };

  const goToNext = async () => {
    // onEnd();
    const nextIdx = globalPos == listAudios.length - 1 ? 0 : globalPos + 1;
    dispatch(setGlobalPos(nextIdx));

    const next = listAudios[nextIdx];
    dispatch(setAudioSrc(next.audio));
    dispatch(setGlobalAudio(next));
  };

  const getLocalSrc = async (audioID: any) => {
    try {
      const ruta = await db.get("audio_" + audioID);
      console.log(ruta);
      setLocalSrc(ruta);
    } catch (error) {
      console.log("error get local src", error);
    }
  };

  const onSetSrc = async () => {
    if (localSrc) {
      const audioBlob = await getDownloadedAudio(localSrc);
      setAudioSrc( audioBlob )
    } else {
      setAudioSrc( baseURL + globalAudio.audio )
    }
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

  useEffect(() => {
    getLocalSrc(globalAudio.id);
  }, []);

  useEffect(() => {
    onSetSrc();
  }, [localSrc]);

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
          src={baseURL + globalAudio.imagen}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
          className="ion-margin-bottom"
        />

        <IonCardHeader className="ion-no-padding">
          <IonCardSubtitle className="ion-no-padding">
            <IonIcon
              className={`${styles["donwload-icon"]}`}
              onClick={() =>
                localSrc ? onRemoveLocal(globalAudio) : onDownload(globalAudio)
              }
              icon={localSrc ? trashBinOutline : downloadOutline}
            />

            <IonText> {globalAudio.titulo} </IonText>
            <IonIcon
              className={`${styles["share-icon"]}`}
              onClick={() => onShareLink(globalAudio.id)}
              icon={shareSocial}
            />
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
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
            src={ audioSrc }
          />

          <img
            src="assets/images/logo_texto.png"
            style={{
              width: "90px",
              display: "block",
              marginTop: "50px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </IonCardContent>
      </IonCard>
    </div>
  );
};
