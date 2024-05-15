import { IonIcon, IonItem, IonLabel, IonToast } from "@ionic/react";
import React from "react";

import styles from './Toast.module.scss';
import { playBack, playCircle, playForward, playSkipBack, playSkipForward, starOutline } from "ionicons/icons";

export const Toast = () => {
  return (
    <IonItem
        lines="none"
        button={true}
      className={`${styles['custom-toast']}`}
    >
        <IonLabel class="ion-text-left"> Huey </IonLabel>

        <IonIcon aria-hidden="true" slot='end' icon={playSkipBack} />
        <IonIcon aria-hidden="true" slot='end' icon={playCircle} />
        <IonIcon aria-hidden="true" slot='end' icon={playSkipForward} />
        <IonIcon aria-hidden="true" slot='end' icon={starOutline} />
    </IonItem>
  );
};