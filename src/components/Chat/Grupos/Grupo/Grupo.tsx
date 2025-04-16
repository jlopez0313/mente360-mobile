import { getUser } from "@/helpers/onboarding";
import { sendPush } from "@/services/push";
import {
  addData,
  readData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
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
import { onValue } from "firebase/database";
import { sendOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Grupo.module.scss";
import { Item } from "./Item";

export const Grupo: React.FC<any> = ({ grupoID, grupo, removed }) => {
  const { user } = getUser();
  const [mensaje, setMensaje] = useState("");

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messagesList, setMessagesList] = useState<any>([]);
  const [usuarios, setUsuarios] = useState<any>([]);

  const onGetChat = async () => {
    onValue(readData("users"), (snapshot) => {
      const lista = snapshotToArray(snapshot.val());
      setUsuarios(lista);
    });
    
    onValue(readData("grupos/" + grupoID + "/messages"), (snapshot) => {
      const messagesList = snapshotToArray(snapshot.val());
      setMessagesList(messagesList);
    });
  };

  const onSendMessage = async () => {
    try {
      const fecha = new Date();

      const message = {
        user: user.id,
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: fecha.toISOString(),
        mensaje,
      };

      setMensaje("");

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

      await Promise.all([
        addData(`grupos/${grupoID}/messages`, message),
        writeData(`grupos/${grupoID}/users/${user.id}/writing`, false),
        sendPushPromise,
      ]);
    } catch (error) {
      console.error("Error enviando mensaje al grupo:", error);
    }
  };

  const onCheckInput = async (e: any) => {
    setMensaje(e.target.value);

    const writingStatus = e.target.value ? true : false;
    await writeData(
      `grupos/${grupoID}/users/${user.id}/writing`,
      writingStatus
    );
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
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messagesList, isScrolledUp]);

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
            return <Item key={idx} msg={msg} usuarios={usuarios} />;
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
                onIonInput={onCheckInput}
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
