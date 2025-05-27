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
  starOutline,
  trashBinOutline,
  trashOutline,
} from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import AudioProgressCircle from "@/components/Shared/Animations/ProgressCircle/ProgressCircle";
import MusicBar from "@/components/Shared/MusicBar/MusicBar";
import ClipsDB from "@/database/clips";
import LikesDB from "@/database/likes";
import PlaylistDB from "@/database/playlist";
import { useAudio } from "@/hooks/useAudio";
import { dislike, like } from "@/services/likes";
import { add, trash } from "@/services/playlist";

export const Item: React.FC<any> = ({
  idx,
  item,
  sqlite,
  network,
  onSetClips,
}) => {
  const { db, performSQLAction } = sqlite;

  const { user } = useSelector( (state: any) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const { baseURL, globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const audioRef = useRef();

  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const [presentSheet, dismissSheet] = useIonActionSheet();

  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);

  const { onShareLink, downloadAudio, deleteAudio, getDownloadedAudio } =
    useAudio(
      audioRef,
      () => { },
      () => { }
    );

  const onPlayClicked = async () => {
    console.log(item);

    if (!globalAudio || item.id != globalAudio.id) {
      if (item.audio_local) {
        const audioBlob = await getDownloadedAudio(item.audio_local);
        dispatch(setAudioSrc(audioBlob));
      } else {
        dispatch(setAudioSrc(baseURL + item.audio));
      }
      dispatch(setGlobalAudio(item));
      dispatch(setGlobalPos(idx));
    }

    dispatch(setIsGlobalPlaying(true));
  };

  const onDoPause = () => {
    dispatch(setIsGlobalPlaying(false));
  };

  const onTrashFromPlaylist = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(item.in_my_playlist);

      const playlistDB = new PlaylistDB(db);
      await playlistDB.delete(performSQLAction, () => { }, item.in_my_playlist);

      const newItem = {
        ...item,
        in_my_playlist: null,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio({ newItem }));
      }

      onSetClips(idx, newItem);
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

  const onAddToPlaylist = async () => {
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
      } = await add(data);

      const playlistDB = new PlaylistDB(db);
      await playlistDB.create(performSQLAction, () => { }, [
        {
          id: added.id,
          clip: {
            id: item.id,
          },
          user: {
            id: user.id,
          },
        },
      ]);

      const newItem = {
        ...item,
        in_my_playlist: added.id,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio(newItem));
      }

      onSetClips(idx, newItem);
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

      await dislike(item.my_like);

      const likes = new LikesDB(db);
      await likes.delete(performSQLAction, () => { }, item.my_like);

      const newItem = {
        ...item,
        all_likes: item.all_likes - 1,
        my_like: null,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio(newItem));
      }

      onSetClips(idx, newItem);

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

      const likesDB = new LikesDB(db);
      await likesDB.create(performSQLAction, () => { }, [
        {
          ...data,
          id: added.id,
        },
      ]);

      const newItem = {
        ...item,
        all_likes: item.all_likes + 1,
        my_like: added.id,
      };

      if (globalAudio?.id == item.id) {
        dispatch(setGlobalAudio(newItem));
      }

      onSetClips(idx, newItem);
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
          setPercent(p)
          console.log("P es ", p);
        }
      );
      /*
      const ruta = "RUTA__RUTA";
      */
      console.log("Ruta es ", ruta);
      setPercent(0)

      const clipsDB = new ClipsDB(db);
      await clipsDB.download(performSQLAction, () => { }, {
        id: item.id,
        imagen: item.imagen,
        audio: ruta,
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
    const clipsDB = new ClipsDB(db);
    await clipsDB.unload(performSQLAction, () => { }, { id: item.id });

    await deleteAudio(item.audio_local);

    dispatch(
      setAudioItem({
        index: idx,
        newData: {
          imagen_local: null,
          audio_local: null,
          downloaded: 0,
        },
      })
    );

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
    await presentSheet({
      cssClass: "custom-action-sheet",
      header: item.titulo,
      subHeader: item.categoria,
      buttons: [
        {
          disabled: !network.status,
          text: item.all_likes > 0 ? item.all_likes + " Me gusta" : "Me gusta",
          icon: item.my_like ? heart : heartOutline,
          handler: () => (item.my_like ? onDislike() : onLike()),
        },
        {
          disabled: !network.status,
          text: item.in_my_playlist
            ? "Remover de mi playlist"
            : "Agregar a mi playlist",
          icon: item.in_my_playlist ? trashOutline : starOutline,
          handler: () =>
            item.in_my_playlist ? onTrashFromPlaylist() : onAddToPlaylist(),
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
        subTitle.textContent = item.categoria || "";
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
      className={globalAudio?.id == item.id ? styles["current-playing"] : ""}
    >
      <IonAvatar
        slot="start"
        onClick={() =>
          globalAudio?.id == item?.id && isGlobalPlaying
            ? onDoPause()
            : onPlayClicked()
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
          src={network.status ? baseURL + item.imagen : AudioNoWifi}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />

        {globalAudio?.id == item.id && (
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
          globalAudio?.id == item?.id && isGlobalPlaying
            ? onDoPause()
            : onPlayClicked()
        }
      >
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
        <span className={styles["categoria"]}> {item.categoria} </span>
      </div>

      {
        percent > 0 &&
        <AudioProgressCircle />
      }


      <IonIcon
        aria-hidden="true"
        slot="end"
        icon={ellipsisVertical}
        onClick={() => onPresentSheet()}
      />
    </IonItem>
  );
}
