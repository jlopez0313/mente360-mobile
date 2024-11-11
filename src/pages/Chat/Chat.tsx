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
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Chat.module.scss";

import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { arrowBack, search, shareSocialOutline } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Comunidad as ComunidadComponent } from "@/components/Chat/Comunidad/Comunidad";
import { Chat as ChatComponent } from "@/components/Chat/Chat/Chat";
import { Grupos as GruposComponent } from "@/components/Chat/Grupos/Grupos";
import { Link } from "react-router-dom";

import UIContext from "@/context/Context";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Chat: React.FC = () => {
  const { setShowGlobalAudio }: any = useContext(UIContext);

  const { isRoom, isGrupo } = useSelector((state: any) => state.notifications);

  const [tab, setTab] = useState("chat");

  const onSetTab = (e) => {
    setTab(e.detail.value);
  };

  useEffect(() => {
    setShowGlobalAudio(false);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to="/home" replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center">
            {" "}
            Comunidad{" "}
          </IonTitle>

          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment value={tab} onIonChange={onSetTab}>
          <IonSegmentButton value="chat">
            <IonLabel>
              Chat
              {isRoom && <div className={styles["has-notification"]}></div>}
            </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="grupos">
            <IonLabel>
              {" "}
              Grupos
              {isGrupo && <div className={styles["has-notification"]}></div>}
            </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="comunidad">
            <IonLabel> Comunidad </IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {(() => {
          if (tab == "chat") return <ChatComponent />;
          else if (tab == "comunidad") return <ComunidadComponent />;
          else return <GruposComponent />;
        })()}
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Chat;
