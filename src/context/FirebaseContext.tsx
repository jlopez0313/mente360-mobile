import { KEYS, getPreference, removePreference } from "@/helpers/preferences";
import { useToast } from "@/hooks/use-toast";
import { useNetwork } from "@/hooks/useNetwork";
import { readData, snapshotToArray } from "@/services/realtime-db";
import { find as findUser } from "@/services/user";
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

  // Avisa con un toast SOLO cuando el pago que el usuario dejó pendiente
  // (EPAYCO_PENDING_REF) se confirma o se rechaza. Sin ref pendiente no hace
  // nada: así un `ref_status: "success"` viejo no dispara el toast en cada
  // refresco.
  const handlePaymentNotification = async (data: any) => {
    if (!data || !data.ref_status) return;

    const pendingRef = await getPreference(KEYS.EPAYCO_PENDING_REF);
    const isMatchingPending = pendingRef && data.ref_payco === pendingRef;
    if (!isMatchingPending) return;

    // Evitar procesar el mismo evento pendiente dos veces en esta sesión
    const eventKey = `${data.ref_payco}|${data.hora || ""}`;
    if (eventKey === lastPaymentHoraRef.current) return;
    lastPaymentHoraRef.current = eventKey;

    const nombreComunidad = data.comunidad_nombre || "la comunidad";

    if (data.ref_status === "success") {
      await removePreference(KEYS.EPAYCO_PENDING_REF);
      // Traer el estado real del usuario desde la API (no confiar en el blob de RTDB)
      try {
        const { data: fresh } = await findUser(user.id);
        if (fresh?.data) dispatch(setUser(fresh.data));
      } catch (e) {
        console.error("No se pudo refrescar el usuario tras el pago:", e);
      }
      toast({
        title: "¡Pago confirmado!",
        description: `Tu suscripción a ${nombreComunidad} ya está activa.`,
      });
      dispatch(getNotifications());
    } else if (["rejected", "failed", "unknown"].includes(data.ref_status)) {
      await removePreference(KEYS.EPAYCO_PENDING_REF);
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
        // users/{id}: espejo en vivo del usuario (incluye estado de suscripción).
        // Es la fuente que refleja cambios hechos en el backend / RTDB.
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

        // payments/{id} es un blob de evento de pago, NO estado de usuario:
        // solo lo usamos para el aviso, nunca para setUser (mergearlo pisaba
        // has_paid / fecha_vencimiento con datos de un intento viejo).
        const paymentRef = readData("payments/" + user.id);
        const unsubPayment = onValue(paymentRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
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
