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
} from "@ionic/react";
import {
  pause,
  play,
  playSkipBack,
  playSkipForward,
  shareSocial,
} from "ionicons/icons";

import UIContext from "@/context/Context";
import { useAudio } from "@/hooks/useAudio";
import { useDispatch, useSelector } from "react-redux";
import {
  setGlobalPos,
  setAudioRef,
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

  const [isLoading, setIsLoading] = useState(true); 

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
  } = useAudio(
    audioRef,
    () => {},
    () => {}
  );

  const onUpdateElapsed = () => {
    onTimeUpdate();
    updateElapsed(audioRef.current?.currentTime);
  };

  const goToPrev = async () => {
    const prevIdx = globalPos == 0 ? listAudios.length - 1 : globalPos - 1;
    dispatch(setGlobalPos(prevIdx));

    const prev = listAudios[prevIdx];
    dispatch(setAudioRef(prev.audio));
    dispatch(setGlobalAudio(prev));
  };

  const goToNext = async () => {
    // onEnd();
    const nextIdx = globalPos == listAudios.length - 1 ? 0 : globalPos + 1;
    dispatch(setGlobalPos(nextIdx));

    const next = listAudios[nextIdx];
    dispatch(setAudioRef(next.audio));
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
        />

        <IonCardHeader className="ion-no-padding">
          <IonCardSubtitle className="ion-no-padding">
            <IonText> &nbsp; </IonText>
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
            src={baseURL + globalAudio.audio}
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
