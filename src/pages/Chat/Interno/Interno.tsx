import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Interno.module.scss";

import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

import { Interno as InternoComponent } from "@/components/Chat/Chat/Interno/Interno";
import { Profile as ProfileModal } from "@/components/Chat/Profile/Profile";
import { Footer } from "@/components/Footer/Footer";
import { Link, useHistory, useParams } from "react-router-dom";

import Avatar from "@/assets/images/avatar.jpg";
import { getDisplayDate } from "@/helpers/Fechas";
import { getUser } from "@/helpers/onboarding";
import { getData, readData, writeData } from "@/services/realtime-db";
import { onValue } from "firebase/database";
import { useEffect, useState } from "react";

const Interno: React.FC = () => {
  const history = useHistory();
  const { user } = getUser();
  const { room } = useParams<{ room: string }>();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [otherUser, setOtherUser] = useState({
    id: null,
    name: "",
    photo: null,
  });
  const [dataUserRoom, setDataUserRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const onGetRoom = async () => {
    onValue(readData(`rooms/${room}`), async (snapshot) => {
      const data = snapshot.val();
      const userInRoom = room.split("_").find((id: any) => id != user.id) ?? 0;

      const dataUser = await getData(`users/${userInRoom}`);
      const otherUser = dataUser.val();

      setOtherUser({ ...otherUser });
      data.users[userInRoom] && setDataUserRoom(data.users[userInRoom]);
    });
  };

  const onEnter = async () => {
    await writeData(`rooms/${room}/${user.id}/exit_time`, null);
  };

  const onExit = async () => {
    await Promise.all([
      writeData(`rooms/${room}/users/${user.id}/writing`, false),
      writeData(
        `rooms/${room}/users/${user.id}/exit_time`,
        new Date().toISOString()
      ),
    ]);
  };

  useEffect(() => {
    onGetRoom();
  }, [room]);

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/chat");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    onEnter();

    return () => {
      onExit();
    };
  }, []);

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
              src={otherUser.photo ? baseURL + otherUser.photo : Avatar}
              style={{ display: isLoading ? "none" : "block" }}
              onLoad={() => setIsLoading(false)}
            />
          </IonAvatar>

          <div
            className={styles["title-container"]}
            onClick={() => setShowProfileModal(true)}
          >
            <IonTitle className={styles["title"]}>{otherUser.name}</IonTitle>
            {dataUserRoom?.writing ? (
              <span className={styles["status"]}>Escribiendo...</span>
            ) : (
              <span className={styles["status"]}>
                {dataUserRoom?.exit_time
                  ? getDisplayDate(dataUserRoom.exit_time)
                  : dataUserRoom ? "En línea" : ""}
              </span>
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

      {showProfileModal && (
        <ProfileModal
          usuario={otherUser}
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
        />
      )}

      <Footer />
    </IonPage>
  );
};

export default Interno;
