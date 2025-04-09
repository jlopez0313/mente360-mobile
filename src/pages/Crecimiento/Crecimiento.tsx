import { Crecimiento as CrecimientoComponent } from "@/components/Crecimiento/Crecimiento";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import styles from "./Crecimiento.module.scss";

import { Footer } from "@/components/Footer/Footer";
import { IonIcon } from "@ionic/react";
import {
  arrowBack
} from "ionicons/icons";
import { Link, useHistory } from "react-router-dom";

import { destroy } from "@/helpers/musicControls";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Crecimiento: React.FC = () => {
  
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/home");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch( setShowGlobalAudio( true ) )

    return () => {
      destroy()
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to='/home' replace={true}>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle class='ion-no-padding ion-padding-end ion-text-center'> Podcast 360 </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <CrecimientoComponent />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Crecimiento;
