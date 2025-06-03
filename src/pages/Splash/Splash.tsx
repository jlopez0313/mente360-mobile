import { diferenciaEnDias } from "@/helpers/Fechas";
import { usePayment } from "@/hooks/usePayment";
import { usePreferences } from "@/hooks/usePreferences";
import { SplashScreen } from "@capacitor/splash-screen";
import { IonContent, IonPage } from "@ionic/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Splash = () => {
  const history = useHistory();
  const { payment_status } = usePayment();
  const { keys, getPreference } = usePreferences();

  useEffect(() => {
    const prepareApp = async () => {
      const token = await getPreference(keys.TOKEN);

      try {
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
            history.replace("/home");
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
