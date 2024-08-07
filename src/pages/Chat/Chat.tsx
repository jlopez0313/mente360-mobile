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
import { Link } from "react-router-dom";

import UIContext from "@/context/Context";
import { useContext, useEffect, useState } from "react";

const Chat: React.FC = () => {
  const { setShowGlobalAudio }: any = useContext(UIContext);

  const [tab, setTab] = useState("comunidad");

  const onSetTab = (e) => {
    setTab(e.detail.value);
  };
  
  useEffect(() => {
    setShowGlobalAudio( false )
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to='/home' replace={true}>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Comunidad </IonTitle>

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
          <IonSegmentButton value="comunidad">
            <IonLabel> Comunidad </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="chat">
            <IonLabel> Chat </IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {tab == "chat" ? <ChatComponent /> : <ComunidadComponent />}
        
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Chat;
