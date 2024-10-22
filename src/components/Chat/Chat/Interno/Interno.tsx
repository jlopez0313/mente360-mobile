import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTextarea,
} from "@ionic/react";
import { addData, readData } from "@/services/realtime-db";
import styles from "./Interno.module.scss";
import { add, send, sendOutline } from "ionicons/icons";
import { Modal } from "../../../Modal/Modal";
import { Add } from "../Add";
import { create, getAll } from "@/services/grupos";
import { useHistory } from "react-router";
import { onValue } from "firebase/database";
import { getUser } from "@/helpers/onboarding";

export const Interno = ({ roomID }) => {
  const { user } = getUser();
  const [mensaje, setMensaje] = useState("");

  const [messagesList, setMessagesList] = useState<any>([]);

  const onGetChat = async () => {


    onValue(readData("rooms/"+roomID+"/messages"), (snapshot) => {
      const data = snapshot.val();

      const messagesList = data
      ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
      : [];
      setMessagesList(messagesList);
    });

  };

  const onSendMessage = () => {
    const message = {
      user: {id: user.id, photo: user.photo, name: user.name},
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mensaje,
    };

    addData("rooms/"+roomID+"/messages", message).then(() => {
      setMensaje("");
    });
  };

  useEffect(() => {
    onGetChat();
  }, []);

  return (
    <div className={`${styles["ion-content"]}`}>
      <IonList className={`ion-padding ${styles["chat"]}`} lines="none">
        <IonItemGroup>
          {messagesList.map((msg: any, idx: number) => {
            return (
              <IonItem
                key={idx}
                button={true}
                className={`ion-margin-bottom ${styles["message"]} ${
                  msg.user.id === user.id
                    ? styles["sender"]
                    : styles["receiver"]
                } `}
              >
                <IonText className={styles["message"]}> {msg.mensaje} </IonText>
                <span className={styles["time"]}> {msg.hora} </span>
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
              onIonInput={(e) => setMensaje(e.detail.value)}
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
