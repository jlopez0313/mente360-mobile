import Avatar from "@/assets/images/avatar.jpg";
import { Profile } from "@/components/Chat/Profile/Profile";
import { IonAvatar, IonItem, IonLabel, IonSkeletonText } from "@ionic/react";
import React, { useState } from "react";
import styles from "./Info.module.scss";

export const Item: React.FC<any> = ({ user }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <IonItem button={true} className={`${styles["message"]}`}>
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
          src={user.photo ? baseURL + user.photo : Avatar}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>

      <IonLabel className="ion-no-margin">
        <span className={styles["name"]}> {user.name} </span>
        <span className={styles["phone"]}> {user.phone} </span>
      </IonLabel>

      {showProfileModal && (
        <Profile
          usuario={user}
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
        />
      )}
    </IonItem>
  );
};
