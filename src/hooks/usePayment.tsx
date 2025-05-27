import { diferenciaRealEnDias } from "@/helpers/Fechas";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type SubscriptionStatus =
  | "free"
  | "trial"
  | "paid"
  | "expired"
  | "payment_failed";

const disabledStatus: SubscriptionStatus[] = ["expired", "payment_failed"];

export const usePayment = () => {
  const { user } = useSelector((state: any) => state.user);

  const [payment_status, setStatus] = useState<SubscriptionStatus>("free");
  const [userEnabled, setUserEnabled] = useState<boolean>(true);

  useEffect(() => {
    const getSubscriptionStatus = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (!user?.fecha_vencimiento) {
        setStatus("free");
        return;
      }

      if (user.ref_payco && user.ref_status === "failed") {
        setStatus("payment_failed");
        return;
      }

      const fechaVence = new Date(user.fecha_vencimiento);
      const diasHastaVence = diferenciaRealEnDias(now, fechaVence);

      if (user.has_paid) {
        setStatus(diasHastaVence >= 0 ? "paid" : "expired");
        return;
      } else {
        setStatus(diasHastaVence >= 0 ? "trial" : "expired");
        return;
      }
    };

    if (user) getSubscriptionStatus();
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
