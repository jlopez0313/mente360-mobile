import React from 'react'
import styles from '../Chat.module.scss';
import { IonAvatar, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonNote } from '@ionic/react';
import { shareSocialOutline } from 'ionicons/icons';

export const Chat = () => {
  return (
    <div className={styles['ion-content']}>
      
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Chats</IonLabel>
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
            <IonLabel>Grupos</IonLabel>
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
  )
}
