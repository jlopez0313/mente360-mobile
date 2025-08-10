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
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";

import {
  downloadOutline,
  ellipsisVertical,
  heart,
  heartOutline,
  musicalNotesOutline,
  shareSocial,
  trashBinOutline,
  trashOutline,
} from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import MusicBar from "@/components/Shared/MusicBar/MusicBar";
// import ClipsDB from "@/database/clips";
import Likes from "@/database/likes";
import { useAudio } from "@/hooks/useAudio";
import { db } from '@/hooks/useDexie';
import { dislike, like } from "@/services/likes";
import { trash } from "@/services/playlist";
import { useLiveQuery } from "dexie-react-hooks";

export const Item: React.FC<any> = ({
  idx,
  item,
  network,
}) => {
  const { user } = useSelector( (state: any) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const { baseURL, globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const in_my_playlist = useLiveQuery(
    () =>
      db.playlist
        .where("users_id")
        .equals(user.id)
        .and((playlist: any) => playlist?.clip?.id === globalAudio.id)
        .first(),
    [globalAudio]
  );

  const likes = useLiveQuery(() =>
    db.likes.where("clips_id").equals(item.id).toArray()
  );

  const my_like = useLiveQuery(() =>
    db.likes
      .where("users_id")
      .equals(user.id)
      .and((like: Likes) => like.clips_id === item.id)
      .first()
  );

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

  const onPlay = async () => {
    if (item.audio_local) {
      const audioBlob = await getDownloadedAudio(item.audio_local);
      dispatch(setAudioSrc(audioBlob));
    } else {
      dispatch(setAudioSrc(baseURL + item.audio));
    }

    dispatch(setGlobalAudio(item));
    dispatch(setGlobalPos(idx));
    dispatch(setIsGlobalPlaying(true));
  };

  const onPause = () => {
    dispatch(setIsGlobalPlaying(false));
  };

  const onTrash = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(in_my_playlist?.id ?? 0);
      await db.playlist.where('id').equals(in_my_playlist?.id ?? 0).delete();

      const newItem = {
        ...item,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio(newItem));
      }
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

  const onDislike = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await dislike(my_like?.id ?? 0);
      await db.likes.where("id").equals(my_like?.id ?? 0).delete();

      const newItem = {
        ...item,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio(newItem));
      }

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

  const onLike = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const data = {
        clips_id: item.id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await like(data);

      await db.likes.add({
        ...data,
        id: added.id,
      });

      const newItem = {
        ...item,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio(newItem));
      }

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

  const onDownload = async () => {
    try {
      await dismissSheet();
      onPresentToast(
        "bottom",
        "Descargando " + item.titulo + "...",
        downloadOutline
      );

      const ruta = await downloadAudio(
        baseURL + item.audio,
        "audio_" + item.id,
        async (p: any) => {
          console.log("P es ", p);
        }
      );
      /*
      const ruta = "RUTA__RUTA";
      */
      console.log("Ruta es ", ruta);
      
      await db.clips.update(item.id, {
        imagen_local: item.imagen,
        audio_local: ruta,
        downloaded: 1,
      });

      dispatch(
        setAudioItem({
          index: idx,
          newData: {
            imagen_local: item.imagen,
            audio_local: ruta,
            downloaded: 1,
          },
        })
      );

      onPresentToast(
        "bottom",
        item.titulo + " está listo para escucharse sin conexión.",
        musicalNotesOutline
      );
    } catch (error) {
      console.log(" error ondownload", error);
    }
  };

  const onRemoveLocal = async () => {

    await db.crecimientos.update(item.id, {
      imagen_local: "",
      audio_local: "",
      downloaded: 0,
    });

    await deleteAudio(item.audio_local);

    onPresentToast(
      "bottom",
      item.titulo + " ha sido eliminado de tu biblioteca.",
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

  const onPresentSheet = async () => {
    const action = await presentSheet({
      cssClass: "custom-action-sheet",
      header: item.titulo,
      subHeader: item.categoria?.categoria ?? '',
      buttons: [
        {
          disabled: !network.status,
          text: likes && likes.length > 0 ? likes.length + " Me gusta" : "Me gusta",
          icon: my_like ? heart : heartOutline,
          handler: () => (my_like ? onDislike() : onLike()),
        },
        {
          disabled: !network.status,
          text: "Remover de mi playlist",
          icon: trashOutline,
          handler: () => onTrash(),
        },
        {
          disabled: !network.status,
          text: "Compartir",
          icon: shareSocial,
          handler: () => onShareLink(item.id),
        },
        {
          disabled: !network.status && !item.audio_local,
          text: item.audio_local
            ? "Eliminar de mis descargas"
            : "Descargar esta canción",
          icon: item.audio_local ? trashBinOutline : downloadOutline,
          handler: () => (item.audio_local ? onRemoveLocal() : onDownload()),
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

        if (network.status) {
          avatar.src = baseURL + item.imagen;
        } else {
          avatar.src = AudioNoWifi;
        }

        avatar.alt = "Avatar";
        avatar.classList.add("avatar");

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");

        const title = document.createElement("span");
        title.textContent = item.titulo;
        title.classList.add("title");

        const subTitle = document.createElement("span");
        subTitle.textContent = item.categoria?.categoria ?? '';
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
    <IonItem
      disabled={!network.status && !item.audio_local}
      button={true}
      className={globalAudio?.id == item?.id ? styles["current-playing"] : ""}
    >
      <IonAvatar
        slot="start"
        onClick={() =>
          globalAudio?.id == item?.id && isGlobalPlaying ? onPause() : onPlay()
        }
      >
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
          src={network.status ? baseURL + item?.imagen : AudioNoWifi}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />

        {globalAudio?.id == item?.id && (
          <MusicBar className={styles["music-bar"]} paused={!isGlobalPlaying} />
        )}
      </IonAvatar>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
        onClick={() =>
          globalAudio?.id == item?.id && isGlobalPlaying ? onPause() : onPlay()
        }
      >
        <IonLabel class={`ion-text-left ${styles["titulo"]}`}>
          {item?.downloaded ? (
            <IonIcon
              icon={downloadOutline}
              className={`${styles["downloaded"]}`}
              slot="start"
            />
          ) : null}
          {item?.titulo}{" "}
        </IonLabel>
        <span className={styles["categoria"]}> {item?.categoria?.categoria} </span>
      </div>

      <IonIcon
        aria-hidden="true"
        slot="end"
        icon={ellipsisVertical}
        onClick={() => onPresentSheet()}
      />
    </IonItem>
  );
};
