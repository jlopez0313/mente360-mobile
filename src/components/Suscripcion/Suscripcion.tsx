import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Item } from "./Item";
import styles from "./Suscripcion.module.scss";

export const Suscripcion = () => {
  const network = useNetwork();

  const { user } = useSelector((state: any) => state.user);
  const suscripciones = user.suscripciones.map((s: any) => s.id);

  const comunidades = useLiveQuery(
    () =>
      db.comunidades
        .filter((c: any) => suscripciones.includes(c.id))
        .toArray(),
    [suscripciones]
  );
  
  const { userEnabled, payment_status } = usePayment();

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const getFechaVencimiento = () => {
    return new Date(user.fecha_vencimiento)
      .toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replaceAll("/", "-");
  };

  const getFinSuscripcion = (comunidadID: number) => {
    const fecha_vencimiento = user.suscripciones.find(
      (s: any) => s.id == comunidadID
    )?.pivot?.fecha_vencimiento;
    if (!fecha_vencimiento) {
      return null;
    }

    const fecha = new Date(fecha_vencimiento);
    const hoy = new Date();

    return {
      fecha_formateada: new Date(fecha_vencimiento)
        .toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replaceAll("/", "-"),
      vencida: fecha < hoy,
    };
  };

  return (
    <div className={styles["ion-content"]}>
      {userEnabled && payment_status != "free" ? (
        <div
          className={`ion-margin-top ion-margin-bottom ion-text-center ${styles["premium"]}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {import.meta.env.VITE_NAME} PREMIUM
          </span>
          <span>Vence el: {getFechaVencimiento()}</span>
        </div>
      ) : null}

      {comunidades?.map((comunidad: any, idx: number) => {
        const finSuscripcion = getFinSuscripcion(comunidad.id);

        return (
          <Item
            key={idx}
            finSuscripcion={finSuscripcion}
            comunidad={comunidad}
            setIsPremiumOpen={setIsPremiumOpen}
          />
        );
      })}
       
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
