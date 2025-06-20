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

  const [payment_status, setStatus] = useState<SubscriptionStatus>("free");
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

    if (!fechaVencimiento) {
      setStatus("free");
    } else if (user.ref_payco && user.ref_status == "failed") {
      setStatus("payment_failed");
    } else if (user.has_paid == 1) {
      setStatus(diasHastaVence! >= 0 ? "paid" : "expired");
    } else if (user.has_paid == 0) {
      setStatus(diasHastaVence! >= 0 ? "canceled" : "expired");
    } else {
      setStatus(diasHastaVence! >= 0 ? "trial" : "expired");
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
