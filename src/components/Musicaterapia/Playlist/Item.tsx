import styles from "../Musicaterapia.module.scss";
import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonLabel,
  IonSkeletonText,
  useIonActionSheet,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import {
  ellipsisVertical,
  heart,
  heartOutline,
  pauseCircle,
  playCircle,
  shareSocial,
  trashOutline,
} from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setAudioSrc,
  setGlobalAudio,
  setGlobalPos,
  setListAudios,
  setIsGlobalPlaying,
} from "@/store/slices/audioSlice";
import { getUser } from "@/helpers/onboarding";
import { useHistory } from "react-router";
import { trash } from "@/services/playlist";
import { dislike, like } from "@/services/likes";
import { useAudio } from "@/hooks/useAudio";

export const Item: React.FC<any> = ({
  item,
  idx,
  playlist,
  setPlaylist,
  setFilteredPlaylist,
  onGetPlaylist,
}) => {
  const { user } = getUser();
  const history = useHistory();
  const dispatch = useDispatch();

  const { baseURL, globalAudio, isGlobalPlaying } = useSelector(
    (state: any) => state.audio
  );

  const [isLoading, setIsLoading] = useState(true);

  const [presentSheet, dismissSheet] = useIonActionSheet();
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const audioRef = useRef();

  const { onShareLink } = useAudio(
    audioRef,
    () => {},
    () => {}
  );

  const hasMyLike = (likes: any[]) => {
    const hasLike = likes.find((item) => item.users_id == user?.id);
    return hasLike;
  };

  const onPlay = (idx: number, item: any) => {
    dispatch(setListAudios(playlist.map((clip: any) => clip.clip)));

    dispatch(setAudioSrc(item.clip.audio));
    dispatch(setGlobalAudio(item.clip));
    dispatch(setGlobalPos(idx));

    dispatch(setIsGlobalPlaying(true));
  };

  const onPause = () => {
    dispatch(setIsGlobalPlaying(false));
  };

  const onTrash = async (id: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      await trash(id);
      onGetPlaylist();
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

  const goToClip = async () => {
    await dismissSheet();
    history.replace("/musicaterapia/clip");
  };

  const onDislike = async (idx: number, audio: any, likes: any) => {
    try {
      present({
        message: "Cargando ...",
      });

      const updatedPlaylist = [...playlist];

      const userClip = hasMyLike(likes);

      await dislike(userClip?.id);

      const updatedLikes = updatedPlaylist[idx].clip?.likes.filter(
        (item: any) => item.id !== userClip?.id
      );

      updatedPlaylist[idx].clip = {
        ...updatedPlaylist[idx].clip,
        likes: updatedLikes,
      };

      setPlaylist([...updatedPlaylist]);
      setFilteredPlaylist([...updatedPlaylist]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            likes: updatedPlaylist[idx].clip?.likes,
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

      const updatedPlaylist = [...playlist];

      const data = {
        clips_id: id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await like(data);

      const updateLikes = [
        ...updatedPlaylist[idx].clip?.likes,
        {
          users_id: user.id,
          clips_id: id,
          id: added.id,
        },
      ];

      updatedPlaylist[idx].clip = {
        ...updatedPlaylist[idx].clip,
        likes: updateLikes,
      };

      setPlaylist([...updatedPlaylist]);
      setFilteredPlaylist([...updatedPlaylist]);

      if (globalAudio?.id == audio.id) {
        dispatch(
          setGlobalAudio({
            ...audio,
            likes: updatedPlaylist[idx].clip?.likes,
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

  const onPresentSheet = async (idx: number, playlist: any) => {
    const isInMyLikes = hasMyLike(playlist.clip?.likes);

    const action = await presentSheet({
      cssClass: "custom-action-sheet",
      header: playlist.clip?.titulo,
      subHeader: playlist.clip?.categoria?.categoria,
      buttons: [
        {
          text:
            playlist.clip?.likes.length > 0
              ? playlist.clip?.likes.length + " Me gusta"
              : "Me gusta",
          icon: isInMyLikes ? heart : heartOutline,
          handler: () =>
            isInMyLikes
              ? onDislike(idx, playlist.clip, playlist.clip?.likes)
              : onLike(idx, playlist.clip, playlist.clip?.id),
        },
        {
          text: "Remover de mi playlist",
          icon: trashOutline,
          handler: () => onTrash(playlist.id),
        },
        {
          text: "Compartir",
          icon: shareSocial,
          handler: () => onShareLink(playlist.clip?.id),
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
        avatar.src = baseURL + playlist.clip?.imagen; // URL del avatar
        avatar.alt = "Avatar";
        avatar.classList.add("avatar");

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");

        const title = document.createElement("span");
        title.textContent = playlist.clip?.titulo;
        title.classList.add("title");

        const subTitle = document.createElement("span");
        subTitle.textContent = playlist.clip?.categoria?.categoria || "";
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
    item.clip && (
      <IonItem key={idx} button={true} className="ion-margin-bottom">
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
            src={baseURL + item.clip?.imagen}
            style={{ display: isLoading ? "none" : "block" }}
            onLoad={() => setIsLoading(false)}
          />
        </IonAvatar>

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

        {globalAudio?.id == item.clip?.id && isGlobalPlaying ? (
          <IonIcon
            aria-hidden="true"
            slot="end"
            icon={pauseCircle}
            onClick={onPause}
          />
        ) : (
          <IonIcon
            aria-hidden="true"
            slot="end"
            icon={playCircle}
            onClick={() => onPlay(idx, item)}
          />
        )}

        <IonIcon
          aria-hidden="true"
          slot="end"
          icon={ellipsisVertical}
          onClick={() => onPresentSheet(idx, item)}
        />
      </IonItem>
    )
  );
};
