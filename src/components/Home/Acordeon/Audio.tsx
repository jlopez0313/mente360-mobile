import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  useIonAlert,
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import React, { useState } from "react";
import styles from "./Acordeon.module.scss";
import auriculares from "/assets/icons/auriculares.svg";

import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { db } from "@/hooks/useDexie";
import { usePayment } from "@/hooks/usePayment";
import { useLiveQuery } from "dexie-react-hooks";
import { Audio as AudioShared } from "../Audio/Audio";

export const Audio: React.FC<any> = ({ network }) => {
  const [presentAlert] = useIonAlert();

  const [isOpen, setIsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const { userEnabled, payment_status } = usePayment();

  const audio = useLiveQuery( ( ) => db.audios.toCollection().first() );

  const onConfirmAudio = async () => {
    try {
      await db.audios.update(audio?.id ?? 1, { done: 1 });
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message:
          error.data?.message ||
          "Tu audio ha finalizado. Cuando estés listo, presiona 'Finalizar'.",
        buttons: ["OK"],
      });
    }
  };

  return (
    <>
      <IonAccordion
        value="audio"
        toggleIcon={auriculares}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>Audio de la noche</IonLabel>
          {audio?.done ? (
            <IonIcon icon={trophy} slot="end" className={styles["trofeo"]} />
          ) : (
            <IonIcon
              icon={trophy}
              slot="end"
              className={styles["trofeo-gris"]}
            />
          )}
        </IonItem>
        <div className="ion-padding" slot="content">
          {!userEnabled || payment_status == "free" ? (
            <IonButton
              onClick={() => setIsPremiumOpen(true)}
              expand="block"
              type="button"
              className="ion-margin-top ion-padding-start ion-padding-end"
            >
              Premium
            </IonButton>
          ) : (
            <IonButton
              onClick={() => setIsOpen(true)}
              expand="block"
              type="button"
              className="ion-margin-top ion-padding-start ion-padding-end"
              id="modal-noche"
            >
              Escuchar
            </IonButton>
          )}
        </div>
      </IonAccordion>

      <Modal
        isOpen={isOpen}
        title="Audio de la noche"
        hideButtons={!network.status || audio?.done == 1 || false}
        onConfirm={() => onConfirmAudio()}
      >
        <AudioShared audio={audio} onConfirm={() => onConfirmAudio()} />
      </Modal>

      <Modal
        isOpen={isPremiumOpen}
        title={import.meta.env.VITE_NAME + " premium"}
        hideButtons={!network.status || audio?.done == 1 || false}
        showButtons={false}
        onConfirm={() => {}}
        onWillDismiss={() => setIsPremiumOpen(false)}
      >
        <div className="ion-padding">
          <Premium />
          <Buttons />
        </div>
      </Modal>
    </>
  );
};
