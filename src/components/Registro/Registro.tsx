import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonDatetime,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonNote,
  IonRow,
  IonSelect,
  IonSelectOption,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import styles from "./Registro.module.scss";

import { update } from "@/services/user";
import { all } from "@/services/constants";

import { getUser, setUser } from "@/helpers/onboarding";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { helpCircleOutline } from "ionicons/icons";

export const Registro = () => {
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const user = getUser();

  const [name, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [eneatipo, setEneatipo] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [constants, setConstants] = useState({ eneatipos: [], generos: [] });

  const showAlert = () => {
    presentAlert({
      subHeader: "Mensaje importante!",
      message: "Si no conoces tu eneatipo, puedes realizar el test una vez te registres.",
      buttons: ["OK"],
    });
  }

  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 14);
    return today.toISOString();
  };

  const goToHome = () => {
    setTimeout(() => {
      history.replace("/home");
    }, 1000);
  };

  const onGetConstants = async () => {
    try {
      present({
        message: "Loading ...",
      });

      const { data } = await all();
      setConstants(data);
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

  const doRegister = async (evt: any) => {
    evt.preventDefault();

    try {
      present({
        message: "Loading ...",
      });

      const {
        data: { data },
      } = await update(
        {
          name,
          eneatipo,
          fecha_nacimiento,
          device: "app",
        },
        user.user.id
      );

      await setUser({ ...user, user: data });

      goToHome();
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
    onGetConstants();
  }, []);

  return (
    <IonGrid class="ion-text-center">
      <IonRow>
        <IonCol size="12" class="ion-no-padding">
          <h4> Completar Perfil </h4>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" class="ion-no-padding ion-text-center"></IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" class="ion-no-padding ion-text-center"></IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="12" class="ion-no-padding">
          <IonCard className={`ion-no-padding`}>
            <IonCardContent>
              <img
                src="./assets/images/avatar.png"
                className={`ion-margin-bottom`}
              />
              <br />

              <span> Subir Imágen </span>
              <br />

              <IonInput
                className={`ion-margin-top ion-margin-bottom ${styles.login}`}
                type="text"
                labelPlacement="stacked"
                placeholder="Nombre"
                fill="outline"
                shape="round"
                onIonInput={(evt: any) => setNombre(evt.target.value)}
              ></IonInput>

              <IonInput
                id="open_cal"
                labelPlacement="stacked"
                placeholder="Fecha de Nacimiento"
                fill="outline"
                shape="round"
                value={fecha_nacimiento}
                className={`ion-margin-bottom ${styles.login}`}
              ></IonInput>

              <IonModal
                className={styles["date-modal"]}
                trigger="open_cal"
                keepContentsMounted={true}
              >
                <IonDatetime
                  presentation="date"
                  showDefaultButtons={true}
                  doneText="Ok"
                  cancelText="Cancelar"
                  id="datetime"
                  max={getMaxDate()}
                  onIonChange={(e) =>
                    setFechaNacimiento(e.target.value?.split("T")[0])
                  }
                ></IonDatetime>
              </IonModal>

              <IonSelect
                interface="popover"
                labelPlacement="stacked"
                placeholder="Genero"
                fill="outline"
                shape="round"
                value={genero}
                className={`ion-margin-bottom ${styles.login}`}
                onIonChange={(e) => setGenero(e.target.value)}
              >
                {constants.generos.map((item: any, idx: any) => {
                  return (
                    <IonSelectOption key={idx} value={item.key}>
                      {" "}
                      {item.valor}{" "}
                    </IonSelectOption>
                  );
                })}
              </IonSelect>

              <IonItem className="ion-no-padding" lines="none">

                <IonSelect
                  interface="popover"
                  labelPlacement="stacked"
                  placeholder="Eneatipo"
                  shape="round"
                  fill="outline"
                  className={`ion-margin-bottom ${styles.login}`}
                  value={eneatipo}
                  onIonChange={(e) => setEneatipo(e.target.value)}
                  cancelText={'clear'}
                >
                  {constants.eneatipos.map((item: any, idx: any) => {
                    return (
                      <IonSelectOption key={idx} value={item.key}>
                        {" "}
                        {item.valor}{" "}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
                
                <IonIcon slot="end" icon={helpCircleOutline} onClick={showAlert} />
              </IonItem>


              <IonLoading
                message="Dismissing after 3 seconds..."
                duration={3000}
              />
            </IonCardContent>
          </IonCard>

          <IonButton
            type="button"
            className="ion-margin-top ion-margin-bottom"
            expand="block"
            shape="round"
            disabled={!name || !fecha_nacimiento || !genero}
            onClick={(evt) => doRegister(evt)}
          >
            {" "}
            Finalizar{" "}
          </IonButton>

          <IonButton
            type="button"
            className="ion-margin-top ion-margin-bottom"
            expand="block"
            shape="round"
            onClick={goToHome}
          >
            {" "}
            Saltar por ahora{" "}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
