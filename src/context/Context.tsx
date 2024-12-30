import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { Toast } from "@/components/Toast/Toast";

import { Database, Storage } from '@ionic/storage';

export const Context = React.createContext<any>(undefined);

type Props = {
  children: any;
};

export const UIProvider = ({ children }: Props) => {

  const [db, setDb] = useState<Database | null>(null);

  const initDb = async () => {
    const store = new Storage();
    const db = await store.create();
    setDb(db);
  }

  useEffect( ( ) => {
    initDb();
  }, []);

  const state = {
    db,
  };

  return <Context.Provider value={state}> 
    {children}
  </Context.Provider>;
};

export default Context;
