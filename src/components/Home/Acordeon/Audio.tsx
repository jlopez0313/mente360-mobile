import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  useIonAlert
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import React from "react";
import styles from "./Acordeon.module.scss";
import auriculares from "/assets/icons/auriculares.svg";

import { Modal } from "@/components/Shared/Modal/Modal";
import { useDB } from "@/context/Context";
import AudiosDB from "@/database/audios";
import { usePayment } from "@/hooks/usePayment";
import { setAudio } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Audio as AudioShared } from "../Audio/Audio";

export const Audio: React.FC<any> = ({ network }) => {

  const dispatch = useDispatch();
  const [presentAlert] = useIonAlert();
  const { sqlite } = useDB();

  const { userEnabled } = usePayment();
  const { audio } = useSelector((state: any) => state.home);

  const onConfirmAudio = async () => {
    try {
      const audiosDB = new AudiosDB(sqlite.db);
      await audiosDB.markAsDone(sqlite.performSQLAction, () => { }, {
        id: audio.id,
        done: 1,
      });

      const newData = {
        ...audio,
        done: 1,
      };

      dispatch(setAudio({ ...newData }));
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
          {audio.done ? (
            <IonIcon icon={trophy} slot="end" className={styles['trofeo']} />
          ) : (
            <IonIcon icon={trophy} slot="end" className={styles['trofeo-gris']} />
          )}
        </IonItem>
        <div className="ion-padding" slot="content">
          {
            !userEnabled ?
              <IonButton
                disabled={true}
                expand="block"
                type="button"
                className="ion-margin-top ion-padding-start ion-padding-end"
              >
                Premium
              </IonButton> :
              <IonButton
                expand="block"
                type="button"
                className="ion-margin-top ion-padding-start ion-padding-end"
                id="modal-auricular"
              >
                Escuchar
              </IonButton>

          }
        </div>
      </IonAccordion>

      <Modal
        trigger="modal-auricular"
        title="Audio de la noche"
        hideButtons={!network.status || audio.done || false}
        onConfirm={() => onConfirmAudio()}
      >
        <AudioShared audio={audio} onConfirm={() => onConfirmAudio()} />
      </Modal>
    </>
  );
};
