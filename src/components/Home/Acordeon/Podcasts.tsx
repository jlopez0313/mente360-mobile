import {
  IonAccordion,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import crecimiento from "/assets/icons/crecimiento.svg";
import styles from "./Acordeon.module.scss";

export const Podcasts = () => {
  const history = useHistory();

  const goToPodcast = () => {
    history.replace("/crecimiento");
  };

  return (
    <>
      <IonAccordion
        value="podcast"
        toggleIcon={crecimiento}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>Audio del día</IonLabel>
          <IonText style={{ width: "20px" }}></IonText>
        </IonItem>
        <div className="ion-padding" slot="content">
          <IonButton
            expand="block"
            type="button"
            className="ion-margin-top ion-padding-start ion-padding-end"
            onClick={goToPodcast}
          >
            Escuchar
          </IonButton>
        </div>
      </IonAccordion>
    </>
  );
};
