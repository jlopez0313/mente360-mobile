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

import styles from "./Planes.module.scss";

import { Planes as PlanesComponent } from "@/components/Payment/Planes/Planes";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Planes: React.FC = () => {
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
            <Link to="/home" replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle > Planes </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className={`${styles["ion-content"]}`}>
        <div className={`ion-padding ${styles.content}`}>
          <PlanesComponent />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Planes;
