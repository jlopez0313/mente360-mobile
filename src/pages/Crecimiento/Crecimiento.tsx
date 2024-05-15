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

const Crecimiento: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to='/home'>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle class='ion-no-padding ion-padding-end ion-text-center'> Crecimiento </IonTitle>
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
