import { find } from "@/services/subscribe";
import {
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCol,
    IonRow,
    IonText
} from "@ionic/react";

import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { useNetwork } from "@/hooks/useNetwork";
import styles from "./Planes.module.scss";

export const Planes = () => {
  const network = useNetwork();

  const onPay = async (item: any) => {
    try {
      if (network.status) {
        const { data } = await find(item);
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.log("Error onPay", error);
    }
  };

  return (
    <div className={`ion-padding-start ion-padding-end ${styles["content"]}`}>
      <img src="assets/images/logo.png" className={`${styles["logo"]}`} />

      <IonText className="ion-text-center ion-margin-bottom">
        {" "}
        {import.meta.env.VITE_NAME}{" "}
      </IonText>

      <IonText className={`ion-margin-bottom ${styles["embarcate"]}`}>
        Embárcate en la búsqueda de tu mejor versión
      </IonText>

      <IonText className="ion-text-center ion-margin-bottom">
        Reinicia tu mente, reconecta con tu propósito y desbloquea tu máximo
        potencial, ¡Comienza ya!
      </IonText>

      <IonRow className={`ion-margin-bottom ${styles["planes"]}`}>
        <IonCol size="6">
          <IonCard
            button={true}
            onClick={() => onPay({ precio: "3.99", titulo: "plan mensual" })}
          >
            <IonCardTitle>
              <h2 className="ion-text-center ion-padding-start ion-padding-end">
                Mensual
              </h2>
            </IonCardTitle>
            <IonCardContent>
              <p>$3,99/USD</p>
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="6">
          <IonCard
            button={true}
            onClick={() => onPay({ precio: "39", titulo: "plan anual" })}
          >
            <IonCardTitle>
              <h2 className="ion-text-center ion-padding-start ion-padding-end">
                Anual
              </h2>
            </IonCardTitle>
            <IonCardContent>
              <p>$39/USD</p>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <Buttons />
    </div>
  );
};
