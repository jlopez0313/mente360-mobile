import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import styles from "./Footer.module.scss";

import crecimiento from '/assets/icons/crecimiento.svg';
import auriculares from '/assets/icons/auriculares.svg';
import calendario from '/assets/icons/calendario.svg';
import grupo from '/assets/icons/grupo.svg';
import { Link } from "react-router-dom";

export const Footer = ( props: any ) => {

  return (
    <IonFooter {...props}>
      <IonToolbar className={styles["ion-footer"]}>
        <IonButtons class="ion-justify-content-around">
          <Link to='/crecimiento' replace={true} >
            <IonButton>
              <IonIcon slot="icon-only" src={crecimiento}></IonIcon>
            </IonButton>
          </Link>

          <Link to='/musicaterapia' replace={true} >
            <IonButton>
              <IonIcon slot="icon-only" src={auriculares}></IonIcon>
            </IonButton>
          </Link>

          <Link to='/home' replace={true}>
            <IonButton>
              <IonIcon slot="icon-only" src={calendario}></IonIcon>
            </IonButton>
          </Link>

          <Link to='/chat' replace={true}>
            <IonButton>
              <IonIcon slot="icon-only" src={grupo}></IonIcon>
            </IonButton>
          </Link>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
};
