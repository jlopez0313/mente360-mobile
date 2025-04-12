import {
    IonAccordion,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonText,
    useIonAlert
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import React from "react";
import styles from "./Acordeon.module.scss";
import auriculares from "/assets/icons/auriculares.svg";

import { Modal } from "@/components/Shared/Modal/Modal";
import { useDB } from "@/context/Context";
import AudiosDB from "@/database/audios";
import { localDB } from "@/helpers/localStore";
import { setAudio } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Audio as AudioShared } from "../Audio/Audio";

export const Audio: React.FC<any> = ({}) => {
  const localHome = localDB("home");

  const dispatch = useDispatch();
  const [presentAlert] = useIonAlert();
  const { sqlite } = useDB();

  const { audio, currentDate } = useSelector((state: any) => state.home);

  const onConfirmAudio = async () => {
    try {
      const audiosDB = new AudiosDB(sqlite.db);
      await audiosDB.markAsDone(sqlite.performSQLAction, () => {}, {
        id: audio.id,
        done: 1,
      });

      const newData = {
        ...audio,
        done: 1,
      };

      dispatch(setAudio({ ...newData }));

      const localData = localHome.get();
      localHome.set({ ...localData, data: { ...newData } });
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
            <IonIcon icon={trophy} slot="end" className={styles.trofeo} />
          ) : (
            <IonText style={{ width: "20px" }}></IonText>
          )}
        </IonItem>
        <div className="ion-padding" slot="content">
          <IonButton
            expand="block"
            type="button"
            className="ion-margin-top ion-padding-start ion-padding-end"
            id="modal-auricular"
          >
            Escuchar
          </IonButton>
        </div>
      </IonAccordion>

      <Modal
        trigger="modal-auricular"
        title="Audio de la noche"
        hideButtons={audio.done || false}
        onConfirm={() => onConfirmAudio()}
      >
        <AudioShared audio={audio} onConfirm={() => onConfirmAudio()} />
      </Modal>
    </>
  );
};
