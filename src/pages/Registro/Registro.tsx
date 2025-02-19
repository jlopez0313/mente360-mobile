import {
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonImg,
  IonLabel,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

import { Registro as RegistroComponent } from "@/components/Registro/Registro";
import { useState } from "react";
import styles from "./Registro.module.scss";

const Registro: React.FC = () => {

  return (
    <IonPage>
      <IonContent className={`ion-text-center ${styles["ion-content"]}`}>
        <img src="assets/images/logo.png" className="ion-text-center ion-margin-top" style={{width:'80px'}} />

        <div className={`ion-padding-start ion-padding-end ${styles.content}`}>
          <RegistroComponent />
        </div>
      </IonContent>

    </IonPage>
  );
};

export default Registro;
