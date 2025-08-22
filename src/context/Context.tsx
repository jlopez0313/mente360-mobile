import { useNetwork } from "@/hooks/useNetwork";
import { readData } from "@/services/realtime-db";
import { setUser } from "@/store/slices/userSlice";
import { onValue } from "firebase/database";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const DBContext = React.createContext<any>(undefined);

export const DBProvider = ({ children }: any) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const network = useNetwork();
  const state = {};

  useEffect(() => {
    const checkPayment = () => {
      if (network.status && user) {
        onValue(readData("payments/" + user.id), (snapshot) => {
          const data = snapshot.val();

          if (user) {
            dispatch(setUser({ ...user, ...data }));
          }
        });

        onValue(readData("subscriptions/" + user.id), (snapshot) => {
          const data = snapshot.val();
          const suscripciones = data
            ?.filter((item: any) => item)
            .map((item: any) => {
              return {
                comunidad: '',
                created_at: null,
                deleted_at: null,
                id: item.comunidades_id,
                pivot: {
                  comunidades_id: item.comunidades_id,
                  fecha_pago: item.fecha_pago,
                  fecha_vencimiento: item.fecha_vencimiento,
                  id: item.id,
                  users_id: user.id,
                },
                updated_at: null,
              };
            });

          dispatch(setUser({ ...user, suscripciones: [...suscripciones] }));
        });
      }
    };

    checkPayment();
  }, []);

  return <DBContext.Provider value={state}>{children}</DBContext.Provider>;
};
