import { useNetwork } from "@/hooks/useNetwork";
import { readData, snapshotToArray } from "@/services/realtime-db";
import { setUser } from "@/store/slices/userSlice";
import { onValue } from "firebase/database";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const FirebaseContext = React.createContext<any>(undefined);

export const FirebaseProvider = ({ children }: any) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const network = useNetwork();
  const state = {};

  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    const checkPayment = () => {
      if (network.status && user?.id) {
        const userRef = readData("users/" + user.id);
        const unsubUser = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            dispatch(setUser(data));
          }
        });
        unsubscribes.push(unsubUser);

        const paymentRef = readData("payments/" + user.id);
        const unsubPayment = onValue(paymentRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            dispatch(setUser(data));
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
