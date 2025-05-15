import { getUser, setUser } from "@/helpers/onboarding";
import { useNetwork } from "@/hooks/useNetwork";
import { useSqliteDB } from "@/hooks/useSqliteDB";
import { readData } from "@/services/realtime-db";
import { onValue } from "firebase/database";
import React, { useContext, useEffect } from "react";

export const DBContext = React.createContext<any>(undefined);

export const DBProvider = ({ children }: any) => {
  const sqlite = useSqliteDB();

  const user = getUser();
  const network = useNetwork();
  const state = { sqlite };

  useEffect(() => {
    const checkPayment = () => {
      if ( network.status && user?.user) {
        onValue(readData("payments/" + user.user.id), (snapshot) => {
          const data = snapshot.val();
          if( data?.ref_payco )
            setUser({ ...user, user: { ...user.user, has_paid: true, fecha_vencimiento: data.vence } })
          else 
            setUser({ ...user, user: { ...user.user, has_paid: null } })
        });
      }
    }

    checkPayment();

  }, [])

  return <DBContext.Provider value={state}>{children}</DBContext.Provider>;
};

export const useDB = () => {
  const context = useContext(DBContext);
  if (!context) throw new Error("useDB debe usarse dentro de DBProvider");
  return context;
};