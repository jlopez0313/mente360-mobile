import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import styles from "./Clip.module.scss";

import { IonIcon } from "@ionic/react";
import { arrowBack, musicalNote, musicalNotes } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Clip as ClipComponent } from "@/components/Musicaterapia/Clip/Clip";
import { useEffect } from "react";
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
