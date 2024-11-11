import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from "@ionic/react";
import { addData, readData } from "@/services/realtime-db";
import styles from "./Grupo.module.scss";
import { add, send, sendOutline } from "ionicons/icons";
import { Modal } from "../../../Modal/Modal";
import { Add } from "../Add/Add";
import { create, getAll } from "@/services/grupos";
import { useHistory } from "react-router";
import { onValue } from "firebase/database";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";
import { sendPush } from "@/services/push";

export const Grupo = ({ grupoID, grupo, removed }) => {
  const { user } = getUser();
  const [mensaje, setMensaje] = useState("");
  const baseURL = import.meta.env.VITE_BASE_BACK;

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

  const onSendMessage = () => {
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

    addData("grupos/" + grupoID + "/messages", message)
    .then( async () => {

      const otherUsers = grupo.users.filter( (x: any) => x.id != user.id ) || []
      
      await sendPush({
        users_id: otherUsers,
        title: grupo.grupo,
        description: user.name + ': ' + message,
        grupo: grupoID
      });

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
                {msg.user.id !== user.id && (
                  <IonAvatar aria-hidden="true" slot="start">
                    <img
                      alt=""
                      src={msg.user.photo ? baseURL + msg.user.photo : Avatar}
                    />
                  </IonAvatar>
                )}
                <div>
                  {msg.user.id !== user.id && (
                    <span className={styles["name"]}> {msg.user.name} </span>
                  )}
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

      {removed ? (
        <IonRow>
          <IonCol size="12" className="ion-text-center">
            <i style={{ margin: "0 auto" }}> Saliste del grupo </i>
          </IonCol>
        </IonRow>
      ) : (
        <IonRow className={styles["chatbox"]}>
          <IonCol size="10">
            <IonItem>
              <IonInput
                placeholder="Mensaje..."
                onIonInput={(e) => setMensaje(e.target.value)}
                value={mensaje}
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
