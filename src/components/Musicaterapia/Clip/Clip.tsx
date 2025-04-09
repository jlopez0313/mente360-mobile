import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonProgressBar,
  IonSkeletonText,
  IonText,
  useIonToast
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
import { useEffect, useRef, useState } from "react";
import styles from "./Clip.module.scss";

import { useAudio } from "@/hooks/useAudio";
import {
  setAudioItem,
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";

import { startBackground } from "@/helpers/background";
import {
  create,
  updateElapsed
} from "@/helpers/musicControls";

import ClipsDB from "@/database/clips";
import { useSqliteDB } from "@/hooks/useSqliteDB";

export const Clip = () => {

  const dispatch = useDispatch();
  const { db, initialized, performSQLAction } = useSqliteDB();

  const [presentToast] = useIonToast();

  const [isLoading, setIsLoading] = useState(true);

  const { audio, globalAudio, globalPos, listAudios } = useSelector(
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
        async (p: any) => {
          console.log("P es ", p);
        }
      );

      console.log("Ruta es ", ruta);

      const clipsDB = new ClipsDB(db);
      await clipsDB.download(performSQLAction, () => {}, {
        id: audio.id,
        imagen: audio.imagen,
        audio: ruta,
      });

      dispatch(
        setAudioItem({
          index: globalPos,
          newData: {
            imagen_local: audio.imagen,
            audio_local: ruta,
            downloaded: 1,
          },
        })
      );

      onPresentToast(
        "bottom",
        audio.titulo + " está listo para escucharse sin conexión.",
        musicalNotesOutline
      );

    } catch (error) {
      console.log(" error ondownload", error);
    }
  };

  const onRemoveLocal = async (audio: any) => {
    await db.remove("audio_" + audio.id);

    await deleteAudio(audio.audio_local);

    onPresentToast(
      "bottom",
      audio.titulo + " ha sido eliminado de tu biblioteca.",
      musicalNotesOutline
    );
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
                globalAudio.audio_local ? onRemoveLocal(globalAudio) : onDownload(globalAudio)
              }
              icon={globalAudio.audio_local ? trashBinOutline : downloadOutline}
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
            src={ audio }
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
