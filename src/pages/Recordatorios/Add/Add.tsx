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
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Add as AddComponent } from '@/components/Recordatorios/Add/Add'
import styles from "../Recordatorios.module.scss";

const Add: React.FC = () => {
  const { route } = useSelector((state: any) => state.route);

  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/recordatorios");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to={"/recordatorios"} replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <div className={`ion-padding ${styles.title}`}>
            <IonTitle className="ion-text-center">
              {" "}
              Agregar Recordatorio{" "}
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        
        <AddComponent />

      </IonContent>
    </IonPage>
  );
};

export default Add;
