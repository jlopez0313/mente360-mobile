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
import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Audio.module.scss";
import { useAudio } from "@/hooks/useAudio";
import UIContext from "@/context/Context";
import { useDispatch, useSelector } from "react-redux";
import { setIsGlobalPlaying } from "@/store/slices/audioSlice";

interface Props {
  audio: any;
  onConfirm: () => void;
}

export const Audio: React.FC<Props> = ({ audio, onConfirm }) => {
  
  const dispatch = useDispatch();

  const { isGlobalPlaying }: any =
    useSelector((state: any) => state.audio);

  const audioRef = useRef<any>({
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
    buffer,
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
  } = useAudio(audioRef, onConfirm);

  const onDoPause = () => {
    onPause();
    onConfirm();

    dispatch( setIsGlobalPlaying( true ) );
  };

  useEffect(() => {
    if (isPlaying && isGlobalPlaying) {
      dispatch( setIsGlobalPlaying( false ) );
    } else if ( !isPlaying ) {
      dispatch( setIsGlobalPlaying( true ) );
    }
  }, [isPlaying]);

  return (
    <IonCard className={styles.card}>
      <img alt="Silhouette of mountains" src={baseURL + audio.imagen} />

      <IonCardHeader className="ion-no-padding">
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

      <IonCardContent>

        <IonRange
          value={progress}
          onIonKnobMoveStart={onPause}
          onIonKnobMoveEnd={(e) => onLoad(e.detail.value)}
          style={{
            "--bar-background":
              "linear-gradient(to right, #787878" +
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
          {/*
            <IonIcon
              onClick={onStart}
              className={styles.previous}
              icon={playSkipBack}
            ></IonIcon>
           */}

          <div className={`${styles.play}`}>
            {isPlaying ? (
              <IonIcon onClick={onPause} icon={pause}></IonIcon>
            ) : (
              <IonIcon onClick={onPlay} icon={play}></IonIcon>
            )}
          </div>

          {/*
            <IonIcon
              onClick={onEnd}
              className={styles.next}
              icon={playSkipForward}
            ></IonIcon>
           */}
        </div>

        <audio
          ref={audioRef}
          src={baseURL + audio.audio}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onProgress={onUpdateBuffer}
          onEnded={onDoPause}
        />
      </IonCardContent>
    </IonCard>
  );
};
