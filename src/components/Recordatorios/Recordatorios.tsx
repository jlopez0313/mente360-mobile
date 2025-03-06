import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import styles from "./Recordatorios.module.scss";
import { IonButton } from "@ionic/react";
import { useHistory } from "react-router";
import { all } from "@/services/alarmas";

export const Recordatorios = () => {
  const history = useHistory();

  const [lista, setLista] = useState<any[]>([]);

  const getNotifications = async () => {
    const {data: {data}} = await all();
    console.log( data )
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
      {lista.length == 0 && (
        <h5 className="ion-text-center">
          {" "}
          Aun no tienes recordatorios registrtados
        </h5>
      )}
      {lista.map((item, idx) => {
        return <Card key={idx} notificacion={item} idx={idx} aferRemove={getNotifications} />;
      })}

      <div className="ion-text-center ion-padding">
        <IonButton expand="block" onClick={goToAdd}>
          Agregar Nuevo Recordatorio
        </IonButton>
      </div>
    </div>
  );
};
