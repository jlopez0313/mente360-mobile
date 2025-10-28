import { useNetwork } from "@/hooks/useNetwork";
import { all } from "@/services/alarmas";
import { IonButton, useIonLoading, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Card } from "./Card";
import styles from "./Recordatorios.module.scss";
import { add } from "ionicons/icons";

import emptyImg from "/assets/icons/hello.svg"; 
import EmptyState from "../EmptyState/EmptyState";

export const Recordatorios = () => {

  const history = useHistory();
  const network = useNetwork();
  const [present, onDismiss] = useIonLoading();

  const [lista, setLista] = useState<any[]>([]);

  const getNotifications = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const { data: { data } } = await all();
      setLista(data);

    } catch (error) {
      console.error(error);
    } finally {
      onDismiss();
    }
  };

  const goToAdd = () => {
    history.replace("recordatorios/add");
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className={styles.cards}>
      {lista.length > 0 ? (
        lista.map((item, idx) => (
          <Card key={idx} notificacion={item} idx={idx} aferRemove={getNotifications} />
        ))
      ) : (
        <EmptyState
          image={emptyImg}
          title="Aún no tienes recordatorios registrados"
          subtitle="¿Creamos Uno?"
        />
      )}

      <div className="ion-text-center ion-padding">
        <IonFab horizontal="end" vertical="bottom">
          <IonFabButton disabled={!network.status} onClick={goToAdd} id="add" className="ion-margin-bottom">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </div>
    </div>
  );
};
