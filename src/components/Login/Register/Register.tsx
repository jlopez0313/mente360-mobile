import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonRow,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import styles from "../Login.module.scss";

import { setUser, clearUser } from "@/helpers/onboarding";
import { register } from "@/services/auth";

import { useHistory } from "react-router";
import { useEffect, useState } from "react";

export const Register = () => {
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doRegister = async (evt: any) => {
    evt.preventDefault();

    try {
      present({
        message: "Loading ...",
      });

      const { data } = await register({
        email,
        password,
        device: "app",
      });

      await setUser(data);

      setTimeout(() => {
        history.replace("/registro");
      }, 1000);
    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  useEffect(() => {
    clearUser()
  }, [])

  return (
    <IonGrid class="ion-text-center">
      <IonRow>
        <IonCol size="12" class="ion-no-padding">
          <IonCard className={`ion-no-padding`}>
            <IonCardContent>
              <IonInput
                className={`ion-margin-bottom ${styles.login}`}
                type="email"
                labelPlacement="stacked"
                placeholder="Correo"
                fill="outline"
                shape="round"
                onIonInput={(evt: any) => setEmail(evt.target.value)}
              ></IonInput>
              
              <IonInput
                className={`ion-margin-bottom ${styles.login}`}
                type="password"
                labelPlacement="stacked"
                placeholder="Contraseña"
                fill="outline"
                shape="round"
                onIonInput={(evt: any) => setPassword(evt.target.value)}
              ></IonInput>
              
              <IonButton
                type="button"
                className="ion-margin-top ion-margin-bottom"
                expand="block"
                shape="round"
                disabled={!email || !password}
                onClick={(evt) => doRegister(evt)}
              >
                {" "}
                Acceder{" "}
              </IonButton>

              <IonNote> &nbsp; </IonNote>

              <IonLoading
                message="Dismissing after 3 seconds..."
                duration={3000}
              />
            </IonCardContent>
          </IonCard>
          <IonLabel>O iniciar sesión con </IonLabel> <br />
          <br />
          <img
            className={styles["logo-google"]}
            src="assets/images/logoGoogle.png"
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
