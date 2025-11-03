import Logo from "@/assets/images/logo.png";
import {
  IonItem,
  IonLabel,
  IonList,
  IonText
} from "@ionic/react";
import styles from "./Premium.module.scss";

export const Premium = () => {
  return (
    <div className={`${styles["content"]}`}>
     
      <img alt="" className="logo-header" src={Logo} />


      <IonText className={`ion-text-center ion-margin-bottom ${styles["ready"]}`}
      >
        Desbloquea todo tu potencial con
      </IonText>

      <IonText className={`ion-text-center ion-margin-bottom ${styles["name-app"]}`}>
        {" "}
        {import.meta.env.VITE_NAME}{" "} Premium
      </IonText>
      <IonList
        className={`ion-text-justify ${styles["caracteristicas"]} ${styles["w-100"]}`}
      >
        <IonItem lines="none">
          <span slot="start" className="material-symbols-outlined">military_tech</span>
          <IonLabel className={`ion-text-left`}>
            Acceso ilimitado a formaciones, meditaciones, musicoterapia y tareas
            personalizadas
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <span slot="start" className="material-symbols-outlined">dark_mode</span>
          <IonLabel className={`ion-text-left`}>
            Audios nocturnos personalizados para tu tipo de personalidad
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <span slot="start" className="material-symbols-outlined">chat</span>
          <IonLabel className={`ion-text-left`}>
            Frases diarias de motivación adaptadas a tu eneagrama
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <span slot="start" className="material-symbols-outlined">diversity_3</span>
          <IonLabel className={`ion-text-left`}>
            Acceso a la comunidad exclusiva para compartir tu crecimiento
            personal
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <span slot="start" className="material-symbols-outlined">sick</span>
          <IonLabel className={`ion-text-left`}>S.O.S Emocional</IonLabel>
        </IonItem>
      </IonList>
    </div>
  );
};
