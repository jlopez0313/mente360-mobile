import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import styles from "./Musicaterapia.module.scss";

import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Clips as ClipsComponent } from "@/components/Musicaterapia/Clips/Clips";
import { Playlist as PlaylistComponent } from "@/components/Musicaterapia/Playlist/Playlist";
import { setTab } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

const Musicaterapia: React.FC = () => {

  const history = useHistory();

  const dispatch = useDispatch();
  const {tab} = useSelector( (state: any) => state.audio);

  const onSetTab = (e) => {
    dispatch( setTab(e.detail.value) );
  };

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

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Musicoterapia </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Musicoterapia</IonTitle>
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
        
      </IonContent>

      <Footer  id="footer"/>
    </IonPage>
  );
};

export default Musicaterapia;
