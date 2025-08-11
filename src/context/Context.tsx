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
  const state = { };

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
