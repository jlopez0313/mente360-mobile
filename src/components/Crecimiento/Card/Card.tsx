import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonRange,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import {
  play,
  playSkipBack,
  playSkipForward,
  shareSocial,
} from "ionicons/icons";
import styles from "./Card.module.scss";
import { useState } from "react";

interface Props {
  audio: any;
}

export const Card: React.FC<Props> = ({ audio }) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <IonCard className={`ion-margin-top ion-text-center ${styles.card}`}>
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
        src={baseURL + audio.imagen}
        style={{ display: isLoading ? "none" : "block" }}
        onLoad={() => setIsLoading(false)}
        className="ion-margin-bottom"
      />

      <IonCardHeader className="ion-no-padding ion-margin-bottom">
        <IonCardSubtitle className="ion-no-padding">
          {/*
              <IonText> &nbsp; </IonText>
            */}
          <IonText> {audio.titulo} </IonText>
          {/* 
              <IonIcon icon={shareSocial} />
            */}
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
