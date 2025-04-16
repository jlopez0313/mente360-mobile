import { getDisplayDate } from "@/helpers/Fechas";
import { getUser } from "@/helpers/onboarding";
import {
  getArrayData,
  getData,
  readData,
  snapshotToArray,
  writeData,
} from "@/services/realtime-db";
import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonNote,
  IonSkeletonText,
} from "@ionic/react";
import { onValue } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import styles from "./Grupos.module.scss";

export const Item: React.FC<any> = ({ grupo }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const { user } = getUser();

  const [isLoading, setIsLoading] = useState(true);
  const [lastMsg, setLastMsg] = useState<any>(null);
  const [unreads, setUnreads] = useState<any>(0);

  const goToGrupo = async () => {
    try {
      await writeData(`grupos/${grupo.id}/users/${user.id}/exit_time`, null);
      history.replace(`/grupo/${grupo.id}`);
    } catch (error) {
      console.error("Error creando el grupo de chat:", error);
    }
  };

  const onCheckStatus = async () => {
    const listaMensajes = await getArrayData(`grupos/${grupo.id}/messages`);
    const lastMsg = listaMensajes.pop();

    if (lastMsg) {
      const data = await getData(`users/${lastMsg.user}`);
      const userData = data.val();
      setLastMsg({ ...lastMsg, from: { ...userData } });
    }

    onValue(readData(`grupos/${grupo.id}`), async (snapshot) => {
      const data = snapshot.val();

      const listaMensajes = data ? snapshotToArray(data.messages) : [];

      if (data.users[user.id]?.exit_time) {
        const targetDate = new Date(data.users[user.id]?.exit_time);

        const unreads: any = listaMensajes.filter((message: any) => {
          const messageDate = new Date(`${message.date}`);
          return messageDate > targetDate && message.user != user.id;
        });

        setUnreads(unreads.length ?? 0);
      }

      const lastMsg = listaMensajes.pop();
      if (lastMsg) {
        const data = await getData(`users/${lastMsg.user}`);
        const userData = data.val();
        setLastMsg({ ...lastMsg, from: { ...userData } });
      }
    });
  };

  useEffect(() => {
    onCheckStatus();
  }, []);

  return (
    <IonItem
      button={true}
      className={`${styles["grupo"]}`}
      onClick={() => goToGrupo()}
    >
      <IonAvatar aria-hidden="true" slot="start">
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
          src={baseURL + grupo.photo}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>
      <IonLabel className="ion-no-margin">
        <span className={styles["name"]}> {grupo.grupo} </span>
        <span className={styles["phone"]}>
          {lastMsg && (
            <>
              {lastMsg.user == user.id ? "tu" : lastMsg.from.name}:{" "}
              {lastMsg.user == user.id
                ? ("tu: " + lastMsg.mensaje).length > 30 // Mensaje Mio
                  ? lastMsg?.mensaje.substring(0, 27) + "..."
                  : lastMsg?.mensaje
                : (lastMsg.from.name + ": " + lastMsg.mensaje).length > 30 // Mensaje de otra persona
                ? lastMsg.mensaje.substring(
                    0,
                    Math.abs(27 - (lastMsg.from.name + ": ").length)
                  ) + "..."
                : lastMsg.mensaje}{" "}
            </>
          )}{" "}
        </span>
      </IonLabel>
      <IonNote className={styles["note"]}>
        <span className={styles["time"]}>
          {" "}
          {lastMsg ? getDisplayDate(lastMsg.date) : null}{" "}
        </span>
        {unreads ? (
          <span className={styles["unreads"]}> {unreads} </span>
        ) : null}
      </IonNote>
    </IonItem>
  );
};
