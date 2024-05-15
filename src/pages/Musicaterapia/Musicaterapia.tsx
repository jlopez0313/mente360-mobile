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
import styles from "./Musicaterapia.module.scss";

import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { arrowBack, search, shareSocialOutline } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { useState } from "react";
import { Clips as ClipsComponent } from "@/components/Musicaterapia/Clips/Clips";
import { Playlist as PlaylistComponent } from "@/components/Musicaterapia/Playlist/Playlist";
import { Toast } from "@/components/Toast/Toast";
import { Link } from "react-router-dom";

const Musicaterapia: React.FC = () => {
  const [tab, setTab] = useState("clips");

  const onSetTab = (e) => {
    setTab(e.detail.value);
  };

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

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Musicaterapia </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Musicaterapia</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment value={tab} onIonChange={onSetTab}>
          <IonSegmentButton value="clips">
            <IonLabel> Clips </IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="playlist">
            <IonLabel> Playlist </IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {tab == "clips" ? <ClipsComponent /> : <PlaylistComponent />}
        

        <Toast />

      </IonContent>

      <Footer  id="footer"/>
    </IonPage>
  );
};

export default Musicaterapia;
