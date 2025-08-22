import { find } from "@/services/subscribe";
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonRow,
  IonText,
  useIonLoading,
} from "@ionic/react";

import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { useLiveQuery } from "dexie-react-hooks";
import styles from "./Planes.module.scss";

export const Planes = () => {
  const network = useNetwork();
  const [present, dismiss] = useIonLoading();

  const planes = useLiveQuery(() =>
    db.planes.where("key").equals("GENERAL").first()
  );

  const onPay = async (item: any) => {
    try {
      if (network.status) {
        await present({
          message: "Cargando...",
          duration: 3000,
        });

        const { data } = await find(item);

        dismiss();
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.log("Error onPay", error);
      dismiss();

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
        {planes?.valor.map((item: any, idx: any) => {
          const plan =
            item.key == "MES"
              ? "mensual"
              : item.key == "TRIM"
              ? "trimestral"
              : item.key == "SEM"
              ? "semestral"
              : "anual";
          return (
            <IonCol size="6" key={idx}>
              <IonCard
                button={true}
                onClick={() =>
                  onPay({ precio: item.valor, titulo: "plan " + plan })
                }
              >
                <IonCardTitle>
                  <h2 className="ion-text-center ion-padding-start ion-padding-end"> {plan} </h2>
                </IonCardTitle>
                <IonCardContent>
                  <p>${item.valor}/USD</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          );
        })}
      </IonRow>

      <Buttons />
    </div>
  );
};
