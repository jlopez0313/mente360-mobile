import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Interno.module.scss";

import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Interno as InternoComponent } from "@/components/Chat//Chat/Interno/Interno";
import { Link, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { readData, writeData } from "@/services/realtime-db";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";
import { onValue } from "firebase/database";

const Interno: React.FC = () => {
  const { user } = getUser();
  const { room } = useParams<{ room: string }>();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [otherUser, setOtherUser] = useState({
    id: null,
    name: "",
    photo: null,
  });
  const [isWriting, setIsWriting] = useState(false);

  const onGetRoom = async () => {
    onValue(readData(`rooms/${room}`), (snapshot) => {
      const data = snapshot.val();

      const other = data
        ? Object.keys(data.users).find((key) => key != user.id)
        : 0;
      const otherUser = data.users[other];

      setOtherUser(otherUser);

      setIsWriting(data[otherUser.id].writing);
    });
  };

  
  const onEnter = async () => {
    await writeData(`rooms/${ room }/${user.id}/exit_time`, null);
  }

  const onExit = async () => {
    await writeData(`rooms/${ room }/${user.id}/exit_time`, new Date().toISOString());
  }

  useEffect(() => {
    onGetRoom();
  }, [room]);

  useEffect(() => {
    onEnter()

    return () => {
      onExit()
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to="/chat" replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonAvatar
            aria-hidden="true"
            slot="start"
            className={styles["avatar"]}
          >
            <img
              alt=""
              src={otherUser.photo ? baseURL + otherUser.photo : Avatar}
            />
          </IonAvatar>
          
          <div className={styles["title-container"]}>
            <IonTitle className={styles["title"]}>
              {otherUser.name}
            </IonTitle>
            {isWriting && (
              <span className={styles["status"]}>Escribiendo...</span>
            )}
          </div>
          
          {/*
          <IonButtons slot="end">
            <IonButton id="popover-button">
              <IonIcon
                slot="icon-only"
                icon={ellipsisVerticalOutline}
              ></IonIcon>
            </IonButton>
          </IonButtons>
          */}
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-no-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>

        <InternoComponent roomID={room} />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Interno;
