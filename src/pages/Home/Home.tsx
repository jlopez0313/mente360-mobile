import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import styles from "./Home.module.scss";

import { IonIcon } from "@ionic/react";
import {
  notificationsOutline,
  personCircleOutline,
} from "ionicons/icons";
import { Home as HomeComponent } from '@/components/Home/Home';
import { Footer } from "@/components/Footer/Footer";
import { Link } from "react-router-dom";

const Home: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles['ion-header']}>
          <IonButtons slot="start">
            <Link to='/perfil'>
              <IonButton>
                <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-text-center"> Hoy </IonTitle>

          <IonButtons slot="end">
            <Link to='/notificaciones'>
              <IonButton>
                <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
              </IonButton>
            </Link>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles['ion-content']}>
        <HomeComponent />
      </IonContent>
      
      <Footer />
    </IonPage>
  );
};

export default Home;
