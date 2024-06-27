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

import { Notifications as NotificationsComponent } from '@/components/Notifications/Notifications';
import styles from "./Notifications.module.scss";
import { Footer } from "@/components/Footer/Footer";
import { Link } from "react-router-dom";
import { arrowBack } from "ionicons/icons";


const Notifications: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles['ion-header']}>
          <IonButtons slot="start">
            <Link to='/home' replace={true}>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Notificaciones </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles['ion-content']}>
        <NotificationsComponent />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Notifications;
