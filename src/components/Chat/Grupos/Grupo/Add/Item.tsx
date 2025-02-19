import styles from "./Add.module.scss";
import { IonAvatar, IonItem, IonLabel, IonSkeletonText, useIonAlert } from "@ionic/react";
import React, { useState } from "react";
import Avatar from "@/assets/images/avatar.jpg";
import { updateData, writeData } from "@/services/realtime-db";

export const Item: React.FC<any> = ({ grupoID, contact, doChild }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [isLoading, setIsLoading] = useState(true);
  const [contactosAgregados, setContactosAgregados] = useState<any>([]); // AllContacts agregados al grupo

  const [presentAlert] = useIonAlert();

  const addToGrupo = async (contact: any) => {
    try {
      const updates = { [grupoID]: true };

      await Promise.all([
        writeData(`grupos/${grupoID}/users/${contact.id}`, {
          name: contact.name,
          id: contact.id,
          phone: contact.phone || "",
          photo: contact.photo || "",
        }),
        updateData(`user_rooms/${contact.id}/grupos`, updates),
      ]);

      setContactosAgregados((prev: any) => [...prev, contact.phone]);

      if (doChild) {
        doChild(null);
      }
    } catch (error: any) {
      console.error("Error al agregar al grupo:", error);

      presentAlert({
        header: "Error",
        subHeader: "No se pudo agregar al grupo",
        message:
          error.data?.message ||
          "Ha ocurrido un error interno. Intenta nuevamente.",
        buttons: ["OK"],
      });
    }
  };

  const hasBeenAdded = (contact: any) => {
    return contactosAgregados.find((x: any) => x == contact.phone);
  };

  return (
    <IonItem
      disabled={hasBeenAdded(contact)}
      button={true}
      className={`${styles["contact"]}`}
      onClick={() => addToGrupo(contact)}
    >
      <IonAvatar aria-hidden="true" slot="start">
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
          alt=""
          src={contact.photo ? baseURL + contact.photo : Avatar}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
        />
      </IonAvatar>
      <IonLabel className="ion-no-margin">
        <span className={styles["name"]}> {contact.name || "-"} </span>
        <span className={styles["phone"]}> {contact.phone || "-"} </span>
      </IonLabel>
    </IonItem>
  );
};
