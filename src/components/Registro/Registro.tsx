import Avatar from "@/assets/images/avatar.jpg";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonDatetime,
  IonGrid,
  IonInput,
  IonLoading,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  useIonAlert,
  useIonLoading
} from "@ionic/react";
import styles from "./Registro.module.scss";

import { all } from "@/services/constants";
import { update } from "@/services/user";

import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

import { setUser } from "@/store/slices/userSlice";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";

export const Registro = () => {
  const fileRef = useRef(null);
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const history = useHistory();
  const dispatch = useDispatch();

  const { user } = useSelector( (state: any) => state.user);
  const [usuario, setUsuario] = useState({ ...user, country: "CO" });

  const [photo, setPhoto] = useState("");
  const [constants, setConstants] = useState({ eneatipos: [], generos: [] });

  const showAlert = () => {
    presentAlert({
      subHeader: "Mensaje importante!",
      message:
        "Si no conoces tu eneatipo, puedes realizar el test una vez te registres.",
      buttons: ["OK"],
    });
  };

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

  const onClickFile = () => {
    fileRef.current?.click();
  };

  const onSetUser = (idx: string, value: string | boolean | any) => {
    usuario[idx] = value;
    setUsuario({ ...usuario });
  };

  const onUploadImage = (evt: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function (event: any) {
      onSetUser("photo", event.target.result);
      onSetUser("newPhoto", true);
      setPhoto(event.target.result);
    };
    reader.onerror = function () {
      // notify(t("profile.alerts.error-image"), "error");
    };
  };

  const onGetConstants = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const { data } = await all();
      setConstants(data);
    } catch (error: any) {
      console.log( error )

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
        message: "Cargando ...",
      });


      
      const updatePromise = update(usuario, user.id);
      
      const setUserPromise = updatePromise.then( ({ data }) => {
        return dispatch(setUser(data.data));
      });

      await Promise.all([updatePromise, setUserPromise]);

      goToHome();
    } catch (error: any) {
      console.log( error )

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
          <h4 className="ion-no-margin"> Completar Perfil </h4>
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
              <input
                type="file"
                className="ion-hide"
                ref={fileRef}
                onChange={onUploadImage}
                accept="image/png, image/jpeg"
              />
              <div
                style={{
                  backgroundImage: `url(${photo || Avatar})`,
                }}
                className={`${styles["avatar-container"]}`}
                onClick={onClickFile}
              ></div>
              <span className={`${styles["upload-text"]}`}> Subir Imágen</span>
              <br />

              <IonInput
                className={`ion-margin-top ion-margin-bottom ${styles.login}`}
                type="text"
                labelPlacement="stacked"
                placeholder="Nombre"
                fill="outline"
                onIonInput={(evt: any) => onSetUser("name", evt.target.value)}
              ></IonInput>

              <PhoneInput
                defaultCountry={usuario.country}
                className={`ion-margin-top ion-margin-bottom ${styles.login}`}
                placeholder="Teléfono"
                onChange={(e) => onSetUser("phone", e)}
                onCountryChange={(e) => onSetUser("country", e)}
                initialValueFormat="national"
              />

              <IonInput
                id="open_cal"
                labelPlacement="stacked"
                placeholder="Fecha de Nacimiento"
                fill="outline"
                value={usuario.fecha_nacimiento}
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
                  onIonChange={(e: any) =>
                    onSetUser("fecha_nacimiento", e.target.value?.split("T")[0])
                  }
                ></IonDatetime>
              </IonModal>

              <IonSelect
                interface="popover"
                labelPlacement="stacked"
                placeholder="Genero"
                fill="outline"
                value={usuario.genero}
                className={`ion-margin-bottom ${styles.login}`}
                onIonChange={(e) => onSetUser("genero", e.target.value)}
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
              {/* 
              <IonItem className="ion-no-padding" lines="none">
                <IonSelect
                  interface="popover"
                  labelPlacement="stacked"
                  placeholder="Eneatipo"
                  fill="outline"
                  className={`ion-margin-bottom ${styles.login}`}
                  value={usuario.eneatipo}
                  onIonChange={(e) => onSetUser("eneatipo", e.target.value)}
                  cancelText={"clear"}
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

                <IonIcon
                  slot="end"
                  icon={helpCircleOutline}
                  onClick={showAlert}
                />
              </IonItem>
*/}
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
            disabled={
              !usuario.name ||
              !usuario.fecha_nacimiento ||
              !usuario.genero ||
              !usuario.phone ||
              (usuario.phone && !isPossiblePhoneNumber(usuario.phone))
            }
            onClick={(evt) => doRegister(evt)}
          >
            {" "}
            Finalizar{" "}
          </IonButton>

          <IonButton
            type="button"
            className="ion-margin-top ion-margin-bottom"
            expand="block"
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
