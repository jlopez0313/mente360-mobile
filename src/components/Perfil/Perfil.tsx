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

export const Perfil = () => {

  const fileRef = useRef(null);
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const user = getUser();
  const homeDB = localDB('home');

  const [photo, setPhoto] = useState(null);
  const [usuario, setUsuario] = useState(user.user);
  const [edad, setEdad] = useState(0);
  const [constants, setConstants] = useState({ eneatipos: [], generos: [] });

  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear( today.getFullYear() - 14 )
    return today.toISOString()
  }

  const onGetConstants = async () => {
    try {
      present({
        message: "Loading ...",
      });

      setPhoto( baseURL + usuario.photo )

      console.log( baseURL + usuario.photo );

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

  const onSetUser = (idx: string, value: string) => {
    usuario[idx] = value;
    setUsuario({ ...usuario });
  };

  const onClickFile = () => {
    fileRef.current?.click();
  }

  const onUploadImage = (evt: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function (event: any) {
      onSetUser('photo', event.target.result);
      setPhoto( event.target.result )
    };
    reader.onerror = function () {
      // notify(t("profile.alerts.error-image"), "error");
    };
  };

  const compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 && o1 == o2;
  };

  const onGetEdad = () => {

    if ( !usuario.fecha_nacimiento ) {
      setEdad(0)
      return 
    }

    const date = new Date( usuario.fecha_nacimiento );
    const today = new Date();

    const diffInMs = today - date;

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24 );
    setEdad( Math.floor (diffInDays / 365.25) );
  }

  const onUpdateUser = async () => {
    try {
      present({
        message: "Loading ...",
      });

      if ( usuario.eneatipo != user.user.eneatipo ) {
        homeDB.clear();
      }

      const { data } = await update(usuario, user.user.id);
      setUser({...user, user: data.data});
      setUsuario(data.data);

    } catch (error: any) {
      console.log( error );

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  }

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
          <input type="file" className="ion-hide" ref={fileRef} onChange={onUploadImage} accept="image/png, image/jpeg"/>
          <IonAvatar slot="start">
            <div 
                style={{
                backgroundImage: `url(${photo || Avatar})`,
              }}
              className={`${styles['avatar-container']}`}
              onClick={onClickFile}
            ></div>
          </IonAvatar>
          <IonLabel>
            {usuario.name}
            <br />
            {usuario.email}
          </IonLabel>
          <span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span>
        </IonItem>
      </div>

      <div className={`ion-margin-bottom ${styles.profile}`}>
        <div className={styles.info}>
          <IonChip outline={true}>
            { edad  || '00' }
          </IonChip>
          <IonNote>
            {" "}
            <strong> Edad </strong>{" "}
          </IonNote>
        </div>
        <div className={styles.info}>
          <IonChip outline={true} className="ion-padding-start ion-padding-end">
            {usuario.eneatipo || '-'}
          </IonChip>
          <IonNote>
            {" "}
            <strong> Eneatipo </strong>{" "}
          </IonNote>
        </div>
        <div className={styles.info}>
          <IonChip outline={true}>
            {usuario.genero || '--' }
          </IonChip>
          <IonNote>
            {" "}
            <strong> Género </strong>{" "}
          </IonNote>
        </div>
      </div>

      <IonInput
        labelPlacement="stacked"
        fill="outline"
        shape="round"
        placeholder="Nombre de Usuario"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.name}
      ></IonInput>

      <IonInput
        labelPlacement="floating"
        shape="round"
        fill="outline"
        placeholder="Correo Electrónico"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.email}
        readonly={true}
      ></IonInput>

      <IonInput
        id="open_cal"
        labelPlacement="stacked"
        shape="round"
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
        ></IonDatetime>
      </IonModal>

      <IonSelect
        interface="popover"
        labelPlacement="stacked"
        shape="round"
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
        shape="round"
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
          <IonCol size="6">
            <Link to='/home' replace={true}>
              <IonButton shape="round" expand="block">
                Cancelar
              </IonButton>
            </Link>
          </IonCol>
          <IonCol size="6">
            <IonButton shape="round" expand="block" onClick={onUpdateUser}>
              Guardar
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};
