import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  useIonAlert
} from "@ionic/react";

import styles from "./Acordeon.module.scss";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { Modal } from "@/components/Shared/Modal/Modal";
import { db } from "@/hooks/useDexie";
import { usePayment } from "@/hooks/usePayment";
import { confirmTarea } from "@/services/home";
import { setTab } from "@/store/slices/chatSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { trophy } from "ionicons/icons";
import { Texto } from "../Texto/Texto";
import tareaIcon from "/assets/icons/tarea.svg";

export const Tarea: React.FC<any> = ({network}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userEnabled, payment_status } = usePayment();

  const [presentAlert] = useIonAlert();

  const tarea = useLiveQuery( ( ) => db.tareas.toCollection().first() );
  
  const { currentDay } = useSelector((state: any) => state.home);

  const onConfirmTarea = async () => {
    try {
      if (currentDay == 1) {
        
        await db.tareas.update(tarea?.id ?? 1, { done: 1 });

        const formData = {
          tareas_id: tarea?.id,
        };

        await confirmTarea(formData);
      }

      dispatch(setTab("grupos"));
      history.replace("/chat");
    } catch (error: any) {
      console.log(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    }
  };
  return (
    <>
      <IonAccordion
        value="tarea"
        toggleIcon={tareaIcon}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>Tarea de la semana</IonLabel>
          {tarea?.done ? (
            <IonIcon icon={trophy} slot="end" className={styles['trofeo']} />
          ) : (
            <IonIcon icon={trophy} slot="end" className={styles['trofeo-gris']} />
          )}
        </IonItem>
        <div className="ion-padding" slot="content">
          <IonButton
            expand="block"
            type="button"
            className="ion-margin-top ion-padding-start ion-padding-end"
            id="modal-tarea"
          >
            Ver
          </IonButton>
        </div>
      </IonAccordion>

      <Modal
        trigger="modal-tarea"
        title="Tarea de la semana"
        closeText={ userEnabled && payment_status != 'free' ? "Ir a Grupo" : "Premium"}
        isBtnDisabled={ !userEnabled || payment_status == 'free' }
        hideButtons={ !network.status || tarea?.done == 1 || currentDay != 1 || false}
        onConfirm={() => onConfirmTarea()}
      >
        <Texto descripcion={tarea?.tarea || ""} children={null} />
      </Modal>
    </>
  );
};
