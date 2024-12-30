import React, { useEffect, useState } from "react";
import styles from "./Chat.module.scss";
import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
} from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { getUser } from "@/helpers/onboarding";
import { getData, writeData, readData } from "@/services/realtime-db";
import { onValue, off } from "firebase/database";
import { setRoom } from "@/store/slices/notificationSlice";

import Avatar from "@/assets/images/avatar.jpg";
import { useDispatch } from "react-redux";

export const Chat = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const { user } = getUser();

  const dispatch = useDispatch();

  const [isWriting, setIsWriting] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadList, setUnreadList] = useState([]);

  const goToInterno = async (otroUser: any) => {
    try {
      const roomArray = [Number(user.id), Number(otroUser.id)];
      const roomID = roomArray.sort((a, b) => a - b).join("_");

      await Promise.all([
        writeData(`rooms/${roomID}/users/${user.id}`, {
          id: user.id,
          name: user.name,
          photo: user.photo || "",
          phone: user.phone || "",
        }),

        writeData(`rooms/${roomID}/users/${otroUser.id}`, {
          id: otroUser.id,
          name: otroUser.name,
          photo: otroUser.photo || "",
          phone: otroUser.phone || "",
        }),

        writeData(`user_rooms/${user.id}/rooms/${roomID}`, true),

        writeData(`user_rooms/${otroUser.id}/rooms/${roomID}`, true),
      ]);

      history.replace(`/chat/${roomID}`);
    } catch (error) {
      console.error("Error creando la sala de chat:", error);
    }
  };

  const onGetRooms = async () => {
    onValue(readData(`user_rooms/${user.id}/rooms`), async (snapshot) => {
      const data = snapshot.val();

      const rooms: any = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];

      const usuarios = [];
      const mensajes = [];
      const noLeidos = [];

      await Promise.all([
        rooms.map(async (room, idx) => {
          const data = await getData(`rooms/${room.id}/users`);
          const val = data.val();

          const listaUsuarios: any = val
            ? Object.keys(val).map((key) => ({
                id: key,
                ...val[key],
              }))
            : [];

          usuarios[idx] = listaUsuarios.find((u) => u.id != user.id);

          onValue(readData(`rooms/${room.id}`), (snapshot) => {
            const data2 = snapshot.val();

            const escribiendo = [...isWriting];
            escribiendo[idx] = data2[usuarios[idx].id]?.writing;
            setIsWriting(escribiendo);

            const listaMensajes: any = data2
              ? Object.keys(data2.messages).map((key) => ({
                  id: key,
                  ...data2.messages[key],
                }))
              : [];

            if (data2[user.id]?.exit_time) {
              const targetDate = new Date(data2[user.id]?.exit_time);

              const unreads: any = listaMensajes.filter((message) => {
                const messageDate = new Date(`${message.date}`);
                return messageDate > targetDate && message.user.id != user.id;
              });

              noLeidos[idx] = unreads.length || 0;
            }

            const lastMsg = listaMensajes.pop();

            if (lastMsg) {
              mensajes[idx] = { ...lastMsg };
            }
          });
        }),
      ]);

      setUnreadList([...noLeidos]);
      setMessages([...mensajes]);
      setUsers(usuarios);
    });
  };

  const onCheckUnreads = () => {
    const noUnreads = unreadList.every((x) => x === 0);
    if (noUnreads) {
      dispatch(setRoom(false));
    }
  };

  useEffect(() => {
    onGetRooms();
  }, []);

  useEffect(() => {
    onCheckUnreads();
  }, [unreadList]);

  return (
    <div className={styles["ion-content"]}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["search"]}`}
            placeholder="Buscar"
            color="warning"
          ></IonSearchbar>

          {users.map((usuario, idx) => {
            return (
              usuario && (
                <IonItem
                  key={idx}
                  button={true}
                  className={`${styles["contact"]}`}
                  onClick={() => goToInterno(usuario)}
                >
                  <IonAvatar aria-hidden="true" slot="start">
                    <img
                      alt=""
                      src={usuario.photo ? baseURL + usuario.photo : Avatar}
                    />
                  </IonAvatar>
                  <IonLabel className="ion-no-margin">
                    <span className={styles["name"]}> {usuario?.name} </span>
                    <span className={styles["phone"]}>
                      {" "}
                      {isWriting[idx]
                        ? "Escribiendo..."
                        : messages[idx]?.mensaje.length > 35
                        ? messages[idx]?.mensaje.substring(0, 32) + "..."
                        : messages[idx]?.mensaje}{" "}
                    </span>
                  </IonLabel>
                  <IonNote className={styles["note"]}>
                    <span className={styles["time"]}>
                      {" "}
                      {messages[idx]?.hora}{" "}
                    </span>
                    {unreadList[idx] ? (
                      <span className={styles["unreads"]}>
                        {" "}
                        {unreadList[idx]}{" "}
                      </span>
                    ) : null}
                  </IonNote>
                </IonItem>
              )
            );
          })}
        </IonItemGroup>
      </IonList>
    </div>
  );
};
