import { IonAccordionGroup } from "@ionic/react";
import styles from "./Acordeon.module.scss";



import { Audio } from "./Audio";
import { Mensaje } from "./Mensaje";
import { Panico } from "./Panico";
import { Podcasts } from "./Podcasts";
import { Tarea } from "./Tarea";

export const Acordeon = () => {
  return (
    <IonAccordionGroup expand="inset" className={styles["cards"]}>
      <Tarea  />

      <Mensaje  />


      <Audio />

      <Podcasts />
      
      <Panico  />
    </IonAccordionGroup>
  );
};
