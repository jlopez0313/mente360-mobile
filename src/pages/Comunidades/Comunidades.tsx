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

import { Comunidades as ComunidadesComponent } from "@/components/Comunidades/Comunidades";
import { Footer } from "@/components/Footer/Footer";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./Comunidades.module.scss";

const Comunidades: React.FC = () => {
  const history = useHistory();

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
            Comunidades{" "}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles["ion-content"]}>
        <ComunidadesComponent />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Comunidades;
