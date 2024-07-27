import {
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonProgressBar,
  IonToast,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { getUser } from "@/helpers/onboarding";
import { add, trash } from "@/services/playlist";

import styles from "./Toast.module.scss";
import {
  closeCircle,
  pauseCircle,
  pauseCircleOutline,
  playBack,
  playCircle,
  playCircleOutline,
  playForward,
  playSkipBack,
  playSkipForward,
  star,
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
    setShowGlobalAudio,
  }: any = useContext(UIContext);

  const { user } = getUser();
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [hasClip, setHasClip] = useState<boolean>( false)

  const hasThisUser = (usuarios_clips: any[]) => {
    const hasUserClip = usuarios_clips?.find( item => item.users_id == user?.id )
    setHasClip( hasUserClip )
  }

  const onClear = () => {
    // setShowGlobalAudio( false );
    onEnd();
    setGlobalPos(0);
    setGlobalAudio( null );
  }

  const goToPrev = async () => {
    onEnd();

    const prevIdx = globalPos == 0 ? listAudios.length - 1 : globalPos - 1;
    setGlobalPos(prevIdx);

    const next = listAudios[prevIdx];
    setGlobalAudio(next);
  };

  const goToNext = async () => {
    // onEnd();

    const nextIdx = globalPos == listAudios.length - 1 ? 0 : globalPos + 1;
    setGlobalPos(nextIdx);

    const next = listAudios[nextIdx];
    setGlobalAudio(next);
  };


  const onTrash = async () => {
    try {
      present({
        message: "Loading ...",
      });

      const userClip = hasThisUser(globalAudio.usuarios_clips);
      
      await trash( userClip?.id );
      
      const clip = {...globalAudio, usuarios_clips: globalAudio.usuarios_clips.filter( (uc: any) => uc != userClip ) }
      setGlobalAudio( clip );
      // onGetClips();

    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  }

  const onAdd = async () => {
    try {
      present({
        message: "Loading ...",
      });

      const formData = {
        clips_id: globalAudio.id,
        users_id: user.id
      }

      const {data: {data}} = await add( formData );
      
      globalAudio.usuarios_clips.push({ id: data.id, clips_id: data.clip.id, users_id: user.id });

      console.log( globalAudio );
      setGlobalAudio( { ...globalAudio } )

    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  }

  useEffect(() => {
    onPlay();
    hasThisUser(globalAudio.usuarios_clips)
  }, [globalAudio])

  return (
    <>
      <IonIcon
        onClick={onClear}
        aria-hidden="true"
        icon={closeCircle}
        className={`${styles["custom-close"]}`}
      />

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

        {
          hasClip ?
          <IonIcon aria-hidden="true" slot="end" icon={star} onClick={() => onTrash()} /> : 
          <IonIcon aria-hidden="true" slot="end" icon={starOutline} onClick={() => onAdd()}  />
        }

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
    </>
  );
};
