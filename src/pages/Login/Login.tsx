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

import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";
import { useDispatch } from "react-redux";
import { getNotifications } from "@/store/thunks/notifications";
import { setGeneral, setGrupo, setRoom } from "@/store/slices/notificationSlice";

const Login: React.FC = () => {
  const [tab, setTab] = useState("login");
  const history = useHistory();

  const dispatch = useDispatch();
  const { db, setGlobalAudio }: any = useContext(UIContext);

  const onSetTab = (e) => {
    setTab(e.detail.value);
  };

  useEffect(() => {
    setGlobalAudio(null);
  }, []);

  const runGet = async () => {
    const val = await db.get("user");
    console.log("VAL ", val);
    val && history.replace("/home");
  };

  const initializeFCM = async () => {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === "granted") {
      PushNotifications.register();
    }

    const token = await FCM.getToken();
    console.log("FCM Token:", token.token);

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        const { data } = notification;
        console.log("Push notification received:", notification.data);
        // alert("Push Notification received: " + notification);

        if ( data.is_general ) {
          setGeneral( true );
        } else if ( data.room ) {
          setRoom( true );
        } else if ( data.grupo ) {
          setGrupo( true );
        }

        dispatch(getNotifications());
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        const { data } = notification.notification;        
        console.log("Push notification action performed:", notification);
        // alert( "Notification action: " + JSON.stringify(notification) );
        
        if ( data.is_general ) {
          history.replace("/notificaciones");
        } else if ( data.room ) {
          history.replace("/chat/" + data.room);
        } else if ( data.grupo ) {
          history.replace("/grupo/" + data.grupo);
        }

        dispatch(getNotifications());

      }
    );
  };

  useEffect(() => {
    initializeFCM();
    db && history && runGet();
  }, [db, history]);

  return (
    <IonPage>
      <IonContent className={styles["ion-content"]}>
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol className="ion-justify-content-center">
              <img src="assets/images/logo.png" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter className={styles["ion-footer"]}>
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
