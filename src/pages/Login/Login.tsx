import {
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonImg,
  IonLabel,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

import { Login as LoginComponent } from "@/components/Login/Login/Login";
import { useContext, useEffect, useState } from "react";
import { Register } from "@/components/Login/Register/Register";
import styles from "./Login.module.scss";
import UIContext from "@/context/Context";

import { useHistory } from "react-router";

import { FCM } from '@capacitor-community/fcm';
import { PushNotifications } from '@capacitor/push-notifications';

const Login: React.FC = () => {
  
  const [tab, setTab] = useState("login");
  const history = useHistory();

  const { db, setGlobalAudio }: any = useContext(UIContext);

  const onSetTab = (e) => {
    setTab(e.detail.value);
  };

  useEffect(() => {
    setGlobalAudio(null)
  }, [])

  
  const runGet = async () => {
    const val = await db.get('user');
    console.log( 'VAL ', val );
    val && history.replace("/home");
  }

  const initializeFCM = async () => {

    // Solicitar permiso de notificaciones push en iOS (si aplica)
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === 'granted') {
      // Registrar el dispositivo para notificaciones push
      PushNotifications.register();
    }

    // Obtener el token FCM del dispositivo
    const token = await FCM.getToken();
    console.log('FCM Token:', token.token);

    // Listener para cuando se recibe una notificación
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
      alert('Push Notification: ' + notification.body);
    });

    // Listener para cuando el usuario interactúa con la notificación
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed:', notification);
      alert('Notification action: ' + notification.notification.body);
    });
  };
  
  useEffect(() => {

    initializeFCM();

    console.log(db, history);
    db && history && runGet();
  }, [db, history])

  return (
    <IonPage>
      <IonContent className={styles['ion-content']}>
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol  className="ion-justify-content-center">
              <img src="assets/images/logo.png" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter className={styles['ion-footer']}>
        <div className={`ion-padding ${styles.content}`}>
          <IonSegment value={tab} onIonChange={onSetTab}>
            <IonSegmentButton value="login">
              <IonLabel>Iniciar Sesión</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="register">
              <IonLabel>Crear Cuenta</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {tab == "login" ? <LoginComponent /> : <Register />}
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
