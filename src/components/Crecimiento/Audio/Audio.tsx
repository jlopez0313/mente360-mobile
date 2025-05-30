import { startBackground } from "@/helpers/background";
import { create } from "@/helpers/musicControls";
import { useAudio } from "@/hooks/useAudio";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonChip,
  IonIcon,
  IonRange,
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
  trashBinOutline,
} from "ionicons/icons";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Audio.module.scss";

import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import AudioProgressCircle from "@/components/Shared/Animations/ProgressCircle/ProgressCircle";
import CrecimientosDB from "@/database/crecimientos";

interface Props {
  activeIndex: any;
  audio: any;
  sqlite: any;
  network: any;
  onGoBack: () => void;
  onGoNext: () => void;
  onSaveNext: (e: any) => void;
}

export const Audio: React.FC<Props> = memo(
  ({ activeIndex, audio, sqlite, network, onGoBack, onGoNext, onSaveNext }) => {
    const { db, initialized, performSQLAction } = sqlite;

    const { isGlobalPlaying }: any = useSelector((state: any) => state.audio);

    const [presentToast] = useIonToast();

    const [percent, setPercent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [localSrc, setLocalSrc] = useState<any>(null);

    const audioRef: any = useRef({
      currentTime: 0,
      duration: 0,
      pause: () => { },
      play: () => { },
      fastSeek: (time: number) => { },
    });

    const {
      baseURL,
      progress,
      buffer,
      duration,
      real_duration,
      currentTime,
      isPlaying,
      onLoadedMetadata,
      onTimeUpdate,
      onUpdateBuffer,
      onStart,
      onEnd,
      onPause,
      onPlay,
      onLoad,
      downloadAudio,
      deleteAudio,
      getDownloadedAudio,
    } = useAudio(audioRef, () => { });

    const onDoPlay = () => {
      // toggle(true)
      onPlay();
    };

    const onDoPause = () => {
      // toggle(false)
      onPause();
    };

    const goStart = async () => {
      onPause();
      onStart();
      onPlay();
    };

    const onDownload = async () => {
      try {
        onPresentToast(
          "bottom",
          "Descargando " + audio.titulo + "...",
          downloadOutline
        );

        const ruta = await downloadAudio(
          baseURL + audio.audio,
          "podcast_" + audio.id,
          async (p: any) => {
            setPercent(p)
            console.log("P es ", p);
          }
        );

        console.log("Ruta es ", ruta);
        setPercent(0)

        const crecimientosDB = new CrecimientosDB(db);
        await crecimientosDB.download(performSQLAction, () => { }, {
          id: audio.id,
          imagen: audio.imagen,
          audio: ruta,
        });

        onPresentToast(
          "bottom",
          audio.titulo + " está listo para escucharse sin conexión.",
          musicalNotesOutline
        );

        const audioBlob = await getDownloadedAudio(ruta);
        setLocalSrc(audioBlob);
      } catch (error) {
        console.log(" error ondownload", error);
      }
    };

    const onRemoveLocal = async () => {
      console.log("removing");

      const crecimientosDB = new CrecimientosDB(db);
      await crecimientosDB.unload(performSQLAction, () => { }, { id: audio.id });

      await deleteAudio(localSrc);

      onPresentToast(
        "bottom",
        audio.titulo + " ha sido eliminado de tu biblioteca.",
        musicalNotesOutline
      );

      setLocalSrc(null);
    };

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

    const getLocalSrc = async () => {
      try {
        const crecimientosDB = new CrecimientosDB(db);
        await crecimientosDB.find(
          performSQLAction,
          async (clip: any) => {
            if (clip?.downloaded == "1") {
              const audioBlob = await getDownloadedAudio(clip.audio_local);
              setLocalSrc(audioBlob);
            }
          },
          audio.id
        );
      } catch (error) {
        console.log("error get local src", error);
      }
    };

    useEffect(() => {
      if (real_duration) {
        startBackground();
        create(
          baseURL,
          audio,
          real_duration,
          onPlay,
          onPause,
          onGoBack,
          onGoNext
        );
      }
    }, [real_duration]);

    useEffect(() => {
      if (!isGlobalPlaying) {
        onPlay();
      } else {
        onPause();
      }
    }, [isGlobalPlaying]);

    useEffect(() => {
      initialized && getLocalSrc();
    }, [initialized]);

    useEffect(() => {
      goStart();
    }, []);

    return (
      <>
        <IonCard className={`ion-text-center ${styles.card}`}>
          {isLoading && (
            <IonSkeletonText
              animated
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "5px",
              }}
            />
          )}

          <img
            alt=""
            src={network.status ? baseURL + audio.imagen : AudioNoWifi}
            style={{ display: isLoading ? "none" : "block" }}
            onLoad={() => setIsLoading(false)}
            className="ion-margin-bottom"
          />

          <IonCardHeader className="ion-no-padding">
            <IonCardSubtitle className="ion-no-padding">
              <IonText> {audio.titulo} </IonText>
            </IonCardSubtitle>

            <IonCardSubtitle className="ion-no-padding"
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              {
                percent > 0 &&
                <span style={{ width: '30px' }}></span>
              }
              <div className={styles["chip-list"]}>
                <IonChip
                  disabled={!network.status && !localSrc}
                  onClick={() => (localSrc ? onRemoveLocal() : onDownload())}
                >
                  <IonIcon
                    className={`${styles["donwload-icon"]}`}
                    icon={localSrc ? trashBinOutline : downloadOutline}
                  />
                  {localSrc ? "Eliminar Descarga" : "Descargar"}
                </IonChip>
              </div>

              {
                percent > 0 &&
                <AudioProgressCircle />
              }


            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent className="ion-no-padding">
            <IonRange
              disabled={false}
              value={progress}
              onIonKnobMoveStart={onPause}
              onIonKnobMoveEnd={(e) => onLoad(e.detail.value)}
              style={{
                "--bar-background":
                  "linear-gradient(to right, #787878 " +
                  (buffer * 100).toFixed(2) +
                  "%, #dddddd " +
                  (buffer * 100).toFixed(2) +
                  "%)",
              }}
            ></IonRange>

            <div className={`ion-margin-top ${styles.time}`}>
              <span> {currentTime} </span>
              <span> {duration} </span>
            </div>

            <div className={`${styles.controls}`}>
              <IonIcon
                onClick={onGoBack}
                className={styles.previous}
                icon={playSkipBack}
              ></IonIcon>
              <div className={`${styles.play}`}>
                {isPlaying ? (
                  <IonIcon
                    className={styles["icon-play"]}
                    onClick={onDoPause}
                    icon={pause}
                  ></IonIcon>
                ) : (
                  <IonIcon
                    style={{
                      opacity: !network.status && !localSrc ? 0.2 : 1,
                      "pointer-events":
                        !network.status && !localSrc ? "none" : "auto",
                    }}
                    className={styles["icon-play"]}
                    onClick={onDoPlay}
                    icon={play}
                  ></IonIcon>
                )}
              </div>
              <IonIcon
                onClick={onGoNext}
                className={styles.next}
                icon={playSkipForward}
              ></IonIcon>
            </div>

            <audio
              ref={audioRef}
              src={localSrc ? localSrc : baseURL + audio.audio}
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onProgress={onUpdateBuffer}
              onEnded={() => onSaveNext(activeIndex)}
            />
          </IonCardContent>
        </IonCard>
      </>
    );
  }
);
