import { usePayment } from "@/hooks/usePayment";
import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Acordeon.module.scss";
import crecimiento from "/assets/icons/crecimiento.svg";

export const Podcasts = () => {
  const history = useHistory();

  const { podcast } = useSelector((state: any) => state.home);
  const { userEnabled } = usePayment();

  const goToPodcast = () => {
    history.replace("/crecimiento");
  };

  return (
    <>
      <IonAccordion
        value="podcast"
        toggleIcon={crecimiento}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>Audio del día</IonLabel>
          {podcast.done ? (
            <IonIcon icon={trophy} slot="end" className={styles["trofeo"]} />
          ) : (
            <IonIcon
              icon={trophy}
              slot="end"
              className={styles["trofeo-gris"]}
            />
          )}
        </IonItem>
        <div className="ion-padding" slot="content">
          {
            !userEnabled ?
            <IonButton
              disabled={true}
              expand="block"
              type="button"
              className="ion-margin-top ion-padding-start ion-padding-end"
            >
              Premium
            </IonButton>
            :
            <IonButton
              expand="block"
              type="button"
              className="ion-margin-top ion-padding-start ion-padding-end"
              onClick={goToPodcast}
            >
              Escuchar
            </IonButton>
          }
        </div>
      </IonAccordion>
    </>
  );
};
