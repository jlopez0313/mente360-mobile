import React from "react";
import styles from "../Chat.module.scss";
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
} from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";

export const Chat = () => {
  return (
    <div className={styles["ion-content"]}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["searc"]}`}
            placeholder="Buscar"
            color="warning"
          ></IonSearchbar>

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
              <span className={styles["name"]}> {"contacto"} </span>
              <span className={styles["phone"]}> {"mensaje"} </span>
            </IonLabel>
          </IonItem>

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
