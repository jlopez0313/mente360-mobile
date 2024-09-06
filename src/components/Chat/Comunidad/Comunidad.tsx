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

export const Comunidad = () => {
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [allContacts, setAllContacts] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);

  const onSearchContacts = (evt: any) => {
    setContacts(allContacts.filter( (item: any) => item.name?.display.toLowerCase().includes(evt.target.value)) )
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
          .sort((a: any, b: any) =>
            a.name?.display.toLowerCase() > b.name?.display.toLowerCase()
              ? 1
              : -1
          ) || [];

      setAllContacts(lista);
      setContacts(lista);

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
    getContacts();
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonItem className="ion-margin-bottom" button={true} lines="none">
        <IonIcon slot="start" icon={shareSocialOutline} size="large"></IonIcon>
        <IonLabel>Copiar Enlace de Invitación</IonLabel>
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

          <IonItem button={true}>
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt=""
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>Huey</IonLabel>
            <IonNote slot="end"> Añadir </IonNote>
          </IonItem>
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
                      {contact.phones[0]?.number?.replace(/[\s~`-]/g, "") ||
                        "-"}{" "}
                    </span>
                  </IonLabel>
                  <IonNote slot="end"> Invitar </IonNote>
                </IonItem>
              )
            );
          })}
        </IonItemGroup>
      </IonList>
    </div>
  );
};
