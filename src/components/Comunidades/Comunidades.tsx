import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import {
  IonCol,
  IonGrid,
  IonRow
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

import styles from "./Comunidades.module.scss";
import { Item } from "./Item";

export const Comunidades = () => {

  const network = useNetwork();

  

  const comunidades = useLiveQuery(() => db.comunidades.toArray());
  

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  return (
    <div className={styles["ion-content"]}>
      <IonGrid>
        <IonRow>
          {comunidades?.map((comunidad: any, idx: number) => {
            return (
              <IonCol size="6" key={idx}>
                <Item comunidad={comunidad} setIsPremiumOpen={setIsPremiumOpen} />
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>

      <Modal
        isOpen={isPremiumOpen}
        title={import.meta.env.VITE_NAME + " premium"}
        hideButtons={!network.status || false}
        showButtons={false}
        onConfirm={() => {}}
        onWillDismiss={() => setIsPremiumOpen(false)}
      >
        <div className="ion-padding">
          <Premium />
          <Buttons />
        </div>
      </Modal>
    </div>
  );
};
