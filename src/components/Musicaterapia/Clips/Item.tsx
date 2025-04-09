import { setIsGlobalPlaying } from "@/store/slices/audioSlice";
import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonLabel,
  IonSkeletonText,
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import styles from "../Musicaterapia.module.scss";

import {
  setAudioItem,
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
} from "@/store/slices/audioSlice";

import { getUser } from "@/helpers/onboarding";
import {
  downloadOutline,
  ellipsisVertical,
  heart,
  heartOutline,
  musicalNotesOutline,
  pauseCircle,
  playCircle,
  shareSocial,
  starOutline,
  trashBinOutline,
  trashOutline,
} from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import ClipsDB from "@/database/clips";
import { useAudio } from "@/hooks/useAudio";
import { useNetwork } from "@/hooks/useNetwork";
import { dislike, like } from "@/services/likes";
import { add, trash } from "@/services/playlist";

export const Item: React.FC<any> = ({ idx, item, clips, sqlite, setClips }) => {
  const dispatch = useDispatch();

  const { db, performSQLAction } = sqlite;

  const { user } = getUser();
  const history = useHistory();
  const network = useNetwork();

  const audioRef = useRef();

  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [presentSheet, dismissSheet] = useIonActionSheet();

  const [isLoading, setIsLoading] = useState(true);

  const { onShareLink, downloadAudio, deleteAudio, getDownloadedAudio } =
    useAudio(
      audioRef,
      () => {},
      () => {}
    );

  const { baseURL, globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const hasThisUser = (usuarios_clips: any[]) => {
    const hasUserClip = usuarios_clips.find(
      (item) => item.users_id == user?.id
    );
    return hasUserClip;
  };

  const hasMyLike = (likes: any[]) => {
    const hasLike = likes.find((item) => item.users_id == user?.id);
    return hasLike;
  };

  const onPlayClicked = async (idx: number, audio: any) => {
    console.log(audio);

    if (!globalAudio || audio.id != globalAudio.id) {
      if (audio.audio_local) {
        const audioBlob = await getDownloadedAudio(audio.audio_local);
        dispatch(setAudioSrc(audioBlob));
      } else {
        dispatch(setAudioSrc(baseURL + audio.audio));
      }
      dispatch(setGlobalAudio(audio));
      dispatch(setGlobalPos(idx));
    }

    dispatch(setIsGlobalPlaying(true));
  };

  const onDoPause = () => {
    dispatch(setIsGlobalPlaying(false));
  };

  const onTrashFromPlaylist = async (idx: number, audio: any, usuarios_clips: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedClips = [...clips];

      const userClip = hasThisUser(usuarios_clips);

      await trash(userClip?.id);

      const updatedUsuariosClips = updatedClips[idx].usuarios_clips.filter(
        (item: any) => item.id !== userClip?.id
      );

      updatedClips[idx] = {
        ...updatedClips[idx],
        usuarios_clips: updatedUsuariosClips,
      };

      setClips([...updatedClips]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            usuarios_clips: updatedClips[idx].usuarios_clips,
          })
        );
      }

      // onGetClips();
    } catch (error: any) {
      console.log(error);

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

  const onAddToPlaylist = async (idx: number, audio: any, id: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedClips = [...clips];

      const data = {
        clips_id: id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await add(data);

      const updatedUsuariosClips = [
        ...updatedClips[idx].usuarios_clips,
        {
          users_id: user.id,
          clips_id: id,
          id: added.id,
        },
      ];

      updatedClips[idx] = {
        ...updatedClips[idx],
        usuarios_clips: updatedUsuariosClips,
      };

      setClips([...updatedClips]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            usuarios_clips: updatedClips[idx].usuarios_clips,
          })
        );
      }

      // onGetPlaylist();
    } catch (error: any) {
      console.log(error);

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

  const onDislike = async (idx: number, audio: any, likes: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedClips = [...clips];

      const userClip = hasMyLike(likes);

      await dislike(userClip?.id);

      const updatedLikes = updatedClips[idx].likes.filter(
        (item: any) => item.id !== userClip?.id
      );

      updatedClips[idx] = {
        ...updatedClips[idx],
        likes: updatedLikes,
      };

      setClips([...updatedClips]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            likes: updatedClips[idx].likes,
          })
        );
      }

      // onGetClips();
    } catch (error: any) {
      console.log(error);

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

  const onLike = async (idx: number, audio: any, id: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedClips = [...clips];

      const data = {
        clips_id: id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await like(data);

      const updateLikes = [
        ...updatedClips[idx].likes,
        {
          users_id: user.id,
          clips_id: id,
          id: added.id,
        },
      ];

      updatedClips[idx] = {
        ...updatedClips[idx],
        likes: updateLikes,
      };

      setClips([...updatedClips]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            likes: updatedClips[idx].likes,
          })
        );
      }

      // onGetPlaylist();
    } catch (error: any) {
      console.log(error);

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

  const onDownload = async (audio: any) => {
    try {
      await dismissSheet();
      onPresentToast(
        "bottom",
        "Descargando " + audio.titulo + "...",
        downloadOutline
      );
      
      const ruta = await downloadAudio(
        baseURL + audio.audio,
        "audio_" + audio.id,
        async (p: any) => {
          console.log("P es ", p);
        }
      );
      /*
      const ruta = "RUTA__RUTA";
      */
      console.log("Ruta es ", ruta);

      const clipsDB = new ClipsDB(db);
      await clipsDB.download(performSQLAction, () => {}, {
        id: audio.id,
        imagen: audio.imagen,
        audio: ruta,
      });

      dispatch(
        setAudioItem({
          index: idx,
          newData: {
            imagen_local: audio.imagen,
            audio_local: ruta,
            downloaded: 1,
          },
        })
      );

      onPresentToast(
        "bottom",
        audio.titulo + " está listo para escucharse sin conexión.",
        musicalNotesOutline
      );

    } catch (error) {
      console.log(" error ondownload", error);
    }
  };

  const onRemoveLocal = async (audio: any) => {
    const clipsDB = new ClipsDB(db);
    await clipsDB.unload(performSQLAction, () => {}, { id: audio.id });

    await deleteAudio(audio.audio_local);

    onPresentToast(
      "bottom",
      audio.titulo + " ha sido eliminado de tu biblioteca.",
      musicalNotesOutline
    );
  };

  const goToClip = async () => {
    await dismissSheet();
    history.replace("/musicaterapia/clip");
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

  const onPresentSheet = async (idx: number, audio: any) => {
    console.log(audio);
    const isInMyPlaylist = hasThisUser(audio.usuarios_clips);
    const isInMyLikes = hasMyLike(audio.likes);

    await presentSheet({
      cssClass: "custom-action-sheet",
      header: audio.titulo,
      subHeader: audio.categoria?.categoria,
      buttons: [
        {
          disabled: !network.status,
          text:
            audio.likes.length > 0
              ? audio.likes.length + " Me gusta"
              : "Me gusta",
          icon: isInMyLikes ? heart : heartOutline,
          handler: () =>
            isInMyLikes
              ? onDislike(idx, audio, audio.likes)
              : onLike(idx, audio, audio.id),
        },
        {
          disabled: !network.status,
          text: isInMyPlaylist
            ? "Remover de mi playlist"
            : "Agregar a mi playlist",
          icon: isInMyPlaylist ? trashOutline : starOutline,
          handler: () =>
            isInMyPlaylist
              ? onTrashFromPlaylist(idx, audio, audio.usuarios_clips)
              : onAddToPlaylist(idx, audio, audio.id),
        },
        {
          disabled: !network.status,
          text: "Compartir",
          icon: shareSocial,
          handler: () => onShareLink(audio.id),
        },
        {
          disabled: !network.status && !audio.audio_local,
          text: audio.audio_local
            ? "Eliminar de mis descargas"
            : "Descargar esta canción",
          icon: audio.audio_local ? trashBinOutline : downloadOutline,
          handler: () => (audio.audio_local ? onRemoveLocal(audio) : onDownload(audio)),
        },
      ],
    });

    setTimeout(() => {
      const actionSheetHeader = document.querySelector(
        ".custom-action-sheet .action-sheet-title"
      );

      if (actionSheetHeader && !document.querySelector(".header-container")) {
        const headerContainer = document.createElement("div");
        headerContainer.classList.add("header-container");

        const avatar = document.createElement("img");

        if ( network.status ) {
          avatar.src = baseURL + audio.imagen;
        } else {
          avatar.src = AudioNoWifi;
        }
        
        avatar.alt = "Avatar";
        avatar.classList.add("avatar");

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");

        const title = document.createElement("span");
        title.textContent = audio.titulo;
        title.classList.add("title");

        const subTitle = document.createElement("span");
        subTitle.textContent = audio.categoria?.categoria || "";
        subTitle.classList.add("sub-title");

        textContainer.appendChild(title);
        textContainer.appendChild(subTitle);

        headerContainer.appendChild(avatar);
        headerContainer.appendChild(textContainer);

        actionSheetHeader.innerHTML = "";
        actionSheetHeader.appendChild(headerContainer);

        actionSheetHeader.addEventListener("click", goToClip);
      }
    }, 100);
  };

  return (
    <IonItem button={true}>
      <IonAvatar slot="start">
        {isLoading && (
          <IonSkeletonText
            animated
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "5px",
            }}
          />
        )}

        <img
          alt=""
          src={network.status ? baseURL + item.imagen : AudioNoWifi}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <IonLabel className={`ion-text-left ${styles["titulo"]}`}>
          {item.downloaded ? (
            <IonIcon
              icon={downloadOutline}
              className={`${styles["downloaded"]}`}
              slot="start"
            />
          ) : null}
          {item.titulo}{" "}
        </IonLabel>
        <span className={styles["categoria"]}>
          {" "}
          {item.categoria?.categoria}{" "}
        </span>
      </div>
      {globalAudio?.id == item.id && isGlobalPlaying ? (
        <IonIcon
          aria-hidden="true"
          slot="end"
          icon={pauseCircle}
          onClick={onDoPause}
        />
      ) : (
        <IonIcon
          aria-hidden="true"
          slot="end"
          icon={playCircle}
          onClick={() => onPlayClicked(idx, item)}
        />
      )}

      <IonIcon
        aria-hidden="true"
        slot="end"
        icon={ellipsisVertical}
        onClick={() => onPresentSheet(idx, item)}
      />
    </IonItem>
  );
};
