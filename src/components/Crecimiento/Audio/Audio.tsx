import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonProgressBar,
  IonRange,
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

interface Props {
  activeIndex: any;
  active: any;
  crecimiento: any;
  audio: any;
  onGoBack: () => void;
  onGoNext: () => void;
  onSaveNext: (e: any) => void;
}

export const Audio: React.FC<Props> = memo(({ active, activeIndex, crecimiento, audio, onGoBack, onGoNext, onSaveNext }) => {
  
  const { isPlaying: isGlobalPlaying, onPause: onGlobalPause }: any =
    useContext(UIContext);

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
    duration,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onStart,
    onEnd,
    onPause,
    onPlay,
    onLoad,
  } = useAudio(audioRef, () => {});

  useEffect(() => {
    if (isPlaying && isGlobalPlaying) {
      onGlobalPause();
    }
  }, [isPlaying, isGlobalPlaying]);

  useEffect(() => {
    onStart();
    active ? onPlay() : onPause();
  }, [active]);

  return (
    <IonCard className={`ion-margin-top ion-text-center ${styles.card}`}>
      <img alt="" src={baseURL + audio.imagen} />

      <IonCardHeader className="ion-no-padding ion-margin-bottom">
        <IonCardSubtitle className="ion-no-padding">
          <IonText> &nbsp; </IonText>
          <IonText> {audio.titulo} </IonText>
          <IonIcon icon={shareSocial} />
        </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent className="ion-no-padding">
        <IonRange
          disabled={ crecimiento.id != audio.id }
          value={progress}
          onIonKnobMoveStart={onPause}
          onIonKnobMoveEnd={(e) => onLoad(e.detail.value)}
        ></IonRange>

        <div className={`ion-margin-top ${styles.time}`}>
          <span> {currentTime} </span>
          <span> {duration} </span>
        </div>

        <div className={`${styles.controls}`}>
          <IonIcon
            onClick={active ? onGoBack : () => {} }
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
            onClick={crecimiento.id == audio.id ? onGoNext :  () => {} }
            className={styles.next}
            icon={playSkipForward}
          ></IonIcon>
        </div>

        <audio
          ref={audioRef}
          src={baseURL + audio.audio}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => onSaveNext( activeIndex )}
        />
      </IonCardContent>
    </IonCard>
  );
});
