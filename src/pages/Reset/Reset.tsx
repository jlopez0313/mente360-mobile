import {
  IonContent,
  IonPage,
  IonSegmentButton
} from "@ionic/react";

import { Reset as ResetComponent } from "@/components/Login/Reset/Reset";
import { DBContext } from "@/context/Context";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styles from "./Reset.module.scss";

import {
  setGeneral,
  setGrupo,
  setRoom,
} from "@/store/slices/notificationSlice";
import { getNotifications } from "@/store/thunks/notifications";
import { PushNotifications } from "@capacitor/push-notifications";
import { useDispatch } from "react-redux";

import { setGlobalAudio } from "@/store/slices/audioSlice";
import { LocalNotifications } from "@capacitor/local-notifications";

const Reset: React.FC = () => {
  const [tab, setTab] = useState("login");
  const history = useHistory();

  const dispatch = useDispatch();
  const { db }: any = useContext(DBContext);

  const onSetTab = (e: any) => {
    setTab(e.detail.value);
  };

  useEffect(() => {
    dispatch(setGlobalAudio(""));
  }, []);

  const runGet = async () => {
    const val = await db.get("user");
    console.log("VAL ", val);
    val && history.replace("/home");
  };

  const initializeFCM = async () => {
    
    PushNotifications.removeAllListeners();

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === "granted") {
      PushNotifications.register();
    }

    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification) => {
        const { data } = notification;
        console.log("Push notification received:", data);

        // await Haptics.vibrate({ duration: 900 });

        await makeLocalNotification( notification );

        if (data.is_general) {
          dispatch(setGeneral(true));
        } else if (data.room) {
          dispatch(setRoom(true));
        } else if (data.grupo) {
          dispatch(setGrupo(true));
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

        if (data.is_general) {
          history.replace("/notificaciones");
        } else if (data.room) {
          history.replace("/chat/" + data.room);
        } else if (data.grupo) {
          history.replace("/grupo/" + data.grupo);
        }

        dispatch(getNotifications());
      }
    );

  };


  const initializeLocalNotifications = async () => {
    LocalNotifications.removeAllListeners();
    
    LocalNotifications.addListener(
      "localNotificationReceived",
      (notification) => {
        const { extra } = notification;
        console.log("Local notification action received:", notification);
        // alert( "Notification action: " + JSON.stringify(notification) );

        if (extra.is_general) {
          dispatch(setGeneral(true));
        } else if (extra.room) {
          dispatch(setRoom(true));
        } else if (extra.grupo) {
          dispatch(setGrupo(true));
        }

        dispatch(getNotifications());
      }
    );
    
    LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (notification) => {
        const { extra } = notification.notification;
        console.log("Local notification action performed:", notification);
        // alert( "Notification action: " + JSON.stringify(notification) );

        if (extra.is_general) {
          history.replace("/notificaciones");
        } else if (extra.room) {
          history.replace("/chat/" + extra.room);
        } else if (extra.grupo) {
          history.replace("/grupo/" + extra.grupo);
        }

        dispatch(getNotifications());
      }
    );
  }

  const makeLocalNotification = async ( notification: any ) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title,
          body: notification.body,
          id: Math.ceil(Math.random() * 100),
          schedule: { at: new Date(Date.now() + 100) },
          smallIcon: 'icon',
          largeIcon: 'icon',
          extra: notification.data
        },
      ],
    });
  };

  useEffect(() => {
    db && history && runGet();
  }, [db, history]);
  
  useEffect(() => {
    initializeLocalNotifications();
    initializeFCM();
  }, [])

  return (
    <IonPage>
      <IonContent className={`ion-text-center ${styles["ion-content"]}`}>
        
        <img src="assets/images/logo.png" className="ion-text-center ion-margin-top" />

        <div className={`ion-padding ${styles.content}`}>
          <div className="ion-text-center">
            <IonSegmentButton>Recuperar Contraseña</IonSegmentButton>        
          </div>
          <ResetComponent />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reset;
