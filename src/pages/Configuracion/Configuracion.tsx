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

import { Configuracion as ConfiguracionComponent } from "@/components/Configuracion/Configuracion";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./Configuracion.module.scss";

const Configuracion: React.FC = () => {
  
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
      <IonContent className={styles['ion-content']}>
        <ConfiguracionComponent />
      </IonContent>
    </IonPage>
  );
};

export default Configuracion;
