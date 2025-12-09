import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonLoading,
  IonRow,
  useIonAlert,
  useIonLoading
} from "@ionic/react";
import styles from "../Login.module.scss";

import { reset } from "@/services/auth";

import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

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

      const { data: { message } } = await reset({
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

          <IonInput
            className={`ion-margin-bottom ${styles.login}`}
            type="email"
            labelPlacement="stacked"
            placeholder="Correo"
            fill="outline"
            onIonInput={(evt: any) => setEmail(evt.target.value)}
          ></IonInput>

          <br></br>

          <IonButton
            shape="round"
            type="button"
            className="ion-margin-top ion-margin-bottom"
            expand="block"
            disabled={!email}
            onClick={doReset}
          >
            {" "}
            Enviar{" "}
          </IonButton>

          <Link to="/login" replace={true}>
            <IonButton fill="outline" className="yellow-outline-button" shape="round" expand="block">Volver</IonButton>
          </Link>

          <IonLoading
            message="Dismissing after 3 seconds..."
            duration={3000}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
