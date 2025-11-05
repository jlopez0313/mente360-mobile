import { Recordatorios as RecordatoriosComponent } from '@/components/Recordatorios/Recordatorios';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Recordatorios.module.scss";

const Recordatorios: React.FC = () => {
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to='/home' replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <div className={`ion-padding ${styles.title}`}>
            <IonTitle>
              {" "}
              Mis Recordatorios{" "}
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        
        <RecordatoriosComponent />

      </IonContent>
    </IonPage>
  );
};

export default Recordatorios;
