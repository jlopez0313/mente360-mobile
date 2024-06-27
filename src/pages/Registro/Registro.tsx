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
      <IonContent className={styles['ion-content']}>
        <IonGrid>
          <IonRow className="ion-align-items-center">
            <IonCol  className="ion-justify-content-center">
              <img src="assets/images/logo.png" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter className={styles['ion-footer']}>
        <div className={`ion-padding ${styles.content}`}>
          <RegistroComponent />
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Registro;
