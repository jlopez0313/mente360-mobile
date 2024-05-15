import { IonAvatar, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonNote } from "@ionic/react";
import { playCircle, shareSocialOutline, trashOutline } from "ionicons/icons";
import React from "react";
import styles from '../Musicaterapia.module.scss';

export const Playlist = () => {
  return (
    <div className={styles['ion-content']}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
          <IonItem button={true}>
            <IonIcon aria-hidden="true" slot='start' icon={playCircle} />
            <IonLabel class="ion-text-left"> Huey </IonLabel>
            <IonIcon aria-hidden="true" slot='end' icon={trashOutline} />
          </IonItem>
      </IonList>
    </div>
  );
};
