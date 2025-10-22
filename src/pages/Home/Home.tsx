import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar
} from "@ionic/react";

import styles from "./Home.module.scss";

import { Home as HomeComponent } from "@/components/Home/Home";

import { destroy } from "@/helpers/musicControls";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { getNotifications } from "@/store/thunks/notifications";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Logo from "@/assets/images/logo.png";
import { Sync } from "@/components/Shared/Animations/Sync/Sync";
import { diferenciaEnDias } from "@/helpers/Fechas";
import { useGlobalSync } from "@/hooks/useGlobalSync";
import { usePreferences } from "@/hooks/usePreferences";

const Home: React.FC = () => {
  const { getPreference, setPreference, keys } = usePreferences();

  const dispatch = useDispatch();
  const { loading, error, success, mensaje, syncAll } = useGlobalSync();

  const { isGeneral } = useSelector((state: any) => state.notifications);

  const onGetNotifications = async () => {
    dispatch(getNotifications());
  };

  useEffect(() => {
    dispatch(setShowGlobalAudio(true));
    onGetNotifications();
    destroy();
  }, []);

  useEffect(() => {
    const onGlobalSync = async () => {
      const lastDateStr =
        (await getPreference(keys.SYNC_KEY)) ?? "2024-01-01T00:00:00Z";
      const lastDate = new Date(lastDateStr);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (diferenciaEnDias(now, lastDate) > 0) {
        syncAll();
      }
    };

    onGlobalSync();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <div className="flex justify-center">
            <IonAvatar className="marginleftneg45 flex items-center justify-center " aria-hidden="true" slot="start">
            <img alt="" className="logo-header" src={Logo} />
            </IonAvatar>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className={styles["ion-content"]}>
        <Sync
          loading={loading}
          success={success}
          error={error}
          mensaje={mensaje}
        />
        <HomeComponent />
      </IonContent>

    </IonPage>
  );
};

export default Home;
