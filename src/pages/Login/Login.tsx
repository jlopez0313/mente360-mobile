import {
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";

import { Login as LoginComponent } from "@/components/Login/Login/Login";
import { Register } from "@/components/Login/Register/Register";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./Login.module.scss";

import { setGlobalAudio } from "@/store/slices/audioSlice";

const Login: React.FC = () => {

  const [tab, setTab] = useState("login");  
  const dispatch = useDispatch();
  
  const onSetTab = (e: any) => {
    setTab(e.detail.value);
  };

  useEffect(() => {
    dispatch(setGlobalAudio(""));
  }, []);

  return (
    <IonPage>
      <IonContent className={`ion-text-center ${styles["ion-content"]}`}>
        <img
          src="assets/images/logo.png"
          className="ion-text-center ion-margin-top"
        />

        <div className={`ion-padding ${styles.content}`}>
          <IonSegment value={tab} onIonChange={onSetTab}>
            <IonSegmentButton value="login">
              <IonLabel>Iniciar Sesión</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="register">
              <IonLabel>Crear Cuenta</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {tab == "login" ? <LoginComponent /> : <Register />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
