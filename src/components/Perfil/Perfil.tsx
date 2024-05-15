import {
  IonAvatar,
  IonButton,
  IonChip,
  IonCol,
  IonDatetime,
  IonDatetimeButton,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonRow,
} from "@ionic/react";
import React from "react";
import styles from "./Perfil.module.scss";

export const Perfil = () => {
  return (
    <div className="">
      <div>
        <IonItem lines="none">
          <IonAvatar slot="start">
            <img
              alt="Silhouette of a person's head"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
            />
          </IonAvatar>
          <IonLabel>
            Leonardo García
            <br />
            @leogz
          </IonLabel>
          <span> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  </span>
        </IonItem>
      </div>

      <div className={`ion-margin-bottom ${styles.profile}`}>
        <div className={styles.info}>
            <IonChip
              outline={true}
            >
              26
            </IonChip>
            <IonNote> <strong> Edad </strong> </IonNote>
        </div>
        <div className={styles.info}>
            <IonChip
              outline={true}
            >
              26
            </IonChip>
            <IonNote> <strong> Eneatipo </strong> </IonNote>
        </div>
        <div className={styles.info}>
            <IonChip
              outline={true}
            >
              26
            </IonChip>
            <IonNote> <strong> Género </strong> </IonNote>
        </div>
      </div>

      <IonInput
        label="Nombre de Usuario"
        labelPlacement="floating"
        fill="outline"
        shape="round"
        placeholder="Enter text"
        className={styles.profile}
      ></IonInput>
      <br />
      
      <IonInput
        label="Correo Electrónico"
        labelPlacement="floating"
        shape="round"
        fill="outline"
        placeholder="Enter text"
        className={styles.profile}
      ></IonInput>
      <br />
      
      <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
      <IonModal keepContentsMounted={true}>
        <IonDatetime  id="datetime"></IonDatetime>
      </IonModal>

      <IonInput
        label="Edad"
        labelPlacement="floating"
        shape="round"
        fill="outline"
        placeholder="Enter text"
        className={styles.profile}
      ></IonInput>
      <br />

      <IonInput
        label="Género"
        labelPlacement="floating"
        shape="round"
        fill="outline"
        placeholder="Enter text"
        className={styles.profile}
      ></IonInput>
      <br />

      <IonInput
        label="Eneatipo"
        labelPlacement="floating"
        shape="round"
        fill="outline"
        placeholder="Enter text"
        className={styles.profile}
      ></IonInput>
      <br />

      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonButton shape="round" expand="block">Cancelar</IonButton>
          </IonCol>
          <IonCol size="6">
            <IonButton shape="round" expand="block">Guardar</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};
