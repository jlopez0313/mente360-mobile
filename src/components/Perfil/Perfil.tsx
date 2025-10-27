import Avatar from "@/assets/images/load-avatar.png";
import { update } from "@/services/user";
import {
  IonItemDivider,
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
import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./Perfil.module.scss";

import { updateData } from "@/services/realtime-db";
import { setRoute } from "@/store/slices/routeSlice";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";

import { diferenciaEnDias } from "@/helpers/Fechas";
import { db } from '@/hooks/useDexie';
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import { setUser } from "@/store/slices/userSlice";
import { toastController } from "@ionic/core";
import { useLiveQuery } from "dexie-react-hooks";

export const Perfil = () => {
  const fileRef = useRef(null);
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const dispatch = useDispatch();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const { userEnabled, payment_status } = usePayment();

  const { user } = useSelector((state: any) => state.user);
  const history = useHistory();
  const network = useNetwork();

  const [isLoading, setIsLoading] = useState(true);
  const [photo, setPhoto] = useState("");
  const [usuario, setUsuario] = useState({ ...user });
  const [edad, setEdad] = useState(0);
  const generos = useLiveQuery(() => db.generos.toArray());
  const eneatipos = useLiveQuery(() => db.eneatipos.toArray());

  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 14);
    return today.toISOString();
  };

  const onGetConstants = async () => {
    try {
      present({
        message: "Cargando...",
        duration: 200,
      });

      setPhoto(usuario.photo ? baseURL + usuario.photo : Avatar);

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

  const onSetUser = (idx: string, value: any) => {
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
    const diffInDays = diferenciaEnDias(date, today);
    setEdad(Math.floor(diffInDays / 365.25));
  };

  const onUpdateUser = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const { data } = await update(usuario, user.id);

      dispatch(setUser(data.data));
      setUsuario({ ...data.data });

      const obj = {
        name: data.data.name,
        phone: data.data.phone,
        photo: data.data.photo,
        edad: edad,
        eneatipo: usuario.eneatipo,
        genero: usuario.genero,
      };

      await updateData(`users/${user.id}`, obj);

      const toast = await toastController.create({
        message: "Perfil Actualizado!",
        duration: 1000
      });

      toast.present();

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

  const goToPlanes = async () => {
    history.replace('/planes');
  }

  const goToSuscripcion = async () => {
    history.replace('/suscripcion');
  }

  const getFechaVencimiento = () => {
    return new Date(user.fecha_vencimiento).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replaceAll('/', '-')
  }

  useEffect(() => {
    dispatch(setRoute("/perfil"));
    onGetConstants();
  }, []);

  useEffect(() => {
    onGetEdad();
  }, [usuario]);

  return (
    <div>
      <div className="flex justify-center">
        <IonItem lines="none">
          <input
            type="file"
            className="ion-hide"
            ref={fileRef}
            onChange={onUploadImage}
            accept="image/png, image/jpeg"
          />
          <IonAvatar slot="start" className={styles.avatar}>
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

        </IonItem>
      </div>

      <div className={`ion-margin-top ion-margin-bottom ${styles.profile} ${styles.paddinginfo}`}>
        <div className={styles.info}>
          <IonChip outline={true}>{edad || "00"}</IonChip>
          <IonNote>
            {" "}
            <strong> Edad </strong>{" "}
          </IonNote>
        </div>
        <div className={`${styles.info} ${styles.borderchip}`}>
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

      {
        userEnabled && payment_status != 'free' ?
          <div
            className={`ion-margin-top ion-margin-bottom ion-text-center ${styles['premium']}`}
            onClick={goToSuscripcion}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 'bold' }}>{import.meta.env.VITE_NAME} PREMIUM</span>
              <span>Vence el: {getFechaVencimiento()}</span>
            </div>
            <div>
              <span className={styles['detalle']}>Ver Detalles</span>
            </div>
          </div>
          :

          <div className={`ion-margin-top ion-margin-bottom ion-text-center`}>
            <IonButton className="green-solid-button" onClick={goToPlanes} expand="block">Unete a {import.meta.env.VITE_NAME} PREMIUM </IonButton>
          </div>
      }

      <IonItemDivider className="line-divider"></IonItemDivider>

      <IonItem slot="header" lines="none">
        <span className="material-symbols-outlined">info</span>
        <IonLabel className={styles.detailinfo}>Tu información personal permanecerá privada y no podrá ser vista por otros. Solo tú tendrás acceso a ella
        </IonLabel>
      </IonItem>

      <div className={styles.titlemargin}>
        <IonLabel className="title-bold16">Datos Generales
        </IonLabel>
      </div>

      <IonInput
        labelPlacement="stacked"
        fill="outline"
        placeholder="Nombre de Usuario"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.name}
        onIonInput={(e) => onSetUser("name", e.target.value)}
      >
        <span slot="start" className="material-symbols-outlined">person</span>

      </IonInput>

      <IonInput
        id="open_cal"
        labelPlacement="stacked"
        fill="outline"
        placeholder="Fecha de Nacimiento"
        value={usuario.fecha_nacimiento}
        className={`ion-margin-bottom ${styles.profile}`}
      >
        <span slot="start" className="material-symbols-outlined">calendar_month</span>
      </IonInput>

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
        <span slot="start" className="material-symbols-outlined">transgender</span>

        {generos?.map((item: any, idx: any) => {
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
        <span slot="start" className="material-symbols-outlined">sell</span>

        {eneatipos?.map((item: any, idx: any) => {
          return (
            <IonSelectOption key={idx} value={item.key}>
              {" "}
              {item.valor}{" "}
            </IonSelectOption>
          );
        })}
      </IonSelect>

      <IonItemDivider className="line-divider"></IonItemDivider>
      <div className={styles.titlemargin}>
        <IonLabel className="title-bold16">Datos De Contacto
        </IonLabel>
      </div>

      <IonInput
        labelPlacement="floating"
        fill="outline"
        placeholder="Correo Electrónico"
        className={`ion-margin-bottom ${styles.profile}`}
        value={usuario.email}
        readonly={true}
      >
        <span slot="start" className="material-symbols-outlined">mail</span>
      </IonInput>

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
      <br></br>
      <div className="ion-no-padding">
        <IonButton
          className={styles.titlemargin}
          shape="round"
          expand="block"
          onClick={onUpdateUser}
          disabled={
            !network.status ||
            !usuario.phone ||
            (usuario.phone && !isPossiblePhoneNumber(usuario.phone))
          }
        >
          Guardar
        </IonButton>

        <Link to="/home" replace={true}>
          <IonButton fill="outline" className="yellow-outline-button" shape="round" expand="block">Volver</IonButton>
        </Link>
      </div>
    </div>
  );
};
