import { IonAvatar, IonItem, IonSkeletonText, IonText } from "@ionic/react";
import React, { useState } from "react";
import styles from "./Grupo.module.scss";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";

export const Item: React.FC<any> = ({ msg }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { user } = getUser();

  const [isLoading, setIsLoading] = useState(true);

  return (
    <IonItem
      button={true}
      className={`${styles["message"]} ${
        msg.user.id === user.id ? styles["sender"] : styles["receiver"]
      } `}
    >
      {msg.user.id !== user.id && (
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
            src={msg.user.photo ? baseURL + msg.user.photo : Avatar}
            style={{ display: isLoading ? "none" : "block" }}
            onLoad={() => setIsLoading(false)}
          />
        </IonAvatar>
      )}
      <div>
        {msg.user.id !== user.id && (
          <span className={styles["name"]}> {msg.user.name} </span>
        )}
        <IonText className={styles["message"]}> {msg.mensaje} </IonText>
        <span className={styles["time"]}> {msg.hora} </span>
      </div>
    </IonItem>
  );
};
