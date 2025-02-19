import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonCol,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonList,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import { addData, readData } from "@/services/realtime-db";
import styles from "./Grupo.module.scss";
import { sendOutline } from "ionicons/icons";
import { onValue } from "firebase/database";
import { getUser } from "@/helpers/onboarding";
import { sendPush } from "@/services/push";
import { Item } from "./Item";

export const Grupo = ({ grupoID, grupo, removed }) => {
  const { user } = getUser();
  const [mensaje, setMensaje] = useState("");

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messagesList, setMessagesList] = useState<any>([]);

  const onGetChat = async () => {
    onValue(readData("grupos/" + grupoID + "/messages"), (snapshot) => {
      const data = snapshot.val();
      const messagesList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setMessagesList(messagesList);
    });
  };

  const onSendMessage = async () => {
    try {
      setMensaje("");
      const fecha = new Date();

      const message = {
        user: { id: user.id, photo: user.photo, name: user.name },
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: fecha.toISOString(),
        mensaje,
      };

      const addMessagePromise = addData(`grupos/${grupoID}/messages`, message);

      const otherUsers = grupo.users.filter((x: any) => x.id != user.id) || [];

      const sendPushPromise =
        otherUsers.length > 0
          ? sendPush({
              users_id: otherUsers.map((u: any) => u.id),
              title: grupo.grupo,
              description:
                (user.name + ": " + message.mensaje).length > 25
                  ? `${user.name}: ${message.mensaje.substring(0, 22)}...`
                  : `${user.name}: ${message.mensaje}`,
              grupo: grupoID,
            })
          : Promise.resolve();

      await Promise.all([addMessagePromise, sendPushPromise]);
    } catch (error) {
      console.error("Error enviando mensaje al grupo:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatListRef.current) {
      const scrollContainer = chatListRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (e: any) => {
    const element = e.target;
    const isAtBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    setIsScrolledUp(!isAtBottom);
  };
  
  useEffect(() => {
    if (!isScrolledUp) {
      setTimeout( () => {
        scrollToBottom();
      }, 100)
    }
  }, [messagesList])

  useEffect(() => {
    onGetChat();
  }, []);

  return (
    <div className={`${styles["ion-content"]}`}>
      <IonList
        ref={chatListRef}
        className={`ion-padding ${styles["chat"]}`}
        lines="none"
        onScroll={handleScroll}
      >
        <IonItemGroup>
          {messagesList.map((msg: any, idx: number) => {
            return (
              <Item key={idx} msg={msg} />
            );
          })}
        </IonItemGroup>
      </IonList>

      {removed ? (
        <IonRow>
          <IonCol size="12" className="ion-text-center">
            <i style={{ margin: "0 auto" }}> Saliste del grupo </i>
          </IonCol>
        </IonRow>
      ) : (
        <IonRow className={styles["chatbox"]}>
          <IonCol size="10">
            <IonItem lines="none">
              <IonTextarea
                rows={1}
                placeholder="Mensaje..."
                onIonInput={(e) => setMensaje(e.target.value)}
                value={mensaje}
                autoGrow={true}
              />
            </IonItem>
          </IonCol>
          <IonCol size="2">
            <IonButton disabled={!mensaje} onClick={onSendMessage}>
              <IonIcon icon={sendOutline} />
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </div>
  );
};
