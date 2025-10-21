import { startBackground } from "@/helpers/background";
import { create } from "@/helpers/musicControls";
import { useAudio } from "@/hooks/useAudio";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonRange,
  IonSkeletonText,
  IonText,
  useIonToast,
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
import { db } from "@/hooks/useDexie";

interface Props {
  activeIndex: any;
  audio: any;
  network: any;
  onGoBack: () => void;
  onGoNext: () => void;
  onSaveNext: (e: any) => void;
}

export const Audio: React.FC<Props> = memo(
  ({ activeIndex, audio, network, onGoBack, onGoNext, onSaveNext }) => {
    const { isGlobalPlaying }: any = useSelector((state: any) => state.audio);

    const [presentToast] = useIonToast();

    const [percent, setPercent] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [localSrc, setLocalSrc] = useState<any>(null);

    const audioRef: any = useRef({
      currentTime: 0,
      duration: 0,
      pause: () => {},
      play: () => {},
      fastSeek: (time: number) => {},
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
    } = useAudio(audioRef, () => {});

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
            setPercent(p);
          }
        );

        if (!ruta) {
          throw new Error("No se pudo descargar el audio");
        }

        console.log("Ruta es ", ruta);
        setPercent(0);

        await db.crecimientos.update(audio.id, {
          imagen_local: audio.imagen,
          audio_local: ruta,
          downloaded: 1,
        });

        onPresentToast(
          "bottom",
          audio.titulo +
            " está listo para escucharse sin conexión. Podrás acceder a él desde esta misma aplicación",
          musicalNotesOutline
        );

        const audioBlob = await getDownloadedAudio(ruta);
        setLocalSrc(audioBlob);
      } catch (error) {
        console.log(" error ondownload", error);
      }
    };

    const onRemoveLocal = async () => {
      try {
        await deleteAudio(audio.audio_local);

        await db.crecimientos.update(audio.id, {
          imagen_local: "",
          audio_local: "",
          downloaded: 0,
        });

        onPresentToast(
          "bottom",
          audio.titulo + " ha sido eliminado de tu biblioteca.",
          musicalNotesOutline
        );

        setLocalSrc(null);
      } catch (error) {
        console.log(error);
      }
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
      if (audio?.downloaded == "1") {
        const audioBlob = await getDownloadedAudio(audio.audio_local);
        setLocalSrc(audioBlob);
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
      getLocalSrc();
    }, [audio]);

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

            <IonCardSubtitle
              className="ion-no-padding"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {percent > 0 && <span style={{ width: "30px" }}></span>}

              {percent > 0 && <AudioProgressCircle />}
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent className="ion-padding">
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

            <div
              className={`ion-margin-bottom ${styles.controls}`}
            >
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
                      pointerEvents:
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

            <div className="flex justify-end">

              <IonButton
                shape="round"
                className={`ion-margin-top ${styles['downloadBtn']}`}
                disabled={!network.status && !localSrc}
                onClick={() => (localSrc ? onRemoveLocal() : onDownload())}
              >
                <IonIcon
                  slot="start"
                  className={`${styles["donwload-icon"]}`}
                  icon={localSrc ? trashBinOutline : downloadOutline}
                />
                {localSrc ? "Eliminar Descarga" : "Descargar"}
              </IonButton>

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
