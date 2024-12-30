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
import { useHistory } from "react-router";
import { useAudio } from "@/hooks/useAudio";
import { useDispatch, useSelector } from "react-redux";

import {
  setAudioRef,
  setGlobalAudio,
  setGlobalPos,
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";

import { startBackground } from "@/helpers/background";
import { create, toggle, destroy } from "@/helpers/musicControls";

export const Toast = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const { baseURL, audio, globalAudio, listAudios, globalPos, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const audioRef = useRef();

  const {
    progress,
    buffer,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onUpdateBuffer,
    onPause,
    onPlay,
  } = useAudio(
    audioRef,
    () => {}
  );

  const { user } = getUser();
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [hasClip, setHasClip] = useState<boolean>(false);

  const hasThisUser = (usuarios_clips: any[]) => {
    const hasUserClip = usuarios_clips?.find(
      (item) => item.users_id == user?.id
    );
    setHasClip(hasUserClip);
  };

  const onClear = () => {
    // setShowGlobalAudio( false );
    onPause();
    dispatch(setGlobalPos(0));
    dispatch(setGlobalAudio(""));
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

  const onTrash = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(hasClip?.id);

      const clip = {
        ...globalAudio,
        usuarios_clips: globalAudio.usuarios_clips.filter(
          (uc: any) => uc != hasClip
        ),
      };
      
      dispatch(setGlobalAudio(clip));
      // onGetClips();
    } catch (error: any) {
      console.error(error);
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const onAdd = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const formData = {
        clips_id: globalAudio.id,
        users_id: user.id,
      };

      const {
        data: { data },
      } = await add(formData);

      const updatedUsuariosClips = [
        ...globalAudio.usuarios_clips,
        {
          id: data.id,
          clips_id: data.clip.id,
          users_id: user.id,
        },
      ];
      
      const updatedGlobalAudio = {
        ...globalAudio,
        usuarios_clips: updatedUsuariosClips,
      };

      console.log(globalAudio);
      dispatch(setGlobalAudio({ ...updatedGlobalAudio }));
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
  };

  const goToClip = () => {
    history.replace("/musicaterapia/clip");
  };

  const onDoPlay = () => {
    dispatch(setIsGlobalPlaying(true));
  };

  const onDoPause = () => {
    dispatch(setIsGlobalPlaying(false));
  };

  useEffect(() => {
    onPause();
    onPlay();
  }, [audio]);

  useEffect(() => {
    startBackground()
    create( baseURL, globalAudio, onPlay, onPause, goToPrev, goToNext );
  }, [globalAudio])

  useEffect(() => {
    if ( isGlobalPlaying ) {
      onPlay();
    } else {
      onPause();
    }
  }, [isGlobalPlaying]);

  useEffect(() => {
    hasThisUser(globalAudio.usuarios_clips);
  }, [globalAudio.usuarios_clips]);

  return (
    <div className={`${styles["custom-toast"]}`}>
      <IonIcon
        onClick={onClear}
        aria-hidden="true"
        icon={closeCircle}
        className={`${styles["custom-close"]}`}
      />

      <IonItem lines="none" button={true} detail={false} onClick={goToClip}>
        <IonLabel class="ion-text-left"> {globalAudio.titulo} </IonLabel>

        <IonIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrev();
          }}
          aria-hidden="true"
          slot="end"
          icon={playSkipBack}
        />

        {isPlaying ? (
          <IonIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDoPause();
            }}
            aria-hidden="true"
            slot="end"
            icon={pauseCircle}
          ></IonIcon>
        ) : (
          <IonIcon
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDoPlay();
            }}
            aria-hidden="true"
            slot="end"
            icon={playCircle}
          ></IonIcon>
        )}

        <IonIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNext();
          }}
          aria-hidden="true"
          slot="end"
          icon={playSkipForward}
        />

        {hasClip ? (
          <IonIcon
            aria-hidden="true"
            slot="end"
            icon={star}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTrash();
            }}
          />
        ) : (
          <IonIcon
            aria-hidden="true"
            slot="end"
            icon={starOutline}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAdd();
            }}
          />
        )}

        <div className={`${styles["unread-indicator"]}`}>
          <IonProgressBar buffer={buffer} value={progress / 100} color="dark" />
        </div>
      </IonItem>

      <audio
        ref={ audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onProgress={onUpdateBuffer}
        onEnded={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToNext();
        }}
        src={audio}
      />
    </div>
  );
};
