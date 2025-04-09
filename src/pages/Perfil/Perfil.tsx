import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import { Perfil as PerfilComponent } from "@/components/Perfil/Perfil";
import { IonIcon } from "@ionic/react";
import { arrowBack, settingsOutline, timeOutline } from "ionicons/icons";

import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styles from "./Perfil.module.scss";

const Perfil: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/home");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to="/home" replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-text-center"> Mi Perfil </IonTitle>

          <IonButtons slot="end">
            <Link to="/recordatorios" replace={true}>
              <IonButton>
                <IonIcon slot="icon-only" icon={timeOutline}></IonIcon>
              </IonButton>
            </Link>

            <Link to="/configuracion" replace={true}>
              <IonButton>
                <IonIcon slot="icon-only" icon={settingsOutline} />
              </IonButton>
            </Link>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <PerfilComponent />
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
