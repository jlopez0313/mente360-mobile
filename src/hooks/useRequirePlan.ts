import { usePayment } from "@/hooks/usePayment";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * Redirige a /planes si el usuario no tiene un plan activo
 * (free / expirado / cancelado / pago fallido).
 *
 * El gate principal vive en Home, pero estas pantallas también pueden
 * alcanzarse por deep link o notificación, así que revalidan por su cuenta.
 */
export const useRequirePlan = () => {
  const { userEnabled, payment_status } = usePayment();
  const history = useHistory();

  useEffect(() => {
    // payment_status vacío = aún sin resolver (usuario no cargado): no hacemos nada.
    if (!payment_status) return;
    if (!userEnabled || payment_status === "free") {
      history.replace("/planes");
    }
  }, [userEnabled, payment_status]);
};
