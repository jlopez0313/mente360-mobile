import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonNote,
  IonSkeletonText,
} from "@ionic/react";
import React, { useState } from "react";
import Avatar from "@/assets/images/avatar.jpg";
import styles from "./Chat.module.scss";

export const Item: React.FC<any> = ({
  idx,
  usuario,
  messages,
  isWriting,
  unreadList,
  goToInterno,
}) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [isLoading, setIsLoading] = useState(true);

  return (
    <IonItem
      button={true}
      className={`${styles["contact"]}`}
      onClick={() => goToInterno(usuario)}
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
          src={usuario.photo ? baseURL + usuario.photo : Avatar}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>
      <IonLabel className="ion-no-margin">
        <span className={styles["name"]}> {usuario?.name} </span>
        <span className={styles["phone"]}>
          {" "}
          {isWriting[idx]
            ? "Escribiendo..."
            : messages[idx]?.mensaje.length > 35
            ? messages[idx]?.mensaje.substring(0, 32) + "..."
            : messages[idx]?.mensaje}{" "}
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
