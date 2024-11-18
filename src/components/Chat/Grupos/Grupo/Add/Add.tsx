import {
  IonAvatar,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import styles from "./Add.module.scss";
import { camera, cameraOutline } from "ionicons/icons";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";
import { parsePhoneNumber } from "react-phone-number-input";
import { Contacts } from "@capacitor-community/contacts";
import { misContactos } from "@/services/user";
import { updateData, writeData } from "@/services/realtime-db";

interface Props {
  grupoID: any;
  users: any;
  doChild?: any;
}

export const Add = ({ grupoID, users, doChild }: Props) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { user } = getUser();

  const [present, onDismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [allContacts, setAllContacts] = useState<any>([]); // todos los contactos con usuario registrado
  const [userContacts, setUserContacts] = useState<any>([]); // AllContacts filtrados
  const [contactosAgregados, setContactosAgregados] = useState<any>([]); // AllContacts agregados al grupo

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

      const filteredContacts = data.filter(
        (contact: any) =>
          !users.find((user: any) => user.phone == contact.phone)
      );
      setUserContacts(filteredContacts);
      setAllContacts(filteredContacts);
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      onDismiss();
    }
  };

  const onSearchContacts = (evt: any) => {
    console.log(allContacts, evt, evt.target);

    setUserContacts(
      allContacts.filter(
        (item: any) =>
          item.name.toLowerCase().includes(evt.target.value.toLowerCase()) ||
          item.phone.includes(evt.target.value.toLowerCase())
      )
    );
  };

  const addToGrupo = async (contact: any) => {
    try {
      await writeData("grupos/" + grupoID + "/users/" + contact.id, {
        name: contact.name,
        id: contact.id,
        phone: contact.phone || "",
        photo: contact.photo || "",
      });

      const updates = {};
      updates[`user_rooms/${contact.id}/grupos/${grupoID}`] = true;
      await updateData(updates);

      setContactosAgregados((lista: any) => [...lista, contact.phone]);

      doChild && doChild(null);
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    }
  };

  const hasBeenAdded = (contact: any) => {
    return contactosAgregados.find((x: any) => x == contact.phone);
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="ion-padding">
      <IonList className={`ion-no-padding ${styles["lista"]}`} lines="none">
        <IonSearchbar
          className={`ion-no-padding ion-margin-bottom`}
          placeholder="Buscar"
          color="warning"
          onIonInput={(ev) => onSearchContacts(ev)}
        ></IonSearchbar>

        {userContacts.map((contact: any, idx: number) => {
          return (
            contact && (
              <IonItem
                disabled={hasBeenAdded(contact)}
                key={idx}
                button={true}
                className={`${styles["contact"]}`}
                onClick={() => addToGrupo(contact)}
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
              </IonItem>
            )
          );
        })}
      </IonList>
    </div>
  );
};
