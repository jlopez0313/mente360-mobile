import { IonAvatar, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonNote } from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import React from "react";
import styles from '../Chat.module.scss';

export const Comunidad = () => {
  return (
    <div className={styles['ion-content']}>
      <IonItem className="ion-margin-bottom" button={true} lines="none">
        <IonIcon slot="start" icon={shareSocialOutline} size="large"></IonIcon>
        <IonLabel>Copiar Enlace de Invitación</IonLabel>
      </IonItem>

      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Personas en Mente360</IonLabel>
          </IonItemDivider>

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

          <IonItem button={true}>
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt=""
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel>Huey</IonLabel>
            <IonNote slot="end"> Invitar </IonNote>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </div>
  );
};
