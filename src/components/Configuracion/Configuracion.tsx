import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonToggle,
} from "@ionic/react";
import {
  callOutline,
  cogOutline,
  documentLockOutline,
  documentTextOutline,
  hammerOutline,
  peopleOutline,
} from "ionicons/icons";
import React from "react";
import Login from "@/pages/Login/Login";
import styles from "./Configuracion.module.scss";
import { Link } from "react-router-dom";

export const Configuracion = () => {
  return (
    <div className={styles['ion-content']}>
      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Configuracion Personal</IonLabel>
          </IonItemDivider>

          <IonItem button={true} lines="none" className={'ion-margin-bottom'}>
            <IonToggle>
              <IonLabel>Modo Oscuro</IonLabel>
            </IonToggle>
          </IonItem>

          <Link to='/test'>
            <IonItem button={true}>
              <IonIcon slot="start" icon={cogOutline} />
                <IonLabel>Realizar Test Eneagrama</IonLabel>
            </IonItem>
          </Link>
          
        </IonItemGroup>
      </IonList>

      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Acerca de Mente360</IonLabel>
          </IonItemDivider>

          <IonItem lines="none" className={'ion-margin-bottom'}>
            <IonIcon slot="start" icon={peopleOutline} />
            <IonLabel>Sobre Nosotros</IonLabel>
          </IonItem>

          <IonItem lines="none" className={'ion-margin-bottom'}>
            <IonIcon slot="start" icon={documentTextOutline} />
            <IonLabel>Términos y Condiciones</IonLabel>
          </IonItem>

          <IonItem>
            <IonIcon slot="start" icon={documentLockOutline} />
            <IonLabel>Política de Privacidad</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>

      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Contáctanos</IonLabel>
          </IonItemDivider>
        </IonItemGroup>

        <IonItem lines="none" className={'ion-margin-bottom'}>
          <IonIcon slot="start" icon={hammerOutline} />
          <IonLabel>Soporte</IonLabel>
        </IonItem>

        <IonItem>
          <IonIcon slot="start" icon={callOutline} />
          <IonLabel>Contáctanos</IonLabel>
        </IonItem>
      </IonList>

      <div className="ion-text-center ion-margin-bottom">
        <Link to='/login' replace={true}>
          <IonButton shape="round">
            <IonLabel>Cerrar Sesión</IonLabel>
          </IonButton>
        </Link>
      </div>
    </div>
  );
};
