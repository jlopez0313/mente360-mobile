import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonLoading,
  IonNote,
  IonRow,
  useIonAlert,
  useIonLoading
} from "@ionic/react";
import styles from "../Login.module.scss";

import { GmailLogin } from "@/firebase/auth";
import { login, register } from "@/services/auth";

import { usePreferences } from "@/hooks/usePreferences";
import { setUser } from "@/store/slices/userSlice";
import { eye, eyeOff } from "ionicons/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

export const Login = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const { keys, setPreference } = usePreferences();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const goToResetPwd = () => {
    history.replace("/reset");
  }

  const doLogin = async (evt: any) => {
    evt.preventDefault();

    try {
      present({
        message: "Cargando ...",
      });

      const { data } = await login({
        email,
        password,
        device: "app",
      });
      /*
      const token = await FCM.getToken();
      console.log("FCM Token:", token.token);

      data.fcm_token = token.token;
*/
      await setPreference(keys.TOKEN, data.token);
      dispatch(setUser(data.user));

      setTimeout(() => {
        history.replace("/home");
      }, 1000);
    } catch (error: any) {
      console.log(error);

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
            const loginPromise = login({
              email: gmailData.email,
              password: "gmail",
              device: "gmail",
            });

            const setUserPromise = loginPromise.then(({ data }: any) => {
              return dispatch(setUser(data));
            });

            await Promise.all([
              loginPromise,
              setUserPromise,
            ]);

            setTimeout(() => {
              history.replace("/home");
            }, 1000);

            dismiss();
          } catch (error: any) {
            console.log(error);

            if (error.status == "401") {
              const registerPromise = register({
                name: gmailData.displayName,
                email: gmailData.email,
                password: "gmail",
                device: "gmail",
              });

              const setUserPromise = registerPromise.then(({ data }: any) => {
                return dispatch(setUser(data));
              });

              await Promise.all([
                registerPromise,
                setUserPromise,
              ]);

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
      console.log(error);

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
                onIonInput={(evt: any) => setEmail(evt.target.value)}
              ></IonInput>

              <IonInput
                className={`ion-margin-bottom ${styles.login}`}
                type={showPassword ? "text" : "password"}
                labelPlacement="stacked"
                placeholder="Contraseña"
                fill="outline"
                onIonInput={(evt: any) => setPassword(evt.target.value)}
              >
                <IonIcon
                  icon={showPassword ? eyeOff : eye}
                  slot="end"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                />
              </IonInput>

              <IonButton
                type="button"
                className="ion-margin-top ion-margin-bottom"
                expand="block"
                disabled={!email || !password}
                onClick={doLogin}
              >
                {" "}
                Acceder{" "}
              </IonButton>

              <IonNote
                onClick={goToResetPwd}
                >Recuperar Contraseña</IonNote>

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
