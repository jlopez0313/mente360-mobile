import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Subscribe.module.scss";

export const Subscribe = () => {
  const history = useHistory();
  const network = useNetwork();

  const { user } = useSelector((state: any) => state.user);

  const { userEnabled, payment_status } = usePayment();

  const comunidades = useLiveQuery(() => db.comunidades.toArray());
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const goToCanales = (comunidadId: number, liderId: number) => {
    if (!userEnabled || payment_status == "free") {
      setIsPremiumOpen(true);
    } else {
      if (!user.suscripciones.some((s: any) => s.id == comunidadId)) {
        setIsPremiumOpen(true);
      } else {
        history.replace(`/lideres/${liderId}/canales`);
      }
    }
  };

  const hasSuscription = (comunidadId: number) => {
    if (
      !userEnabled ||
      payment_status == "free" ||
      !user.suscripciones.some((s: any) => s.id == comunidadId)
    ) {
      return false;
    }
    return true;
  };

  return (
    <div className={styles["ion-content"]}>
      <IonGrid>
        <IonRow>
          {comunidades?.map((comunidad: any, idx: number) => {
            return (
              <IonCol size="6" key={idx}>
                <IonCard
                  onClick={() => goToCanales(comunidad.id, comunidad.lider?.id)}
                >
                  <img alt={comunidad.comunidad} src={AudioNoWifi} />
                  <IonCardHeader>
                    <IonCardTitle> {comunidad.comunidad} </IonCardTitle>
                    <IonCardSubtitle> {comunidad.lider?.name} </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {hasSuscription(comunidad.id) && (
                      <IonButton expand="block" className={styles['suscribete']}>Suscribete</IonButton>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>

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
    </div>
  );
};
