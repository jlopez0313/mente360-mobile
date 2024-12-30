import { useContext, useEffect, useRef } from "react";
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
import { Share } from "@capacitor/share";

export const Clip = () => {
  const dispatch = useDispatch();
  const { globalAudio, globalPos, listAudios } = useSelector(
    (state: any) => state.audio
  );

  const audioRef = useRef();

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
    onPause,
    onPlay,
  } = useAudio(
    audioRef,
    () => {},
    () => {}
  );

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

  const onShareLink = async () => {
    await Share.share({
      title: "¡Tienes que escuchar esto en Mente360!",
      text: "Este audio en Mente360 está transformando mi día. Escuchalo también. ¡Se que te va a encantar!",
      url: baseURL + "audios/" + btoa(globalAudio.id),
      dialogTitle: "Invita a tus amigos a escuchar este audio y descubrir Mente360.",
    });
  };

  useEffect(() => {
    onPlay();
    dispatch(setShowGlobalAudio(false));
  }, [globalAudio]);

  return (
    <div className={styles["ion-content"]}>
      <IonCard className={styles.card}>
        <img alt="Silhouette of mountains" src={baseURL + globalAudio.imagen} />

        <IonCardHeader className="ion-no-padding">
          <IonCardSubtitle className="ion-no-padding">
            <IonText> &nbsp; </IonText>
            <IonText> {globalAudio.titulo} </IonText>
            <IonIcon className={`${styles["share-icon"]}`} onClick={onShareLink} icon={shareSocial} />
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
            onTimeUpdate={onTimeUpdate}
            onProgress={onUpdateBuffer}
            onEnded={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToNext();
            }}
            src={baseURL + globalAudio.audio}
          />

          <img src="assets/images/logo_texto.png" style={{width: '90px', display: 'block', marginTop: '50px', marginLeft: 'auto', marginRight: 'auto'}} />
        </IonCardContent>
      </IonCard>
    </div>
  );
};
