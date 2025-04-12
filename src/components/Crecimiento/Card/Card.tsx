import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonChip,
  IonIcon,
  IonRange,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import {
  downloadOutline,
  play,
  playSkipBack,
  playSkipForward
} from "ionicons/icons";
import { useState } from "react";
import styles from "./Card.module.scss";

import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";

interface Props {
  network: any;
  audio: any;
}

export const Card: React.FC<Props> = ({ audio, network }) => {

  const baseURL = import.meta.env.VITE_BASE_BACK;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <IonCard className={`ion-text-center ${styles.card}`}>
      {isLoading && (
        <IonSkeletonText
          animated
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "5px",
          }}
        />
      )}

      <img
        alt=""
        src={network.status ? baseURL + audio.imagen : AudioNoWifi}
        style={{ display: isLoading ? "none" : "block" }}
        onLoad={() => setIsLoading(false)}
        className="ion-margin-bottom"
      />

      <IonCardHeader className="ion-no-padding">
        <IonCardSubtitle className="ion-no-padding">
          <IonText> {audio.titulo} </IonText>
        </IonCardSubtitle>
        <IonCardSubtitle className="ion-no-padding">
            <div className={styles["chip-list"]}>
              <IonChip disabled={!network.status}>
                <IonIcon
                  className={`${styles["donwload-icon"]}`}
                  icon={downloadOutline}
                /> 
                Descargar
              </IonChip>
            </div>
          </IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent className="ion-no-padding">
        <IonRange disabled={true} value={0}></IonRange>

        <div className={`ion-margin-top ${styles.time}`}>
          <span> {0} </span>
          <span> {0} </span>
        </div>

        <div className={`${styles.controls}`}>
          <IonIcon className={styles.previous} icon={playSkipBack}></IonIcon>
          <div className={`${styles.play}`}>
            <IonIcon icon={play}></IonIcon>
          </div>
          <IonIcon className={styles.next} icon={playSkipForward}></IonIcon>
        </div>
      </IonCardContent>
    </IonCard>
  );
};
