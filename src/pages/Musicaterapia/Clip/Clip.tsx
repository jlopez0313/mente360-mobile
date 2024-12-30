import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabList,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import styles from "./Clip.module.scss";

import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { arrowBack, musicalNote, musicalNotes, search, shareSocialOutline } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { useContext, useEffect, useState } from "react";
import { Clip as ClipComponent } from "@/components/Musicaterapia/Clip/Clip";
import { Toast } from "@/components/Toast/Toast";
import UIContext from "@/context/Context";
import { Link, useHistory } from "react-router-dom";

const Clip: React.FC = () => {

  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/musicaterapia");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to='/musicaterapia' replace={true}>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center">
            <IonIcon icon={musicalNotes} style={{marginRight: '10px'}}></IonIcon>
            En reproducción
          </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
            <IonIcon icon={musicalNote} slot="start"></IonIcon>
              En reproducción
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <ClipComponent />
        
      </IonContent>

      <Footer  id="footer"/>
    </IonPage>
  );
};

export default Clip;
