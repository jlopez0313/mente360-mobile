import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Recordatorios as RecordatoriosComponent } from '@/components/Recordatorios/Recordatorios'
import styles from "./Recordatorios.module.scss";

const Recordatorios: React.FC = () => {
  const { route } = useSelector((state: any) => state.route);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to={route} replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <div className={`ion-padding ${styles.title}`}>
            <IonTitle className="ion-text-center">
              {" "}
              Mis Recordatorios{" "}
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        
        <RecordatoriosComponent />

      </IonContent>
    </IonPage>
  );
};

export default Recordatorios;
