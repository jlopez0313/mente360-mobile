import { KEYS, getPreference, removePreference } from "@/helpers/preferences";
import { useToast } from "@/hooks/use-toast";
import { useNetwork } from "@/hooks/useNetwork";
import { readData, snapshotToArray } from "@/services/realtime-db";
import { getNotifications } from "@/store/thunks/notifications";
import { setUser } from "@/store/slices/userSlice";
import { onValue } from "firebase/database";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const FirebaseContext = React.createContext<any>(undefined);

export const FirebaseProvider = ({ children }: any) => {
  const dispatch = useDispatch<any>();
  const { toast } = useToast();

  const { user } = useSelector((state: any) => state.user);
  const network = useNetwork();
  const state = {};

  const lastPaymentHoraRef = useRef<string | null>(null);

  // Avisa con un toast cuando ePayco o el backend confirman o rechazan un pago
  const handlePaymentNotification = async (data: any) => {
    if (!data || !data.ref_status) return;

    // Evitar procesar el mismo evento repetidamente
    if (data.hora && data.hora === lastPaymentHoraRef.current) return;
    lastPaymentHoraRef.current = data.hora || String(Date.now());

    const pendingRef = await getPreference(KEYS.EPAYCO_PENDING_REF);
    const isMatchingPending = pendingRef && data.ref_payco === pendingRef;

    const nombreComunidad = data.comunidad_nombre || "la comunidad";

    if (data.ref_status === "success") {
      if (isMatchingPending) {
        await removePreference(KEYS.EPAYCO_PENDING_REF);
      }
      toast({
        title: "¡Pago confirmado!",
        description: `Tu suscripción a ${nombreComunidad} ya está activa.`,
      });
      dispatch(getNotifications());
    } else if (["rejected", "failed", "unknown"].includes(data.ref_status)) {
      if (isMatchingPending) {
        await removePreference(KEYS.EPAYCO_PENDING_REF);
      }
      toast({
        title: "Pago no procesado",
        description: `El pago de tu suscripción a ${nombreComunidad} no pudo completarse.`,
        variant: "destructive",
      });
      dispatch(getNotifications());
    }
  };

  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    const checkPayment = () => {
      if (network.status && user?.id) {
        const userRef = readData("users/" + user.id);
        const unsubUser = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            dispatch(setUser(data));
            if (data.ref_status && data.ref_payco) {
              handlePaymentNotification(data);
            }
          }
        });
        unsubscribes.push(unsubUser);

        const paymentRef = readData("payments/" + user.id);
        const unsubPayment = onValue(paymentRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            dispatch(setUser(data));
            handlePaymentNotification(data);
          }
        });
        unsubscribes.push(unsubPayment);

        const subRef = readData("subscriptions/" + user.id);
        const unsubSubscription = onValue(subRef, (snapshot) => {
          const objData = snapshot.val();
          const data = snapshotToArray(objData);
          const suscripciones = data
            ?.filter((item: any) => item)
            .map((item: any) => {
              return {
                comunidad: "",
                created_at: null,
                deleted_at: null,
                id: item.comunidades_id,
                pivot: {
                  comunidades_id: item.comunidades_id,
                  fecha_pago: item.fecha_pago,
                  fecha_vencimiento: item.fecha_vencimiento,
                  id: item.id,
                  users_id: user.id,
                  precio: item.precio,
                  ref_status: item.ref_status,
                  ref_payco: item.ref_payco,
                },
                updated_at: null,
              };
            });

          if (suscripciones?.length) {
            dispatch(setUser({ suscripciones: [...suscripciones] }));
          }
        });
        unsubscribes.push(unsubSubscription);
      }
    };

    checkPayment();

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [user?.id, network.status]);

  return <FirebaseContext.Provider value={state}>{children}</FirebaseContext.Provider>;
};
