import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import styles from "./Chat.module.scss";


import { Chat as ChatComponent } from "@/components/Chat/Chat/Lista/Chat";
import { Comunidad as ComunidadComponent } from "@/components/Chat/Comunidad/Comunidad";
import { Grupos as GruposComponent } from "@/components/Chat/Grupos/Lista/Grupos";
import { Footer } from "@/components/Footer/Footer";
import { useHistory } from "react-router-dom";

import { destroy } from "@/helpers/musicControls";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setTab } from "@/store/slices/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { isRoom, isGrupo } = useSelector((state: any) => state.notifications);
  const { tab } = useSelector((state: any) => state.chat);

  const onSetTab = (e) => {
    dispatch(setTab(e.detail.value));
  };

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/home");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
    destroy();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>


          <IonTitle className="ion-no-padding ion-padding-end">
            {" "}
            Conexiones{" "}
          </IonTitle>

          {/*
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={search}></IonIcon>
            </IonButton>
          </IonButtons>
          */}
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment value={tab} onIonChange={onSetTab}>
          <IonSegmentButton
            value="chat"
            className={styles["ion-segment-button"]}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">chat</span>
              <IonLabel>
                Chat
                {isRoom && <div className={styles["has-notification"]}></div>}
              </IonLabel>
            </div>
          </IonSegmentButton>
          <IonSegmentButton
            value="grupos"
            className={styles["ion-segment-button"]}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">forum</span>
              <IonLabel>
                {" "}
                Grupos
                {isGrupo && <div className={styles["has-notification"]}></div>}
              </IonLabel>
            </div>
          </IonSegmentButton>
          <IonSegmentButton
            value="comunidad"
            className={styles["ion-segment-button"]}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">diversity_3</span>
              <IonLabel> Comunidad </IonLabel>
            </div>
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
