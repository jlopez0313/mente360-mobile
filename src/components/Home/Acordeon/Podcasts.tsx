import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { usePayment } from "@/hooks/usePayment";
import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Acordeon.module.scss";
import crecimiento from "/assets/icons/crecimiento.svg";

export const Podcasts: React.FC<any> = ({network}) => {
  const history = useHistory();

  const { podcast } = useSelector((state: any) => state.home);
  const { userEnabled, payment_status } = usePayment();

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

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
            !userEnabled || payment_status == 'free' ?
            <IonButton
              onClick={() => setIsPremiumOpen(true)}
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

      <Modal
        isOpen={isPremiumOpen}
        title={import.meta.env.VITE_NAME + " premium"}
        hideButtons={!network.status || false}
        showButtons={false}
        onConfirm={() => {}}
        onWillDismiss={() => setIsPremiumOpen(false)}
      >
        <div className="ion-padding">
          <Premium />
          <Buttons />
        </div>
      </Modal>
    </>
  );
};
