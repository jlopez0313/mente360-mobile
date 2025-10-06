import { useState } from "react";

import { Modal } from "@/components/Shared/Modal/Modal";
import Momento1 from "./Momento1/Momento1";
import Momento2 from "./Momento2/Momento2";
import { Texto } from "./Texto/Texto";

export const Test = () => {
  const [momentos, setMomentos] = useState<any>({});
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const onSetMomento = (momento: any, valor: any) => {
    momentos[momento] = valor;

    setMomentos({
      ...momentos,
    });
  };

  return (
    <>
      {!momentos.uno && !momentos.dos ? (
        <Momento1 momentos={momentos} onSetMomento={onSetMomento} />
      ) : (
        <Momento2 momentos={momentos} onSetMomento={onSetMomento} />
      )}

      <Modal
        isOpen={isOpen}
        showButtons={true}
        canDismiss={true}
        title="El Eneagrama en Mente360"
        hideButtons={true}
        onConfirm={() => setIsOpen(false)}
      >
        <Texto />
      </Modal>
    </>
  );
};
