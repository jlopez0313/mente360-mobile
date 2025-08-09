import { diferenciaEnDias } from "@/helpers/Fechas";
import { usePayment } from "@/hooks/usePayment";
import { usePreferences } from "@/hooks/usePreferences";
import {
  setGeneral,
  setGrupo,
  setRoom,
} from "@/store/slices/notificationSlice";
import { getNotifications } from "@/store/thunks/notifications";
import { LocalNotifications } from "@capacitor/local-notifications";
import { PushNotifications } from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { IonContent, IonPage } from "@ionic/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

let pendingNotificationData: any = null;

const Splash = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { payment_status } = usePayment();
  const { keys, getPreference } = usePreferences();

  const makeLocalNotification = async (notification: any) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title,
          body: notification.body,
          id: Math.ceil(Math.random() * 100),
          schedule: { at: new Date(Date.now() + 100) },
          smallIcon: "icon",
          largeIcon: "icon",
          extra: notification.data,
        },
      ],
    });
  };

  const initializeFCM = async () => {
    PushNotifications.removeAllListeners();

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === "granted") {
      PushNotifications.register();
    }

    PushNotifications.addListener("registration", async (token) => {
      console.log("Token FCM:", token.value);
    });

    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification) => {
        const { data } = notification;
        console.log("Push notification received:", data);

        // await Haptics.vibrate({ duration: 900 });

        await makeLocalNotification(notification);

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
        pendingNotificationData = data;
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
  };

  useEffect(() => {
    const prepareApp = async () => {
      const token = await getPreference(keys.TOKEN);

      try {
        await initializeFCM();
        await initializeLocalNotifications();
        await new Promise((res) => setTimeout(res, 1500));
      } finally {
        await SplashScreen.hide();

        if (token) {
          const lastDateStr =
            (await getPreference(keys.HOME_SYNC_KEY)) ?? "2024-01-01T00:00:00Z";

          const lastDate = new Date(lastDateStr);
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (payment_status == "free" && diferenciaEnDias(now, lastDate) > 0) {
            history.replace("/welcome");
          } else {
            if (pendingNotificationData) {
              const data = pendingNotificationData;
    
              if (data.is_general) {
                history.replace("/notificaciones");
              } else if (data.room) {
                history.replace("/chat/" + data.room);
              } else if (data.grupo) {
                history.replace("/grupo/" + data.grupo);
              }
    
              pendingNotificationData = null;
              
              dispatch(getNotifications());
              return;
            } else {
              history.replace("/home");
            }

          }
        } else {
          history.replace("/login");
        }
      }
    };

    prepareApp();
  }, [history]);

  return (
    <IonPage>
      <IonContent className="ion-text-center ion-padding"></IonContent>
    </IonPage>
  );
};

export default Splash;
