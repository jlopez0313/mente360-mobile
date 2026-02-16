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
import { arrowBack } from "ionicons/icons";

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

          <IonTitle > Mi Perfil </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        <PerfilComponent />
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
