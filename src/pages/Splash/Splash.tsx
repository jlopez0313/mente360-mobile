import { AppLayout } from "@/components/layout";
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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

// Datos del tap de una notificación recibido ANTES de que la app terminara de
// arrancar (arranque en frío). prepareApp lo consume al decidir la ruta.
let pendingNotificationData: any = null;
// true cuando prepareApp ya decidió la ruta inicial: a partir de aquí los taps
// navegan al instante en vez de quedarse guardados.
let appRouted = false;

const Splash = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const { payment_status } = usePayment();
  const { keys, getPreference } = usePreferences();

  // Ruta destino según el payload de la notificación. Devuelve true si navegó.
  const routeFromNotification = (data: any): boolean => {
    if (!data) return false;
    if (data.is_general) {
      history.replace("/notificaciones");
      return true;
    }
    if (data.room) {
      history.replace("/chat/" + data.room);
      return true;
    }
    if (data.grupo) {
      history.replace("/grupo/" + data.grupo);
      return true;
    }
    return false;
  };

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

  // Tap en una notificación (push del sistema o local). Si la app ya arrancó,
  // navega al chat/grupo al instante; si aún no, guarda el dato para que
  // prepareApp lo use al elegir la ruta inicial.
  const onNotificationTap = (data: any) => {
    pendingNotificationData = data;

    if (data?.is_general) {
      dispatch(setGeneral(true));
    } else if (data?.room) {
      dispatch(setRoom(true));
    } else if (data?.grupo) {
      dispatch(setGrupo(true));
    }

    if (appRouted) {
      routeFromNotification(data);
      pendingNotificationData = null;
    }

    dispatch(getNotifications());
  };

  const registerTapListeners = async () => {
    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push action performed:", notification);
        onNotificationTap(notification.notification.data);
      }
    );

    await LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (notification) => {
        console.log("Local notification action performed:", notification);
        onNotificationTap(notification.notification.extra);
      }
    );
  };

  const initializeFCM = async () => {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive === "granted") {
      PushNotifications.register();
    }

    PushNotifications.addListener("registration", async (token) => {
      console.log("Token FCM:", token.value);
    });

    // App en primer plano: FCM no muestra la notificación del sistema, así que
    // la programamos como local para que el usuario la vea y pueda tocarla.
    PushNotifications.addListener(
      "pushNotificationReceived",
      async (notification) => {
        const { data } = notification;
        console.log("Push notification received:", data);

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
  };

  const initializeLocalNotifications = async () => {
    LocalNotifications.addListener(
      "localNotificationReceived",
      (notification) => {
        const { extra } = notification;
        console.log("Local notification received:", notification);

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
  };

  useEffect(() => {
    let initialized = false;

    const prepareApp = async () => {
      if (initialized) return;
      initialized = true;

      try {
        // Limpiamos listeners previos y registramos YA los de "tap": si la app
        // arrancó por tocar una notificación con la app cerrada, el evento
        // llega en los primeros ms y no queremos perderlo.
        await PushNotifications.removeAllListeners();
        await LocalNotifications.removeAllListeners();
        await registerTapListeners();

        await new Promise((res) => setTimeout(res, 400));

        const token = await getPreference(keys.TOKEN);
        await SplashScreen.hide();

        if (!token) {
          history.replace("/login");
          appRouted = true;
          return;
        }

        const lastDateStr =
          (await getPreference(keys.HOME_SYNC_KEY)) ?? "2024-01-01T00:00:00Z";

        const lastDate = new Date(lastDateStr);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Ventana corta para que un tap de arranque en frío alcance a llegar
        // al listener antes de decidir la ruta.
        if (!pendingNotificationData) {
          await new Promise((res) => setTimeout(res, 350));
        }

        if (payment_status === "free" && diferenciaEnDias(now, lastDate) > 0) {
          history.replace("/welcome");
        } else if (routeFromNotification(pendingNotificationData)) {
          pendingNotificationData = null;
          dispatch(getNotifications());
        } else {
          history.replace("/home");
        }

        appRouted = true;

        setTimeout(async () => {
          console.log("Initializing FCM...");
          await initializeFCM();

          console.log("Initializing Local Notifications...");
          await initializeLocalNotifications();
        }, 600);
      } catch (error) {
        console.log("Splash Error", error);
      }
    };

    prepareApp();
  }, []);

  return (
    <AppLayout> </AppLayout>
  );
};

export default Splash;
