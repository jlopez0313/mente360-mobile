import { IonAvatar, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList } from '@ionic/react'
import React from 'react'
import styles from "./Notifications.module.scss";

export const Notifications = () => {
  return (
    <div className={styles['ion-content']}>
        <IonList inset={true}>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Hoy</IonLabel>
            </IonItemDivider>

            <IonItem lines='none' button={true}>
              <IonAvatar aria-hidden="true" slot="start">
                <img
                  alt=""
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonLabel>Huey</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>

        <IonList inset={true}>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>Anteriores</IonLabel>
            </IonItemDivider>

            <IonItem lines='none' className='ion-margin-bottom'>
              <IonAvatar aria-hidden="true" slot="start">
                <img
                  alt=""
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonLabel>Dewey</IonLabel>
            </IonItem>
            <IonItem lines='none' className='ion-margin-bottom'>
              <IonAvatar aria-hidden="true" slot="start">
                <img
                  alt=""
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonLabel>Louie</IonLabel>
            </IonItem>
            <IonItem>
              <IonAvatar aria-hidden="true" slot="start">
                <img
                  alt=""
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonLabel>Fooie</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>
    </div>
  )
}
