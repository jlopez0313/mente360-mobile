import {
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonProgressBar,
  IonToast,
} from "@ionic/react";
import React, { useContext, useEffect, useRef } from "react";

import styles from "./Toast.module.scss";
import {
  pauseCircle,
  pauseCircleOutline,
  playBack,
  playCircle,
  playCircleOutline,
  playForward,
  playSkipBack,
  playSkipForward,
  starOutline,
} from "ionicons/icons";

import UIContext from "@/context/Context";

export const Toast = () => {
  const {
    audioRef,
    globalAudio,
    baseURL,
    progress,
    duration,
    currentTime,
    listAudios,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onStart,
    onEnd,
    onPause,
    onPlay,
    onLoad,
    setGlobalAudio,
    globalPos,
    setGlobalPos,
  }: any = useContext(UIContext);

  const goToPrev = async () => {
    onEnd();

    const prevIdx = globalPos == 0 ? listAudios.length - 1 : globalPos - 1;
    setGlobalPos(prevIdx);

    const next = listAudios[prevIdx];
    setGlobalAudio(next);
  };

  const goToNext = async () => {
    onEnd();

    const nextIdx = globalPos == listAudios.length - 1 ? 0 : globalPos + 1;
    setGlobalPos(nextIdx);

    const next = listAudios[nextIdx];
    setGlobalAudio(next);
  };

  useEffect(() => {
    onPlay()
  }, [globalAudio])

  return (
    <IonItem lines="none" button={true} className={`${styles["custom-toast"]}`}>
      <IonLabel class="ion-text-left"> {globalAudio.titulo} </IonLabel>

      <IonIcon
        onClick={goToPrev}
        aria-hidden="true"
        slot="end"
        icon={playSkipBack}
      />

      {isPlaying ? (
        <IonIcon
          onClick={onPause}
          aria-hidden="true"
          slot="end"
          icon={pauseCircle}
        ></IonIcon>
      ) : (
        <IonIcon
          onClick={onPlay}
          aria-hidden="true"
          slot="end"
          icon={playCircle}
        ></IonIcon>
      )}

      <IonIcon
        onClick={goToNext}
        aria-hidden="true"
        slot="end"
        icon={playSkipForward}
      />
      <IonIcon aria-hidden="true" slot="end" icon={starOutline} />

      <audio
        ref={audioRef}
        src={baseURL + globalAudio.audio}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={goToNext}
      />
      
      <div className={`${styles['unread-indicator']}`}>
        <IonProgressBar value={progress/100} color="dark" />
      </div>
      
    </IonItem>
  );
};
