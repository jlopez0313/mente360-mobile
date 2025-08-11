import {
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
