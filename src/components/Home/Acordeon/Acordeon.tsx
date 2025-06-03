import { IonAccordionGroup } from "@ionic/react";
import styles from "./Acordeon.module.scss";

import { useNetwork } from "@/hooks/useNetwork";
import { Audio } from "./Audio";
import { Mensaje } from "./Mensaje";
import { Panico } from "./Panico";
import { Podcasts } from "./Podcasts";
import { Tarea } from "./Tarea";

export const Acordeon = () => {

  const network = useNetwork();

  return (
    <IonAccordionGroup expand="inset" className={styles["cards"]}>
      <Tarea network={network} />

      <Mensaje network={network} />

      <Audio network={network} />

      <Podcasts network={network}  />

      <Panico network={network} />
    </IonAccordionGroup>
  );
};
