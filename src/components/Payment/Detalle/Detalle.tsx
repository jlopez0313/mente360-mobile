import { Modal } from "@/components/Shared/Modal/Modal";
import { Premium } from "@/components/Shared/Premium/Premium";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import { updateData } from "@/services/realtime-db";
import { find } from "@/services/subscribe";
import { update } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import {
  IonBadge,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  useIonLoading,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Cancel } from "../Cancel/Cancel";
import styles from "./Detalle.module.scss";

export const Detalle = () => {
  const history = useHistory();
  const network = useNetwork();
  const dispatch = useDispatch();

  const planes = useLiveQuery(() =>
    db.planes.where("key").equals("GENERAL").first()
  );

  const { userEnabled, payment_status } = usePayment();
  const [present, dismiss] = useIonLoading();

  const [isOpen, setIsOpen] = useState(false);

  const { user } = useSelector((state: any) => state.user);

  const onPay = async (item: any) => {
    if ((userEnabled && payment_status != "free") || !network.status) return;

    try {
      await present({
        message: "Cargando...",
        duration: 3000,
      });
      
      const { data } = await find(item);

      dismiss();
      window.open(data.url, "_blank");
    } catch (error) {
      console.log( error )
      dismiss();
    }
  };

  const onCancelSuscription = async () => {
    try {
      setIsOpen(false);
      await present({
        message: "Cargando...",
        duration: 3000,
      });

      const {
        data: { data: updated },
      } = await update({ has_paid: false }, user.id);
      dispatch(setUser({ ...updated }));
      dismiss();

      await updateData(`payments/${user.id}`, {
        ref_status: "canceled",
        hora: new Date().toISOString(),
        has_paid: false,
      });

      history.replace("/perfil");
    } catch (error) {
      console.log("Error Cancelando", error);
    }
  };

  return (
    <div className={`${styles["content"]}`}>
      <Premium />

      <IonList
        className={`ion-text-justify ion-margin-top ion-margin-bottom ${styles["w-100"]} ${styles["precios"]}`}
      >
        {/* 
          <span className={``}>Mejor Opción</span>
        */}
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
            <div key={idx}>

              <IonItem
                button={true}
                onClick={() =>
                  onPay({ precio: item.valor, titulo: "plan " + plan })
                }
              >
                <IonLabel className={`ion-text-left`}>
                  <h2>{plan}</h2>
                  <p>Cancela en cualquier momento</p>
                </IonLabel>
                {userEnabled && payment_status != "free" ? null : (
                  <IonBadge slot="end">
                    ${item.valor} USD/{plan}
                  </IonBadge>
                )}
              </IonItem>
            </div>
          );
        })}
      </IonList>

      {userEnabled && payment_status != "free" ? (
        <IonButton disabled={!network.status} onClick={() => setIsOpen(true)}>
          {" "}
          Cancelar Mi Suscripción{" "}
        </IonButton>
      ) : (
        <IonText className={`ion-margin-top`}>
          <b>Cancela en cualquier momento.</b>
          <br />
          La suscripción se renueva automáticamente a menos que se cancele 24
          horas antes del final del período.
        </IonText>
      )}

      <Modal
        style={{ "--height": "80%" }}
        title="¿Deseas cancelar?"
        isOpen={isOpen}
        hideButtons={true}
        showButtons={false}
        onConfirm={onCancelSuscription}
        onWillDismiss={() => setIsOpen(false)}
      >
        <Cancel
          onClose={() => setIsOpen(false)}
          onConfirm={onCancelSuscription}
        />
      </Modal>
    </div>
  );
};
