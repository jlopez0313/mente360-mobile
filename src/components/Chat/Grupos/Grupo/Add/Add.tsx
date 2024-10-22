import { IonAvatar, IonIcon, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonSearchbar, useIonAlert, useIonLoading } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import styles from "./Add.module.scss";
import { camera, cameraOutline } from "ionicons/icons";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";
import { parsePhoneNumber } from "react-phone-number-input";
import { Contacts } from "@capacitor-community/contacts";
import { misContactos } from "@/services/user";

interface Props {
  users: any;
  doChild?: (params?: any) => {};
}

export const Add = ({ users, doChild }: Props) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const {user} = getUser();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [userContacts, setUserContacts] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);
  const [allContacts, setAllContacts] = useState<any>([]);

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

      const filteredContacts = data.filter( (contact: any) => !users.find( (user: any) => user.phone == contact.phone )  )
      setUserContacts(filteredContacts);
      // setAllContacts(lista);

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

  const onSearchContacts = (evt: any) => {
    setContacts(
      allContacts.filter((item: any) =>
        item.name?.display
          .toLowerCase()
          .includes(evt.target.value.toLowerCase())
      )
    );
  };

  const addToGrupo = (contact: any) => {
    console.log( contact )
  }


  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="ion-padding">
    <IonList
        className="ion-no-padding"
        lines="none"
      >
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
                  key={idx}
                  button={true}
                  className={`ion-margin-bottom ${styles["contact"]}`}
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
