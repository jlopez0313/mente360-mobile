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

import { setUser } from "@/helpers/onboarding";
import { login } from "@/services/auth";
import { GmailLogin } from "@/firebase/auth";
import { register } from "@/services/auth";

import { useContext, useEffect, useState } from "react";
import UIContext from "@/context/Context";
import { useHistory } from "react-router";

export const Login = () => {
  const { db }: any = useContext(UIContext);
  const history = useHistory();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async (evt: any) => {
    evt.preventDefault();

    try {
      present({
        message: "Loading ...",
      });

      const { data } = await login({
        email,
        password,
        device: "app",
      });

      await setUser(data);
      db.set("user", email);

      setTimeout(() => {
        history.replace("/home");
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

  const onGmailLogin = async () => {
    try {
      present({
        message: "Loading...",
      });

      GmailLogin()
        .then(async (gmailData: any) => {
          try {
            const { data } = await login({
              email: gmailData.email,
              password: "gmail",
              device: "gmail",
            });

            await setUser(data);
            db.set("user", gmailData.email);

            setTimeout(() => {
              history.replace("/home");
            }, 1000);

            dismiss();
          } catch (error: any) {
            if (error.status == "401") {
              const { data: data2 } = await register({
                name: gmailData.displayName,
                email: gmailData.email,
                password: "gmail",
                device: "gmail",
              });

              await setUser(data2);
              db.set("user", gmailData.email);

              setTimeout(() => {
                history.replace("/perfil");
              }, 1000);

              dismiss();
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          dismiss();
        });
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
                onClick={doLogin}
              >
                {" "}
                Acceder{" "}
              </IonButton>

              <IonNote>Recuperar Contraseña</IonNote>

              <IonLoading
                message="Dismissing after 3 seconds..."
                duration={3000}
              />
            </IonCardContent>
          </IonCard>
          {/* 
            <IonLabel>O ingresa con </IonLabel> <br />
            <br />
            <img
              className={styles['logo-google'] }
              src="assets/images/logoGoogle.png"
              onClick={onGmailLogin}
            />
          */}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
