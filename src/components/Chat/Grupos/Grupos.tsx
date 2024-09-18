import React from "react";
import {
  IonAvatar,
  IonButton,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
} from "@ionic/react";
import { writeData } from "@/services/realtime-db";
import styles from "../Chat.module.scss";

export const Grupos = () => {

  const addDocument = () => {
    writeData("users/1", {name:"John Doe", email: "john.doe@example.com"});
  }

  return (
    <div className={styles["ion-content"]}>
      <IonButton className="ion-margin-bottom" shape="round" expand="block" onClick={addDocument}>
        Nuevo Grupo Mente Maestra
      </IonButton>

      <IonList className="ion-no-padding" lines="none">
        <IonItemGroup>
          <IonItem
            button={true}
            className={`ion-margin-bottom ${styles["contact"]}`}
          >
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt=""
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel className="ion-no-margin">
              <span className={styles["name"]}> {"GRUPO"} </span>
              <span className={styles["phone"]}> {"mensaje"} </span>
            </IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </div>
  );
};
