import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonProgressBar,
  IonRange,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import {
  pause,
  play,
  playSkipBack,
  playSkipForward,
  shareSocial,
} from "ionicons/icons";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import styles from "./Audio.module.scss";
import UIContext from "@/context/Context";
import { BackgroundMode } from "@anuradev/capacitor-background-mode";
import { startBackground } from "@/helpers/background";
import { create, toggle, destroy } from "@/helpers/musicControls";
import { useDispatch, useSelector } from "react-redux";
import {
  setGlobalAudio,
  setIsGlobalPlaying,
  updateCurrentTime,
  resetStore,
} from "@/store/slices/audioSlice";

interface Props {
  activeIndex: any;
  audio: any;
  onGoBack: () => void;
  onGoNext: () => void;
  onSaveNext: (e: any) => void;
}

export const Audio: React.FC<Props> = memo(
  ({ activeIndex, audio, onGoBack, onGoNext, onSaveNext }) => {
    const { isGlobalPlaying }: any = useSelector((state: any) => state.audio);
    const [isLoading, setIsLoading] = useState(true);

    const audioRef = useRef({
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
      goStart();
    }, []);

    return (
      <IonCard className={`ion-margin-top ion-text-center ${styles.card}`}>
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
          src={baseURL + audio.imagen}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />

        <IonCardHeader className="ion-no-padding ion-margin-bottom">
          <IonCardSubtitle className="ion-no-padding">
            {/*
              <IonText> &nbsp; </IonText>
            */}
            <IonText> {audio.titulo} </IonText>
            {/* 
              <IonIcon icon={shareSocial} />
            */}
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
            src={baseURL + audio.audio}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onProgress={onUpdateBuffer}
            onEnded={() => onSaveNext(activeIndex)}
          />
        </IonCardContent>
      </IonCard>
    );
  }
);
