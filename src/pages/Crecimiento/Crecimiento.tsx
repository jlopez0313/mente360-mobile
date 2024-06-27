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
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Crecimiento as CrecimientoComponent } from "@/components/Crecimiento/Crecimiento";
import styles from "./Crecimiento.module.scss";

import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import {
  add,
  arrowBack,
  helpCircleOutline,
  logoWhatsapp,
  notificationsOutline,
  personCircleOutline,
  readerOutline,
} from "ionicons/icons";
import { Footer } from "@/components/Footer/Footer";
import { Link } from "react-router-dom";

import UIContext from "@/context/Context";
import { useContext, useEffect } from "react";

const Crecimiento: React.FC = () => {
  const { setShowGlobalAudio }: any = useContext(UIContext);

  useEffect(() => {
    setShowGlobalAudio( true )
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
