import { useNetwork } from "@/hooks/useNetwork";
import { all } from "@/services/alarmas";
import { IonButton } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Card } from "./Card";
import styles from "./Recordatorios.module.scss";

export const Recordatorios = () => {
  
  const history = useHistory();
  const network = useNetwork();

  const [lista, setLista] = useState<any[]>([]);

  const getNotifications = async () => {
    const {data: {data}} = await all();
    setLista(data);
  };

  const goToAdd = () => {
    history.replace("recordatorios/add");
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className={styles.cards}>
      {lista.map((item, idx) => {
        return <Card key={idx} notificacion={item} idx={idx} aferRemove={getNotifications} />;
      })}

      <div className="ion-text-center ion-padding">
        <IonButton disabled={!network.status} expand="block" onClick={goToAdd}>
          Agregar Nuevo Recordatorio
        </IonButton>
      </div>
    </div>
  );
};
