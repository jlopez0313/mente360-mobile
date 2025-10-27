import {
  IonLabel,
  IonContent,
  IonPage,
  IonSegmentButton
} from "@ionic/react";

import { Reset as ResetComponent } from "@/components/Login/Reset/Reset";
import { useEffect } from "react";
import styles from "./Reset.module.scss";

import { useDispatch } from "react-redux";

import { setGlobalAudio } from "@/store/slices/audioSlice";

const Reset: React.FC = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setGlobalAudio(""));
  }, []);

  return (
    <IonPage>
      <IonContent className={`ion-text-center ${styles["ion-content"]}`}>

        <div className={`flex justify-center items-center ${styles.logodiv}`}>
          <img
            src="assets/images/logo.png"
            className={`${styles.logoimg}`}
          />
        </div>

        

        <div className={`ion-padding ${styles.content}`}>
          <div className={`ion-left ${styles.titlelogin}`}>
          <IonLabel>¿Olvidaste tu contraseña?
          </IonLabel>
        </div>

        <div className={`ion-left ${styles.subtitlelogin}`}>
          <IonLabel>Proporciona tu correo y te enviaremos un enlace para restaurar tu contraseña
          </IonLabel>
        </div>
          <ResetComponent />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Reset;
