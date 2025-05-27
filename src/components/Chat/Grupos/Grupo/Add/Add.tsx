import {
  IonList,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";

import { misContactos } from "@/services/user";
import { Contacts } from "@capacitor-community/contacts";
import { parsePhoneNumber } from "react-phone-number-input";
import { useSelector } from "react-redux";
import styles from "./Add.module.scss";
import { Item } from "./Item";

export const Add: React.FC<any> = ({ grupoID, users, doChild }) => {
  const { user } = useSelector( (state: any) => state.user);

  const [present, onDismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [allContacts, setAllContacts] = useState<any>([]); // todos los contactos con usuario registrado
  const [filteredContacts, setFilteredContacts] = useState<any>([]); // AllContacts filtrados

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

      setAllContacts(filteredContacts);
      setFilteredContacts(filteredContacts);
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

    setFilteredContacts(
      allContacts.filter(
        (item: any) =>
          item.name.toLowerCase().includes(evt.target.value.toLowerCase()) ||
          item.phone.includes(evt.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="ion-padding">
      <IonList className={`ion-no-padding ${styles["lista"]}`} lines="none">
        <IonSearchbar
          className={`ion-no-padding ion-margin-bottom ${styles["search"]}`}
          placeholder="Buscar"
          color="warning"
          onIonInput={(ev) => onSearchContacts(ev)}
        ></IonSearchbar>

        {filteredContacts.map((contact: any, idx: number) => {
          return (
            contact && (
              <Item
                key={idx}
                contact={contact}
                grupoID={grupoID}
                doChild={doChild}
              />
            )
          );
        })}
      </IonList>
    </div>
  );
};
