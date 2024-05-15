import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonProgressBar,
    IonText,
  } from "@ionic/react";
  import { play, playSkipBack, playSkipForward, shareSocial } from "ionicons/icons";
  import { useState } from "react";
  import styles from './Audio.module.scss';
  
  export const Audio = () => {
    
    const [progress, setProgress] = useState(0.5);
  
    return (
      <IonCard className={`ion-margin-top ion-text-center ${styles.card}`}>
        <img
          alt="Silhouette of mountains"
          src="assets/images/audio.png"
        />
        <IonCardHeader className="ion-no-padding ion-margin-bottom">
          <IonCardSubtitle className="ion-no-padding">
            <IonText> &nbsp; </IonText>
            <IonText> El yo Superior </IonText>
            <IonIcon icon={shareSocial}/>
          </IonCardSubtitle>
        </IonCardHeader>
  
        <IonCardContent  className="ion-no-padding">
          
          <IonProgressBar className={styles['ion-progress-bar']} value={progress}></IonProgressBar>

          <div className={`ion-margin-top ${styles.time}` }>
            <span> 4:36 </span>
            <span> 12:05 </span>
          </div>
  
          <div className={`${styles.controls}` }>
            <IonIcon className={styles.previous} icon={playSkipBack}></IonIcon>
            <div className={`${styles.play}`}>
              <IonIcon icon={ play}></IonIcon>
            </div>
            <IonIcon className={styles.next} icon={playSkipForward}></IonIcon>
          </div>
        </IonCardContent>
      </IonCard>
    );
  };
  