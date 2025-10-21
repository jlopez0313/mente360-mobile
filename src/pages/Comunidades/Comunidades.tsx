import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import { Comunidades as ComunidadesComponent } from "@/components/Comunidades/Comunidades";
import { Footer } from "@/components/Footer/Footer";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
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
            <IonMenuButton/>
          </IonButtons>
          <IonTitle className="ion-no-padding ion-padding-end">
            {" "}
            Comunidades{" "}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles["ion-content"]}>
        <ComunidadesComponent />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Comunidades;
