import Avatar from "@/assets/images/avatar.jpg";
import { Profile } from "@/components/Chat/Profile/Profile";
import { writeData } from "@/services/realtime-db";
import { IonAvatar, IonItem, IonLabel, IonSkeletonText } from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Comunidad.module.scss";

export const Item: React.FC<any> = ({ contact }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { user } = useSelector( (state: any) => state.user);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const goToInterno = async (otroUser: any) => {
    const roomID = [Number(user.id), Number(otroUser.id)]
      .sort((a, b) => a - b)
      .join("_");

    await Promise.all([
      writeData("users/" + user.id, {
        id: user.id,
        name: user.name,
        photo: user.photo || "",
        phone: user.phone || "",
        eneatipo: user.eneatipo || 0,
        edad: user.edad || 0,
        genero: user.genero || '--',
      }),
      writeData("users/" + otroUser.id, {
        id: otroUser.id,
        name: otroUser.name,
        photo: otroUser.photo || "",
        phone: otroUser.phone || "",
        eneatipo: otroUser.eneatipo || 0,
        edad: otroUser.edad || 0,
        genero: otroUser.genero || '--',
      }),
      writeData("users/" + user.id + "/rooms/" + roomID, true),
      writeData("users/" + otroUser.id + "/rooms/" + roomID, true),
    ]);

    history.replace("/chat/" + roomID);
  };

  return (
    <IonItem button={true} className={`${styles["contact"]}`}>
      <IonAvatar
        aria-hidden="true"
        slot="start"
        onClick={() => setShowProfileModal(true)}
      >
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
      <div
        className={styles["item-content"]}
        onClick={() => goToInterno(contact)}
      >
        <IonLabel className="ion-no-margin">
          <span className={styles["name"]}> {contact.name || "-"} </span>
          <span className={styles["phone"]}> {contact.phone || "-"} </span>
        </IonLabel>
      </div>

      {showProfileModal && (
        <Profile
          userID={contact.id}
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
        />
      )}
    </IonItem>
  );
};
