import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { Suscripcion as SuscripcionComponent } from "@/components/Suscripcion/Suscripcion";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./Suscripcion.module.scss";

const Suscripcion: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/perfil");
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
            <Link to="/perfil" replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center">
            {" "}
            Mi Suscripción{" "}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        <SuscripcionComponent />
      </IonContent>
      
    </IonPage>
  );
};

export default Suscripcion;
