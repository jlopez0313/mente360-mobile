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
  IonText,
  IonTextarea,
} from "@ionic/react";
import { onValue } from "firebase/database";
import { close, sendOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Grupo.module.scss";
import { Item } from "./Item";

export const Grupo: React.FC<any> = ({ grupoID, grupo, removed }) => {
  const { user } = useSelector((state: any) => state.user);
  const [mensaje, setMensaje] = useState("");
  const [replyTo, setReplyTo] = useState<any>(null);

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messagesList, setMessagesList] = useState<any>([]);
  const [usuarios, setUsuarios] = useState<any>([]);
  const [otherUser, setOtherUser] = useState<any>({});

  const onGetOtherUser = () => {
    setOtherUser(
      replyTo?.reply?.from == user.id
        ? { name: "Tu" }
        : usuarios.find((u: any) => u.id == replyTo?.reply?.from) ?? {}
    );
  };

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
        reply: {
          from: replyTo?.user ?? null,
          mensaje: replyTo?.mensaje ?? null,
          index: replyTo?.index ?? null,
        },
      };

      setMensaje("");
      setReplyTo(null);

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

      requestAnimationFrame(() => scrollToBottom());
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
        behavior: "auto",
      });
    }
  };

  const handleScroll = (e: any) => {
    const element = e.target;
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 50;
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
    onGetOtherUser();
  }, [replyTo]);

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
              <Item
                key={idx}
                idx={idx}
                msg={msg}
                usuarios={usuarios}
                grupoID={grupoID}
                setReplyTo={setReplyTo}
              />
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
              <div className={styles["wrapper"]}>
                {replyTo && (
                  <div className={styles["reply-bar"]}>
                    <IonText
                      color="medium"
                      className={`ion-text-truncate ${styles["name"]}`}
                    >
                      {otherUser.name}
                    </IonText>
                    <IonText color="medium" className="ion-text-truncate">
                      {replyTo.mensaje}
                    </IonText>
                    <IonIcon icon={close} onClick={() => setReplyTo(null)} />
                  </div>
                )}
                <IonTextarea
                  rows={1}
                  placeholder="Mensaje..."
                  onIonInput={onCheckInput}
                  value={mensaje}
                  autoGrow={true}
                />
              </div>
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
