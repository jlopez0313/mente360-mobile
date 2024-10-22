import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabList,
  IonGrid,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonPopover,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Interno.module.scss";

import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import {
  arrowBack,
  ellipsisVertical,
  ellipsisVerticalOutline,
  search,
  shareSocialOutline,
} from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Comunidad as ComunidadComponent } from "@/components/Chat/Comunidad/Comunidad";
import { Chat as ChatComponent } from "@/components/Chat/Chat/Chat";
import { Interno as InternoComponent } from "@/components/Chat//Chat/Interno/Interno";
import { Link, useParams } from "react-router-dom";

import UIContext from "@/context/Context";
import { useContext, useEffect, useRef, useState } from "react";
import { find } from "@/services/grupos";
import { getData } from "@/services/realtime-db";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";

const Interno: React.FC = () => {
  const { user } = getUser();
  const { room } = useParams<{ room: string }>();
  const [otherUser, setOtherUser] = useState({ name: "", photo: null });
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const onGetRoom = async () => {
    const data = await getData(`rooms/${room}/users`);
    const other = data
      ? Object.keys(data.val()).find((key) => key != user.id)
      : 0;
    setOtherUser(data.val()[other]);
  };

  useEffect(() => {
    onGetRoom();
  }, [room]);

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
          <IonTitle className="ion-no-padding ion-padding-end ion-text-justify ion-padding-start">
            {otherUser.name}
          </IonTitle>

          <IonButtons slot="end">
            <IonButton id="popover-button">
              <IonIcon
                slot="icon-only"
                icon={ellipsisVerticalOutline}
              ></IonIcon>
            </IonButton>
          </IonButtons>
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
