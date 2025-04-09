import { useSqliteDB } from "@/hooks/useSqliteDB";
import React, { useContext } from "react";

export const DBContext = React.createContext<any>(undefined);

export const DBProvider = ({ children }: any) => {
  const sqlite = useSqliteDB();

  const state = { sqlite };

  return <DBContext.Provider value={state}>{children}</DBContext.Provider>;
};

export const useDB = () => {
  const context = useContext(DBContext);
  if (!context) throw new Error("useDB debe usarse dentro de DBProvider");
  return context;
};