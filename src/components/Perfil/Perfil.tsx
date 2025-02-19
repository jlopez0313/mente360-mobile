import {
  IonAvatar,
  IonButton,
  IonChip,
  IonCol,
  IonDatetime,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import styles from "./Perfil.module.scss";
import { getUser, setUser } from "@/helpers/onboarding";
import { useEffect, useRef, useState } from "react";
import { all } from "@/services/constants";
import { update } from "@/services/user";
import { Link } from "react-router-dom";
import { localDB } from "@/helpers/localStore";
import Avatar from "@/assets/images/avatar.jpg";

import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { updateData, writeData, getData } from "@/services/realtime-db";

export const Perfil = () => {
  const fileRef = useRef(null);
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const user = getUser();
  const homeDB = localDB("home");

  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState("");
  const [usuario, setUsuario] = useState(user.user);
  const [edad, setEdad] = useState(0);
  const [constants, setConstants] = useState({ eneatipos: [], generos: [] });

  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 14);
    return today.toISOString();
  };

  const onGetConstants = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      setPhoto(usuario.photo ? baseURL + usuario.photo : Avatar);

      const { data } = await all();
      setConstants(data);
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

  const onSetUser = (idx: string, value: string | boolean) => {
    usuario[idx] = value;
    setUsuario({ ...usuario });
  };

  const onClickFile = () => {
    fileRef.current?.click();
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

  const compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 && o1 == o2;
  };

  const onGetEdad = () => {
    if (!usuario.fecha_nacimiento) {
      setEdad(0);
      return;
    }

    const date = new Date(usuario.fecha_nacimiento);
    const today = new Date();

    const diffInMs = today - date;

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    setEdad(Math.floor(diffInDays / 365.25));
  };

  const onUpdateUser = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      if (usuario.eneatipo != user.user.eneatipo) {
        homeDB.clear();
      }

      const { data } = await update(usuario, user.user.id);

      setUser({ ...user, user: data.data });
      setUsuario(data.data);

      const obj = {
        name: data.data.name,
        phone: data.data.phone,
        photo: data.data.photo,
      };

      const [roomsResponse, gruposResponse] = await Promise.all([
        getData(`user_rooms/${user.user.id}/rooms`),
        getData(`user_rooms/${user.user.id}/grupos`),
      ]);

      const rt_data = roomsResponse.val();
      const roomUpdatePromises = Object.keys(rt_data ?? {}).map((room) => {
        updateData(`rooms/${room}/users/${user.user.id}`, obj);
      });

      const rt_grupos = gruposResponse.val();
      const grupoUpdatePromises = Object.keys(rt_grupos ?? {}).map((grupo) => {
        updateData(`grupos/${grupo}/users/${user.user.id}`, obj);
      });

      await Promise.all([...roomUpdatePromises, ...grupoUpdatePromises]);
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

  useEffect(() => {
    onGetConstants();
  }, []);

  useEffect(() => {
    onGetEdad();
  }, [usuario]);

  return (
    <div className="">
      <div>
        <IonItem lines="none">
          <input
            type="file"
            className="ion-hide"
            ref={fileRef}
            onChange={onUploadImage}
            accept="image/png, image/jpeg"
          />
          <IonAvatar slot="start">
            {isLoading && (
              <IonSkeletonText
                animated
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                }}
              />
            )}
            <img
              src={photo}
              style={{ display: isLoading ? "none" : "block" }}
              onClick={onClickFile}
              onLoad={() => setIsLoading(false)}
            />
          </IonAvatar>
          <IonLabel>
            {usuario.name}
            <br />
            {usuario.email}
          </IonLabel>
          <span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
        </IonItem>
      </div>

      <div className={`ion-margin-top ion-margin-bottom ${styles.profile}`}>
        <div className={styles.info}>
          <IonChip outline={true}>{edad || "00"}</IonChip>
          <IonNote>
            {" "}
            <strong> Edad </strong>{" "}
          </IonNote>
        </div>
        <div className={styles.info}>
          <IonChip outline={true} className="ion-padding-start ion-padding-end">
            {usuario.eneatipo || "-"}
          </IonChip>
          <IonNote>
            {" "}
            <strong> Eneatipo </strong>{" "}
          </IonNote>
        </div>
        <div className={styles.info}>
          <IonChip outline={true}>{usuario.genero || "--"}</IonChip>
          <IonNote>
            {" "}
            <strong> Género </strong>{" "}
          </IonNote>
        </div>
      </div>

      <IonInput
        labelPlacement="stacked"
        fill="outline"
        placeholder="Nombre de Usuario"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.name}
        onIonChange={(e) => onSetUser("name", e.target.value)}
      ></IonInput>

      <PhoneInput
        defaultCountry={usuario.country}
        className={`ion-margin-bottom ${styles.phone}`}
        placeholder="Teléfono"
        value={usuario.phone}
        onChange={(e) => onSetUser("phone", e)}
        onCountryChange={(e) => onSetUser("country", e)}
        initialValueFormat="national"
        inputFormat="NATIONAL"
      />

      <IonInput
        labelPlacement="floating"
        fill="outline"
        placeholder="Correo Electrónico"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.email}
        readonly={true}
      ></IonInput>

      <IonInput
        id="open_cal"
        labelPlacement="stacked"
        fill="outline"
        placeholder="Fecha de Nacimiento"
        value={usuario.fecha_nacimiento}
        className={`ion-margin-bottom ${styles.profile}`}
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
            onSetUser("fecha_nacimiento", e.target.value?.split("T")[0])
          }
          value={usuario.fecha_nacimiento}
        ></IonDatetime>
      </IonModal>

      <IonSelect
        interface="popover"
        labelPlacement="stacked"
        fill="outline"
        placeholder="Genero"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.genero}
        compareWith={compareWithFn}
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

      <IonSelect
        interface="popover"
        labelPlacement="stacked"
        fill="outline"
        placeholder="Eneatipo"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.eneatipo}
        compareWith={compareWithFn}
        onIonChange={(e) => onSetUser("eneatipo", e.target.value)}
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

      <IonGrid>
        <IonRow>
          <IonCol size="6" class="ion-no-padding">
            <Link to="/home" replace={true}>
              <IonButton expand="block">Cancelar</IonButton>
            </Link>
          </IonCol>
          <IonCol size="6" class="ion-no-padding">
            <IonButton
              expand="block"
              onClick={onUpdateUser}
              disabled={
                !usuario.phone ||
                (usuario.phone && !isPossiblePhoneNumber(usuario.phone))
              }
            >
              Guardar
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};
