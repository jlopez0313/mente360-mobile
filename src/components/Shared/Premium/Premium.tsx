import {
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonText
} from "@ionic/react";
import {
    chatboxEllipsesOutline,
    heartCircleOutline,
    moonOutline,
    peopleOutline,
    ribbonOutline,
} from "ionicons/icons";
import styles from "./Premium.module.scss";

export const Premium = () => {
  return (
    <div className={`${styles["content"]}`}>
      <IonImg
        src="assets/images/logo.png"
        className={`${styles["logo"]}`}
      />

      <IonText className="ion-text-center ion-margin-bottom">
        {" "}
        {import.meta.env.VITE_NAME}{" "}
      </IonText>

      <IonText
        className={`ion-text-center ion-margin-bottom ${styles["ready"]}`}
      >
        Desbloquea todo tu potencial con {import.meta.env.VITE_NAME} premium.
      </IonText>

      <IonList
        className={`ion-text-justify ${styles["caracteristicas"]} ${styles["w-100"]}`}
      >
        <IonItem>
          <IonIcon aria-hidden="true" icon={ribbonOutline} slot="start" />
          <IonLabel className={`ion-text-left`}>
            Acceso ilimitado a formaciones, meditaciones, musicoterapia y tareas
            personalizadas
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon aria-hidden="true" icon={moonOutline} slot="start" />

          <IonLabel className={`ion-text-left`}>
            Audios nocturnos personalizados para tu tipo de personalidad
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon
            aria-hidden="true"
            icon={chatboxEllipsesOutline}
            slot="start"
          />

          <IonLabel className={`ion-text-left`}>
            Frases diarias de motivación adaptadas a tu eneagrama
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon aria-hidden="true" icon={peopleOutline} slot="start" />

          <IonLabel className={`ion-text-left`}>
            Acceso a la comunidad exclusiva para compartir tu crecimiento
            personal
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonIcon aria-hidden="true" icon={heartCircleOutline} slot="start" />

          <IonLabel className={`ion-text-left`}>S.O.S Emocional</IonLabel>
        </IonItem>
      </IonList>
    </div>
  );
};
