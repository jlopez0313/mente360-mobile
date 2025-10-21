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

export const Podcasts: React.FC<any> = ({ network }) => {
  const history = useHistory();

  const { user } = useSelector((state: any) => state.user);
  const { podcast } = useSelector((state: any) => state.home);
  const { userEnabled, payment_status } = usePayment();

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const goToPodcast = () => {
    const canalID = user.crecimientos.find(
      (c: any) =>
        c.nivel?.canal?.comunidades_id ==
        (localStorage.getItem("principal") ?? "1")
    )?.canal?.id ?? '1';
    history.replace("/crecimiento/" + canalID);
  };

  return (
    <>
      <IonAccordion
        value="podcast"
        toggleIcon={crecimiento}
        toggleIconSlot="start"
        className={`ion-no-padding ${styles["custom-accordion"]}`}
      >
        <IonItem slot="header" lines="none">
          <span className="material-symbols-outlined">queue_music</span>
          <div className={styles["title-accordion"]}>
            <IonLabel className="ion-no-padding title-accordion">Audio del día</IonLabel>
            <IonLabel className="ion-no-padding subtitle-accordion">Tu dosis diaria de motivación.</IonLabel>
          </div>

          {podcast.done ? (
            <span slot="end" className={`material-symbols-outlined $styles['trofeo']`}>emoji_events</span>
          ) : (
            <span slot="end" className={`material-symbols-outlined $styles['trofeo-gris']`}>emoji_events</span>
          )}
        </IonItem>
        <div className={styles['button-section']} slot="content">
          {!userEnabled || payment_status == "free" ? (
            <IonButton
              onClick={() => setIsPremiumOpen(true)}
              expand="block"
              type="button"
              className="ion-margin-top ion-padding-start ion-padding-end"
            >
              Premium
            </IonButton>
          ) : (
            <IonButton
              expand="block"
              type="button"
              className="ion-margin-top ion-padding-start ion-padding-end"
              onClick={goToPodcast}
            >
              Escuchar
            </IonButton>
          )}
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
