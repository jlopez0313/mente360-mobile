import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import {
  ellipsisVertical,
  notificationsOutline,
  personCircleOutline,
} from "ionicons/icons";
import styles from "./Home.module.scss";

import { Footer } from "@/components/Footer/Footer";
import { Home as HomeComponent } from "@/components/Home/Home";
import { Link } from "react-router-dom";
import { Popover } from "./Popover";

import { destroy } from "@/helpers/musicControls";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { getNotifications } from "@/store/thunks/notifications";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import User from "@/database/user";
import { useGlobalSync } from "@/hooks/useGlobalSync";
import { useSqliteDB } from "@/hooks/useSqliteDB";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const syncFromBackend = useGlobalSync();

  const { isGeneral } = useSelector((state: any) => state.notifications);
  const { db, initialized, performSQLAction } = useSqliteDB();

  const onGetNotifications = async () => {
    dispatch(getNotifications());
  };

  useEffect(() => {
    dispatch(setShowGlobalAudio(true));
    onGetNotifications();
    destroy();
  }, []);

  useEffect(() => {
    const onGetUser = async () => {
      const userDB = new User(db);
      await userDB.find(performSQLAction, (data: any) => {
        console.log(data);
      });
    };

    // initialized && onGetUser();
  }, [initialized]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to="/perfil" replace={true}>
              <IonButton>
                <IonIcon
                  icon={personCircleOutline}
                  className={styles["large-icon"]}
                ></IonIcon>
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-text-center"> Hoy </IonTitle>

          <IonButtons slot="end">
            <Link to="/notificaciones" replace={true}>
              <IonButton>
                <IonIcon slot="icon-only" icon={notificationsOutline}></IonIcon>
                {isGeneral && (
                  <div className={styles["has-notification"]}></div>
                )}
              </IonButton>
            </Link>

            <IonButton id="popover-button">
              <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
              <Popover trigger="popover-button" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles["ion-content"]}>
        <HomeComponent />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Home;
