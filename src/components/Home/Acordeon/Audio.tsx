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

  const audio = useLiveQuery(() => db.audios.toCollection().first());

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
        className={`ion-no-padding ${styles["custom-accordion"]}`}
      >
        <IonItem slot="header" lines="none">
          <span className="material-symbols-outlined">music_video</span>
          <div className={styles["title-accordion"]}>
            <IonLabel className="ion-no-padding title-accordion">Audio de la noche</IonLabel>
            <IonLabel className="ion-no-padding subtitle-accordion">Conecta con calma al final del día.</IonLabel>
          </div>
          {audio?.done ? (
            <span slot="end" className={`material-symbols-outlined $styles['trofeo']`}>emoji_events</span>
          ) : (
            <span slot="end" className={`material-symbols-outlined $styles['trofeo-gris']`}>emoji_events</span>
          )}
        </IonItem>
        <div className={` flex justify-end ${styles['button-section']}`} slot="content">
          {!userEnabled || payment_status == "free" ? (
            <IonButton
              shape="round"
              onClick={() => setIsPremiumOpen(true)}
              expand="block"
              type="button"
              className="width50 ion-margin-top ion-padding-start ion-padding-end"
            >
              Premium
            </IonButton>
          ) : (
            <IonButton
              shape="round"
              onClick={() => setIsOpen(true)}
              expand="block"
              type="button"
              className="width50 ion-margin-top ion-padding-start ion-padding-end"
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
        hideButtons={!network.status || audio?.done == 1 || false}
        showButtons={false}
        modalHeight = "61vh"
        onConfirm={() => { }}
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
