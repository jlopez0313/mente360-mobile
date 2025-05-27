import { useNetwork } from "@/hooks/useNetwork";
import { useSqliteDB } from "@/hooks/useSqliteDB";
import { readData } from "@/services/realtime-db";
import { setUser } from "@/store/slices/userSlice";
import { onValue } from "firebase/database";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const DBContext = React.createContext<any>(undefined);

export const DBProvider = ({ children }: any) => {
  const sqlite = useSqliteDB();
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.user);
  const network = useNetwork();
  const state = { sqlite };

  useEffect(() => {
    const checkPayment = () => {
      if (network.status && user) {
        onValue(readData("payments/" + user.id), (snapshot) => {
          const data = snapshot.val();

          if (user) {
            dispatch(setUser({ ...user, ...data }));
          }
        });
      }
    };

    checkPayment();
  }, []);

  return <DBContext.Provider value={state}>{children}</DBContext.Provider>;
};

export const useDB = () => {
  const context = useContext(DBContext);
  if (!context) throw new Error("useDB debe usarse dentro de DBProvider");
  return context;
};
