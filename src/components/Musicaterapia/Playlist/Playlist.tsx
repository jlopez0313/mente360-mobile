import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import {
  pauseCircle,
  playCircle,
  shareSocialOutline,
  trashOutline,
} from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import styles from "../Musicaterapia.module.scss";

import { all, trash } from "@/services/playlist";
import UIContext from "@/context/Context";
import { getUser } from "@/helpers/onboarding";
import { useAudio } from "@/hooks/useAudio";
import { useDispatch, useSelector } from "react-redux";
import {
  resetStore,
  setAudioRef,
  setGlobalAudio,
  setGlobalPos,
  setListAudios,
  clearListAudios,
  setShowGlobalAudio,
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";

export const Playlist = () => {
  const { user } = getUser();

  const dispatch = useDispatch();
  const { audio, listAudios, globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [playlist, setPlaylist] = useState<any>([]);

  const onGetPlaylist = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const {
        data: { data },
      } = await all();

      setPlaylist(data);
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

  const onTrash = async (id: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(id);
      onGetPlaylist();
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

  const onPlay = (idx: number, item: any) => {
    dispatch(setListAudios(playlist.map((clip: any) => clip.clip)));

    dispatch(setAudioRef(item.clip.audio));
    dispatch(setGlobalAudio(item.clip));
    dispatch(setGlobalPos(idx));

    dispatch(setIsGlobalPlaying(true));
  };

  const onPause = ()=> {
    dispatch( setIsGlobalPlaying(false) )
  }

  const hasThisUser = (usuarios_clips: any[]) => {
    const hasUserClip = usuarios_clips?.find(
      (item) => item.users_id == user?.id
    );
    return hasUserClip;
  };

  const onUpdateList = () => {
    if (!listAudios.length) {
      dispatch(setListAudios(playlist.map((clip: any) => clip.clip)));
    }
    /*const hasClip = playlist.find( (item: any) => item.clip.id == globalAudio.id );

    if ( hasClip ) {
      const tmpClips = playlist.filter( (item: any) => item.id != hasClip.id)

      setListAudios( tmpClips.map( (clip: any ) => clip.clip ) );
      setPlaylist( tmpClips )
    } else {
      const userClip = hasThisUser(globalAudio.usuarios_clips);

      if ( userClip ) {
        const play = { clip: globalAudio, id: userClip.id, user: [ user ] }
        playlist.push( play )
        setListAudios( playlist.map( (clip: any ) => clip.clip ) )  
        setPlaylist( playlist )
      }
    }
    */
  };

  useEffect(() => {
    // dispatch(resetStore());
    onGetPlaylist();
    dispatch(setShowGlobalAudio(true));
  }, []);

  useEffect(() => {
    globalAudio && onUpdateList();
  }, [globalAudio]);

  return (
    <div className={styles["ion-content"]}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {playlist.map((item: any, idx: any) => {
          return (
            item.clip && (
              <IonItem key={idx} button={true} className="ion-margin-bottom">
                {globalAudio?.id == item.clip?.id && isGlobalPlaying ? (
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    icon={pauseCircle}
                    onClick={onPause}
                  />
                ) : (
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    icon={playCircle}
                    onClick={() => onPlay(idx, item)}
                  />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <IonLabel class={`ion-text-left ${styles["titulo"]}`}>
                    {" "}
                    {item.clip?.titulo}{" "}
                  </IonLabel>
                  <span className={styles["categoria"]}>
                    {" "}
                    {item.clip?.categoria?.categoria}{" "}
                  </span>
                </div>
                <IonIcon
                  aria-hidden="true"
                  slot="end"
                  icon={trashOutline}
                  onClick={() => onTrash(item.id)}
                />
              </IonItem>
            )
          );
        })}
      </IonList>
    </div>
  );
};
