import { getUser } from "@/helpers/onboarding";
import { sendPush } from "@/services/push";
import { addData, readData, writeData } from "@/services/realtime-db";
import {
    IonButton,
    IonCol,
    IonIcon,
    IonItem,
    IonItemGroup,
    IonList,
    IonRow,
    IonText,
    IonTextarea
} from "@ionic/react";
import { onValue } from "firebase/database";
import { sendOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import styles from "./Interno.module.scss";

export const Interno = ({ roomID }) => {
  const { user } = getUser();
  const [mensaje, setMensaje] = useState("");

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messagesList, setMessagesList] = useState<any>([]);

  const onGetChat = async () => {
    onValue(readData("rooms/" + roomID + "/messages"), (snapshot) => {
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

      const otherUsers =
        roomID.split("_").filter((x: any) => x != String(user.id)) || [];

      const sendPushPromise =
        otherUsers.length > 0
          ? sendPush({
              users_id: otherUsers,
              title: user.name,
              description:
                message.mensaje.length > 25
                  ? message.mensaje.substring(0, 22) + "..."
                  : message.mensaje,
              room: roomID,
            })
          : Promise.resolve();

      await Promise.all([
        addData(`rooms/${roomID}/messages`, message),
        writeData(`rooms/${roomID}/${user.id}/writing`, false),
        sendPushPromise,
      ]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  const onCheckInput = async (e) => {
    setMensaje(e.target.value);

    const writingStatus = e.target.value ? true : false;

    await writeData(`rooms/${roomID}/${user.id}/writing`, writingStatus);
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
              <IonItem
                key={idx}
                button={true}
                className={`${styles["message"]} ${
                  msg.user.id === user.id
                    ? styles["sender"]
                    : styles["receiver"]
                } `}
              >
                <div>
                  <IonText className={styles["message"]}>
                    {" "}
                    {msg.mensaje}{" "}
                  </IonText>
                  <span className={styles["time"]}> {msg.hora} </span>
                </div>
              </IonItem>
            );
          })}
        </IonItemGroup>
      </IonList>

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
    </div>
  );
};
