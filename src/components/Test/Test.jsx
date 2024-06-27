import React, { useState } from "react";

import Momento1 from "./Momento1/Momento1";
import Momento2 from "./Momento2/Momento2";

export const Test = () => {
  const [momentos, setMomentos] = useState({})

  const onSetMomento = ( momento, valor ) => {
    momentos[momento] = valor

    setMomentos({ 
      ...momentos,
    })
  }

  return (
    <>
      {        
        !momentos.uno && !momentos.dos ?
          <Momento1 momentos={momentos} onSetMomento={onSetMomento} /> :
          <Momento2 momentos={momentos} onSetMomento={onSetMomento} />
      }

    </>
  );
};
