import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import {Configuracion as ConfiguracionComponent} from "@/components/Configuracion/Configuracion";
import styles from "./Configuracion.module.scss";
import { Link } from "react-router-dom";
import { arrowBack } from "ionicons/icons";

const Configuracion: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles['ion-header']}>
          <IonButtons slot="start">
            <Link to='/perfil'>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Configuración </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen  className={styles['ion-content']}>

        <ConfiguracionComponent />

      </IonContent>
    </IonPage>
  );
};

export default Configuracion;
