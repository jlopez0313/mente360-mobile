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
import { sendOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Interno.module.scss";

export const Interno: React.FC<any> = ({ roomID }) => {
  const { user } = useSelector( (state: any) => state.user);
  const [mensaje, setMensaje] = useState("");

  const chatListRef = useRef<HTMLIonListElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [messagesList, setMessagesList] = useState<any>([]);

  const onGetChat = async () => {
    onValue(readData("rooms/" + roomID + "/messages"), (snapshot) => {
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
        writeData(`rooms/${roomID}/users/${user.id}/writing`, false),
        sendPushPromise,
      ]);
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  const onCheckInput = async (e: any) => {
    setMensaje(e.target.value);

    const writingStatus = e.target.value ? true : false;
    await writeData(`rooms/${roomID}/users/${user.id}/writing`, writingStatus);
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
        className={`ion-padding`}
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
                  msg.user === user.id ? styles["sender"] : styles["receiver"]
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
