import { diferenciaRealEnDias } from "@/helpers/Fechas";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type SubscriptionStatus =
  | "free"
  | "trial"
  | "paid"
  | "expired"
  | "canceled"
  | "payment_failed";

const disabledStatus: SubscriptionStatus[] = [
  "canceled",
  "expired",
  "payment_failed",
];

export const usePayment = () => {
  const { user } = useSelector((state: any) => state.user);

  const [payment_status, setStatus] = useState<SubscriptionStatus>("");
  const [userEnabled, setUserEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const fechaVencimiento = user.fecha_vencimiento
      ? new Date(user.fecha_vencimiento)
      : null;

    const diasHastaVence =
      fechaVencimiento !== null
        ? diferenciaRealEnDias(now, fechaVencimiento)
        : null;

    const hasPaid =
      user.has_paid !== null && user.has_paid !== undefined
        ? Number(user.has_paid)
        : null;

    const vigente = diasHastaVence !== null && diasHastaVence >= 0;
    const cobroFallido = user.ref_status === "failed" || user.ref_status === "rejected";

    if (!fechaVencimiento) {
      setStatus("free");
    } else if (vigente) {
      // Mientras el periodo ya pagado siga vigente, un cobro de renovación
      // rechazado no le quita acceso todavía (periodo de gracia natural).
      if (hasPaid === 1) {
        setStatus("paid");
      } else if (hasPaid === 0 && user.ref_payco) {
        // ref_payco presente = hubo un pago/cancelación real de por medio.
        // Sin él, has_paid=false es solo el valor por defecto de un usuario
        // en prueba gratuita (ver UsuariosController::trial), no una cancelación.
        setStatus("canceled");
      } else {
        setStatus("trial");
      }
    } else if (cobroFallido && user.ref_payco) {
      setStatus("payment_failed");
    } else {
      setStatus("expired");
    }
  }, [user]);

  useEffect(() => {
    const isUserEnabled = () => {
      setUserEnabled(!disabledStatus.includes(payment_status));
    };

    isUserEnabled();
  }, [payment_status]);

  return {
    payment_status,
    userEnabled,
  };
};
