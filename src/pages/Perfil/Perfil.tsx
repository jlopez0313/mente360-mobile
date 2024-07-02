import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { IonIcon } from "@ionic/react";
import { arrowBack, settingsOutline } from "ionicons/icons";
import { Perfil as PerfilComponent} from "@/components/Perfil/Perfil";

import styles from "./Perfil.module.scss";
import { Link } from "react-router-dom";
import UIContext from "@/context/Context";
import { useContext, useEffect } from "react";


const Perfil: React.FC = () => {
  const { setShowGlobalAudio }: any = useContext(UIContext);

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

          <IonTitle className="ion-text-center"> Mi Perfil </IonTitle>

          <IonButtons slot="end">
            <Link to='/configuracion' replace={true}>
              <IonButton>
                <IonIcon slot="icon-only" icon={settingsOutline} />
              </IonButton>
            </Link>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <PerfilComponent />
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
