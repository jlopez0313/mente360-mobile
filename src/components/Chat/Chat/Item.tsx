import Avatar from "@/assets/images/avatar.jpg";
import { Profile } from "@/components/Chat/Profile/Profile";
import { getDisplayDate } from "@/helpers/Fechas";
import {
  getArrayData,
  readData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import { IonAvatar, IonItem, IonNote, IonSkeletonText } from "@ionic/react";
import { onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Chat.module.scss";

export const Item: React.FC<any> = ({ usuario }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { user } = useSelector( (state: any) => state.user);

  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [lastMsg, setLastMsg] = useState<any>(null);
  const [isWriting, setIsWriting] = useState<any>(false);
  const [unreads, setUnreads] = useState<any>(0);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const goToInterno = async () => {
    try {
      const roomArray = [Number(user.id), Number(usuario.id)];
      const roomID = roomArray.sort((a, b) => a - b).join("_");

      await writeData(`users/${user.id}/rooms/${roomID}`, true);
      await writeData(`users/${usuario.id}/rooms/${roomID}`, true);
      await writeData(`rooms/${roomID}/users/${user.id}/exit_time`, null);

      history.replace(`/chat/${roomID}`);
    } catch (error) {
      console.error("Error creando la sala de chat:", error);
    }
  };

  const onCheckStatus = async () => {
    const roomID = [Number(user.id), Number(usuario.id)]
      .sort((a, b) => a - b)
      .join("_");

    const listaMensajes = await getArrayData(`rooms/${roomID}/messages`);
    const lastMsg = listaMensajes.pop();

    if (lastMsg) {
      setLastMsg(lastMsg);
    }

    onValue(readData(`rooms/${roomID}`), (snapshot) => {
      const data2 = snapshot.val();

      const escribiendo = data2.users[usuario.id]?.writing;
      setIsWriting(escribiendo);

      const listaMensajes: any = data2 ? snapshotToArray(data2.messages) : [];

      if (data2.users[user.id]?.exit_time) {
        const targetDate = new Date(data2.users[user.id]?.exit_time);

        const unreads: any = listaMensajes.filter((message: any) => {
          const messageDate = new Date(`${message.date}`);
          return messageDate > targetDate && message.user != user.id;
        });

        setUnreads(unreads.length ?? 0);
      }

      const lastMsg = listaMensajes.pop();

      if (lastMsg) {
        setLastMsg({ ...lastMsg });
      }
    });
  };

  const onCheckUnreads = () => {
    if (unreads == 0) {
      // dispatch(setRoom(false));
    }
  };

  useEffect(() => {
    onCheckStatus();
  }, []);

  useEffect(() => {
    onCheckUnreads();
  }, [unreads]);

  return (
    <IonItem button={true} className={`${styles["contact"]}`}>
      <IonAvatar
        aria-hidden="true"
        slot="start"
        onClick={() => setShowProfileModal(true)}
      >
        {isLoading && (
          <IonSkeletonText
            animated
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
            }}
          />
        )}
        <img
          alt=""
          src={usuario.photo ? baseURL + usuario.photo : Avatar}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>

      <div className={styles["item-content"]} onClick={() => goToInterno()}>
        <div className={styles["item-user"]}>
          <span className={styles["name"]}> {usuario?.name} </span>
          <span className={styles["phone"]}>
            {" "}
            {isWriting
              ? "Escribiendo..."
              : lastMsg &&
                (lastMsg.mensaje.length > 35
                  ? lastMsg.mensaje.substring(0, 32) + "..."
                  : lastMsg.mensaje)}{" "}
          </span>
        </div>
        <IonNote className={styles["note"]}>
          <span className={styles["time"]}>
            {" "}
            {lastMsg && lastMsg.date ? getDisplayDate(lastMsg.date) : null}{" "}
          </span>
          {unreads ? (
            <span className={styles["unreads"]}> {unreads} </span>
          ) : null}
        </IonNote>
      </div>

      {showProfileModal && (
        <Profile
          usuario={usuario}
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
        />
      )}
    </IonItem>
  );
};
