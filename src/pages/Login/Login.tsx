import {
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonImg,
  IonLabel,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

import { Login as LoginComponent } from "@/components/Login/Login/Login";
import { useContext, useEffect, useState } from "react";
import { Register } from "@/components/Login/Register/Register";
import styles from "./Login.module.scss";
import UIContext from "@/context/Context";

import { useHistory } from "react-router";

const Login: React.FC = () => {
  
  const [tab, setTab] = useState("login");
  const history = useHistory();

  const { db, setGlobalAudio }: any = useContext(UIContext);

  const onSetTab = (e) => {
    setTab(e.detail.value);
  };

  useEffect(() => {
    setGlobalAudio(null)
  }, [])

  
  const runGet = async () => {
    const val = await db.get('user');
    console.log( 'VAL ', val );
    val && history.replace("/home");
  }
  
  useEffect(() => {
    console.log(db, history);
    db && history && runGet();
  }, [db, history])

  return (
    <IonPage>
      <IonContent className={styles['ion-content']}>
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol  className="ion-justify-content-center">
              <img src="assets/images/logo.png" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter className={styles['ion-footer']}>
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
      </IonFooter>
    </IonPage>
  );
};

export default Login;
