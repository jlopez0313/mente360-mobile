import {
  IonContent,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";

import { Login as LoginComponent } from "@/components/Login/Login/Login";
import { Register as RegisterComponent  } from "@/components/Login/Register/Register";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../Login.module.scss";

import { setGlobalAudio } from "@/store/slices/audioSlice";

const Register: React.FC = () => {

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
        <div className={`flex justify-center items-center ${styles.logodiv}`}>
          <img
            src="assets/images/logo.png"
            className={`${styles.logoimg}`}
          />
        </div>
        <div className={`ion-padding ${styles.content}`}>
          {/* <IonSegment value={tab} onIonChange={onSetTab}>
            <IonSegmentButton value="login">
              <IonLabel>Iniciar Sesión</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="register">
              <IonLabel>Crear Cuenta</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {tab == "login" ? <LoginComponent /> : <Register />} */}
          <RegisterComponent /> 
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
