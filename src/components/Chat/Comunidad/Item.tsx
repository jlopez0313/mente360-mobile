import styles from "./Comunidad.module.scss";
import { IonAvatar, IonItem, IonLabel, IonSkeletonText } from "@ionic/react";
import React, { useState } from "react";
import Avatar from "@/assets/images/avatar.jpg";
import { useHistory } from "react-router";
import { writeData } from "@/services/realtime-db";
import { getUser } from "@/helpers/onboarding";

export const Item: React.FC<any> = ({ contact }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { user } = getUser();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);

  const goToInterno = async (otroUser: any) => {
    const roomArray = [Number(user.id), Number(otroUser.id)];
    const roomID = roomArray.sort((a, b) => a - b).join("_");

    await Promise.all([
      writeData("rooms/" + roomID + "/users/" + user.id, {
        id: user.id,
        name: user.name,
        photo: user.photo || "",
        phone: user.phone || "",
      }),
      writeData("rooms/" + roomID + "/users/" + otroUser.id, {
        id: otroUser.id,
        name: otroUser.name,
        photo: otroUser.photo || "",
        phone: otroUser.phone || "",
      }),
      writeData("user_rooms/" + user.id + "/rooms/" + roomID, true),
      writeData("user_rooms/" + otroUser.id + "/rooms/" + roomID, true),
    ]);

    history.replace("/chat/" + roomID);
  };

  return (
    <IonItem
      button={true}
      className={`${styles["contact"]}`}
      onClick={() => goToInterno(contact)}
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
          src={contact.photo ? baseURL + contact.photo : Avatar}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>
      <IonLabel className="ion-no-margin">
        <span className={styles["name"]}> {contact.name || "-"} </span>
        <span className={styles["phone"]}> {contact.phone || "-"} </span>
      </IonLabel>
    </IonItem>
  );
};
