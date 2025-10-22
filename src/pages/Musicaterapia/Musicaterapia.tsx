import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import styles from "./Musicaterapia.module.scss";


import { Clips as ClipsComponent } from "@/components/Musicaterapia/Clips/Clips";
import { Playlist as PlaylistComponent } from "@/components/Musicaterapia/Playlist/Playlist";
import { setTab } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Musicaterapia: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const { tab } = useSelector((state: any) => state.audio);

  const onSetTab = (e) => {
    dispatch(setTab(e.detail.value));
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
            <IonMenuButton/>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end">
            {" "}
            Musicoterapia{" "}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Musicoterapia</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSegment value={tab} onIonChange={onSetTab}>
          <IonSegmentButton value="clips" className={styles["ion-segment-button"]}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">
                music_video
              </span>
              <IonLabel> Clips </IonLabel>
            </div>
          </IonSegmentButton>
          <IonSegmentButton value="playlist" className={styles["ion-segment-button"]}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">
              queue_music
              </span>
              <IonLabel> Playlist </IonLabel>
            </div>
          </IonSegmentButton>
        </IonSegment>

        {tab == "clips" ? <ClipsComponent /> : <PlaylistComponent />}
      </IonContent>

    </IonPage>
  );
};

export default Musicaterapia;
