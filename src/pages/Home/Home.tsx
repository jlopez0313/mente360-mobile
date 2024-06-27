import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon
} from "@ionic/react";

import styles from "./Home.module.scss";
import {
  ellipsisVertical,
  notificationsOutline,
  personCircleOutline,
} from "ionicons/icons";

import { Home as HomeComponent } from '@/components/Home/Home';
import { Footer } from "@/components/Footer/Footer";
import { Link } from "react-router-dom";
import { Popover } from "./Popover";

import UIContext from "@/context/Context";
import { useContext, useEffect } from "react";

const Home: React.FC = () => {

  const { setShowGlobalAudio }: any = useContext(UIContext);

  useEffect(() => {
    setShowGlobalAudio( true )
  }, [])
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles['ion-header']}>
          <IonButtons slot="start">
            <Link to='/perfil' replace={true}>
              <IonButton>
                <IonIcon slot="icon-only" icon={personCircleOutline}></IonIcon>
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-text-center"> Hoy </IonTitle>

          <IonButtons slot="end">
              <Link to='/notificaciones' replace={true}>
                <IonButton>
                  <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
                </IonButton>
              </Link>
              <IonButton id="popover-button">
                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                <Popover trigger="popover-button" />
              </IonButton>
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
