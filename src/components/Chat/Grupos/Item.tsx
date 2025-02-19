import { IonAvatar, IonItem, IonLabel, IonNote, IonSkeletonText } from "@ionic/react";
import styles from "./Grupos.module.scss";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { updateData } from "@/services/realtime-db";
import { getUser } from "@/helpers/onboarding";

export const Item: React.FC<any> = ({ idx, grupo, messages, unreadList }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const { user } = getUser();

  const [isLoading, setIsLoading] = useState(true);

  const goToGrupo = async (id: number) => {
    const updates = {
      [id]: true,
    };
    await updateData(`user_rooms/${user.id}/grupos`, updates);

    history.replace(`/grupo/${id}`);
  };

  return (
    <IonItem
      button={true}
      className={`${styles["grupo"]}`}
      onClick={() => goToGrupo(grupo.id)}
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
          {messages[idx] && (
            <>
              {messages[idx]?.user?.id == user.id
                ? "tu"
                : messages[idx]?.user?.name}
              :{" "}
              {messages[idx]?.user?.id == user.id
                ? ("tu: " + messages[idx]?.mensaje).length > 30
                  ? messages[idx]?.mensaje.substring(0, 27) + "..."
                  : messages[idx]?.mensaje
                : (messages[idx]?.user?.name + ": " + messages[idx]?.mensaje)
                    .length > 30
                ? (messages[idx]?.mensaje).substring(
                    0,
                    Math.abs(27 - (messages[idx]?.user?.name + ": ").length)
                  ) + "..."
                : messages[idx]?.mensaje}{" "}
            </>
          )}{" "}
        </span>
      </IonLabel>
      <IonNote className={styles["note"]}>
        <span className={styles["time"]}> {messages[idx]?.hora} </span>
        {unreadList[idx] ? (
          <span className={styles["unreads"]}> {unreadList[idx]} </span>
        ) : null}
      </IonNote>
    </IonItem>
  );
};
