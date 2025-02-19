import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonInput,
  IonLoading,
  IonNote,
  IonRow,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import styles from "../Login.module.scss";

import { reset } from "@/services/auth";

import { useState } from "react";
import { useHistory } from "react-router";

export const Reset = () => {
  const history = useHistory();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [email, setEmail] = useState("");

  const goToLogin = () => {
    history.replace("/login");
  };

  const doReset = async (evt: any) => {
    evt.preventDefault();

    try {
      present({
        message: "Cargando ...",
      });

      const {data: {message} } = await reset({
        email,
      });

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message,
        buttons: ["OK"],
      });

      setTimeout(() => {
        history.replace("/login");
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

              <IonButton
                type="button"
                className="ion-margin-top ion-margin-bottom"
                expand="block"
                disabled={!email}
                onClick={doReset}
              >
                {" "}
                Enviar{" "}
              </IonButton>

              <IonNote onClick={goToLogin}>Regresar</IonNote>

              <IonLoading
                message="Dismissing after 3 seconds..."
                duration={3000}
              />
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
