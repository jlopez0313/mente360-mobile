import React from 'react'
import styles from '../Musicaterapia.module.scss';
import { IonAvatar, IonChip, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonNote } from '@ionic/react';
import { playCircle, shareSocialOutline, star, starOutline } from 'ionicons/icons';

export const Clips = () => {
  return (
    <div className={styles['ion-content']}>

      <div className={`ion-margin-bottom ${styles.chips}`}>
        <IonChip>All</IonChip>
        <IonChip>Pop Inglés</IonChip>
        <IonChip>Reggaeton</IonChip>
        <IonChip>Vallenato</IonChip>
      </div>
      
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
          <IonItem button={true}>
            <IonLabel class="ion-text-left"> Huey </IonLabel>
            <IonIcon aria-hidden="true" slot='end' icon={playCircle} />
            <IonIcon aria-hidden="true" slot='end' icon={starOutline} />
          </IonItem>
      </IonList>

    </div>
  )
}
