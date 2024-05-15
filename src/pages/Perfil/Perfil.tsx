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
import Configuracion from "../Configuracion/Configuración";
import { Perfil as PerfilComponent} from "@/components/Perfil/Perfil";


import styles from "./Perfil.module.scss";
import { Link } from "react-router-dom";

const Perfil: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to='/home'>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle> Mi Perfil </IonTitle>

          <IonButtons slot="end">
            <Link to='/configuracion'>
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
