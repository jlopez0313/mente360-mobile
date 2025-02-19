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
import styles from "./Comunidad.module.scss";
import { Contacts } from "@capacitor-community/contacts";
import { invitar } from "@/services/user";
import { getUser } from "@/helpers/onboarding";
import { Share } from "@capacitor/share";
import { parsePhoneNumber } from "react-phone-number-input";
import { misContactos } from "@/services/user";


import { Item } from "./Item";

export const Comunidad = () => {
  const { user } = getUser();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [allContacts, setAllContacts] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);
  const [userContacts, setUserContacts] = useState<any>([]);
  const [filteredUserContacts, setFilteredUserContacts] = useState<any>([]);

  const onSearchContacts = (word: any) => {
    /*
    setContacts(
      allContacts.filter((item: any) =>
        item.name?.display
          .toLowerCase()
          .includes(evt.target.value.toLowerCase())
      )
    );
    */

    if (word) {
      const lista = userContacts.filter((u: any) =>
        u.name.toLowerCase().includes(word.toLowerCase())
      );
      setFilteredUserContacts([...lista]);
    } else {
      setFilteredUserContacts([...userContacts]);
    }
  };

  const getContacts = async () => {
    try {
      present({
        message: "Cargando ...",
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

      // Usuarios que tienen cuenta en 360
      setUserContacts(data);
      setFilteredUserContacts(data);

      // Contactos de mi teléfono
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
        message: "Cargando ...",
      });

      const body = {
        nombre: contact.name?.display,
        phone: contact.phone,
        users_id: user.id,
      };

      const { data } = await invitar(body);
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

  const onShareLink = async () => {
    await Share.share({
      title: "¡Únete a Mente360!",
      text: "Descubre contenido exclusivo y mejora tu bienestar con Mente360. ¡Haz clic para saber más!",
      url: "https://soymente360.com/invitacion/",
      dialogTitle: "Comparte Mente360 con tus amigos",
    });
  };

  

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonItem button={true} lines="none" onClick={onShareLink}>
        <IonIcon
          className="ion-no-margin"
          slot="start"
          icon={shareSocialOutline}
          size="large"
        ></IonIcon>
        <IonLabel>Enviar Enlace de Invitación</IonLabel>
      </IonItem>

      <IonList className="ion-no-padding" lines="none">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Personas en Mente360</IonLabel>
          </IonItemDivider>

          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom  ${styles["search"]}`}
            placeholder="Buscar"
            color="warning"
            onIonInput={(ev) => onSearchContacts(ev.target.value)}
          ></IonSearchbar>

          {filteredUserContacts.map((contact: any, idx: number) => {
            return contact && <Item key={idx} contact={contact} />;
          })}
        </IonItemGroup>
      </IonList>
      {/* 
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
*/}
    </div>
  );
};
