import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import styles from "../Chat.module.scss";
import { Contacts } from "@capacitor-community/contacts";
import avatar from "/assets/icons/avatar.svg";
import { invitar } from "@/services/user";
import { getUser } from "@/helpers/onboarding";
import { Share } from "@capacitor/share";
import { parsePhoneNumber } from "react-phone-number-input";
import { misContactos } from "@/services/user";
import Avatar from "@/assets/images/avatar.jpg";

export const Comunidad = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { user } = getUser();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [allContacts, setAllContacts] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);
  const [userContacts, setUserContacts] = useState<any>([]);

  const onSearchContacts = (evt: any) => {
    setContacts(
      allContacts.filter((item: any) =>
        item.name?.display
          .toLowerCase()
          .includes(evt.target.value.toLowerCase())
      )
    );
  };

  const getContacts = async () => {
    try {
      present({
        message: "Loading ...",
      });

      const projection = {
        name: true,
        phones: true,
        postalAddresses: false,
        emails: true,
        image: false,
      };

      const { contacts } = await Contacts.getContacts({
        projection,
      });

      const lista =
        contacts
          .filter((x) => x.name && x.phones)
          .map((item: any) => {
            const mainPhone = item.phones[0]?.number?.replace(/[\s~`-]/g, "");
            const phoneNumber = parsePhoneNumber(mainPhone);
            const phone = (!phoneNumber?.country ? "+57" : "") + mainPhone;

            return {
              ...item,
              phone,
              invitado:
                user.invitados?.find((x: any) => x.phone == phone) || false,
            };
          })
          .sort((a: any, b: any) =>
            a.name?.display.toLowerCase() > b.name?.display.toLowerCase()
              ? 1
              : -1
          ) || [];

      const body = {
        user_id: user.id,
        lista: lista.map((x) => x.phone),
      };

      const {
        data: { data },
      } = await misContactos(body);

      setUserContacts(data);

      setAllContacts(lista);
      setContacts(lista);
    } catch (error: any) {
      console.error(error);

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

  const onInvitar = async (contact: any) => {
    try {
      present({
        message: "Loading ...",
      });

      const body = {
        nombre: contact.name?.display,
        phone: contact.phone,
        users_id: user.id,
      };

      const { data } = await invitar(body);
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

  const onShareLink = async () => {
    await Share.share({
      title: "See cool stuff",
      text: "Really awesome thing you need to see right meow",
      url: "http://ionicframework.com/",
      dialogTitle: "Share with buddies",
    });
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonItem
        className="ion-margin-bottom"
        button={true}
        lines="none"
        onClick={onShareLink}
      >
        <IonIcon
          className="ion-no-margin"
          slot="start"
          icon={shareSocialOutline}
          size="large"
        ></IonIcon>
        <IonLabel>Enviar Enlace de Invitación</IonLabel>
      </IonItem>

      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Personas en Mente360</IonLabel>
          </IonItemDivider>

          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["searc"]}`}
            placeholder="Buscar"
            color="warning"
            onIonInput={(ev) => onSearchContacts(ev)}
          ></IonSearchbar>

          {userContacts.map((contact: any, idx: number) => {
            return (
              contact && (
                <IonItem
                  key={idx}
                  button={true}
                  className={`ion-margin-bottom ${styles["contact"]}`}
                >
                  <IonAvatar aria-hidden="true" slot="start">
                    <img
                      alt=""
                      src={contact.photo ? baseURL + contact.photo : Avatar}
                    />
                  </IonAvatar>
                  <IonLabel className="ion-no-margin">
                    <span className={styles["name"]}>
                      {" "}
                      {contact.name || "-"}{" "}
                    </span>
                    <span className={styles["phone"]}>
                      {" "}
                      {contact.phone || "-"}{" "}
                    </span>
                  </IonLabel>
                  <IonNote slot="end"> Añadir </IonNote>
                </IonItem>
              )
            );
          })}
        </IonItemGroup>
      </IonList>

      <IonList className="ion-no-padding" lines="none">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Aún no están en Mente360</IonLabel>
          </IonItemDivider>

          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["searc"]}`}
            placeholder="Buscar"
            color="warning"
            onIonInput={(ev) => onSearchContacts(ev)}
          ></IonSearchbar>

          {contacts.map((contact: any, idx: number) => {
            return (
              contact && (
                <IonItem
                  key={idx}
                  button={true}
                  className={`ion-margin-bottom ${styles["contact"]}`}
                >
                  <IonAvatar aria-hidden="true" slot="start">
                    <img alt="" src={avatar} />
                  </IonAvatar>
                  <IonLabel className="ion-no-margin">
                    <span className={styles["name"]}>
                      {" "}
                      {contact.name?.display || "-"}{" "}
                    </span>
                    <span className={styles["phone"]}>
                      {" "}
                      {contact.phone || "-"}{" "}
                    </span>
                  </IonLabel>
                  <IonNote slot="end" onClick={() => onInvitar(contact)}>
                    {" "}
                    {contact.invitado ? "Solicitud Enviada" : "Invitar"}{" "}
                  </IonNote>
                </IonItem>
              )
            );
          })}
        </IonItemGroup>
      </IonList>
    </div>
  );
};
