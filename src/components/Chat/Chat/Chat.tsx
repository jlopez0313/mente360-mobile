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

import Avatar from "@/assets/images/avatar.jpg";

export const Chat = () => {
  
  const history = useHistory();
  const { user } = getUser();

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const goToInterno = async (otroUser: any) => {
    const roomArray = [Number(user.id), Number(otroUser.id)];
    const roomID = roomArray.sort((a, b) => a - b).join("_");

    await writeData("rooms/" + roomID + "/users/" + user.id, {
      id: user.id,
      name: user.name,
      photo: user.photo || "",
      phone: user.phone || "",
    });
    await writeData("rooms/" + roomID + "/users/" + otroUser.id, {
      id: otroUser.id,
      name: otroUser.name,
      photo: otroUser.photo || "",
      phone: otroUser.phone || "",
    });

    await writeData("user_rooms/" + user.id + "/rooms/" + roomID, true);
    await writeData("user_rooms/" + otroUser.id + "/rooms/" + roomID, true);

    history.replace("/chat/" + roomID);
  };

  const onGetRooms = async () => {
    onValue(readData(`user_rooms/${user.id}/rooms`), (snapshot) => {

      const data = snapshot.val();

      const rooms: any = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];

      rooms.forEach(async (room, idx) => {
        const data = await getData(`rooms/${room.id}/users`);
        const val = data.val();

        const listaUsuarios: any = val
          ? Object.keys(val).map((key) => ({
              id: key,
              ...val[key],
            }))
          : [];

        const usuarios = [...users];
        usuarios[idx] = listaUsuarios.find((u) => u.id != user.id);

        setUsers(usuarios);

        onValue(readData(`rooms/${room.id}/messages`), (snapshot) => {
          const data2 = snapshot.val();

          const listaMensajes: any = data2
            ? Object.keys(data2).map((key) => ({
                id: key,
                ...data2[key],
              }))
            : [];

          const lastMsg = listaMensajes.slice(-1);
          
          const mensajes = [...messages];
          mensajes[idx] = lastMsg[0]

          setMessages(mensajes);
        });
      });
    });
  };

  useEffect(() => {
    onGetRooms();
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["searc"]}`}
            placeholder="Buscar"
            color="warning"
          ></IonSearchbar>

          {users.map((usuario, idx) => {
            return (
              <IonItem
                key={idx}
                button={true}
                className={`${styles["contact"]}`}
                onClick={() => goToInterno(usuario)}
              >
                <IonAvatar aria-hidden="true" slot="start">
                  <img
                    alt=""
                    src="https://ionicframework.com/docs/img/demos/avatar.svg"
                  />
                </IonAvatar>
                <IonLabel className="ion-no-margin">
                  <span className={styles["name"]}> {usuario?.name} </span>
                  <span className={styles["phone"]}>
                    {" "}
                    {messages[idx]?.mensaje}{" "}
                  </span>
                </IonLabel>
              </IonItem>
            );
          })}

          <IonItem
            button={true}
            className={`ion-margin-bottom ${styles["contact"]}`}
          >
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt=""
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel className="ion-no-margin">
              <span className={styles["name"]}> {"GRUPO"} </span>
              <span className={styles["phone"]}> {"mensaje"} </span>
            </IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </div>
  );
};
