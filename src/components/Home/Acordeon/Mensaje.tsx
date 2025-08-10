import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  useIonAlert
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import styles from "./Acordeon.module.scss";

import { shareSocialOutline, trophy } from "ionicons/icons";
import mensajeIcon from "/assets/icons/mensaje.svg";

import { Modal } from "@/components/Shared/Modal/Modal";
import { db } from "@/hooks/useDexie";
import { setMsgSource } from "@/store/slices/homeSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch } from "react-redux";
import { Texto } from "../Texto/Texto";

export const Mensaje: React.FC<any> = ({network}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const mensaje = useLiveQuery( ( ) => db.mensajes.toCollection().first() )

  const [presentAlert] = useIonAlert();

  const onSetSource = () => {
    dispatch(setMsgSource('mensaje'));
  }

  const onConfirmMensaje = async () => {
    try {
      await db.mensajes.update(mensaje?.id ?? 1, { done: 1 });
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
        value="mensaje"
        toggleIcon={mensajeIcon}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>Mensaje del día</IonLabel>
          {mensaje?.done ? (
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
            id="modal-comentario"
            onClick={onSetSource}
          >
            Ver
          </IonButton>
        </div>
      </IonAccordion>

      <Modal
        trigger="modal-comentario"
        title="Mensaje del día"
        hideButtons={!network.status || mensaje?.done == 1 || false}
        onConfirm={() => onConfirmMensaje()}
      >
        <Texto descripcion={mensaje?.mensaje || ""}>
          <img
            src="assets/images/logo_texto.png"
            style={{ width: "90px", display: "block", margin: "10px auto" }}
          />
          <IonIcon
            icon={shareSocialOutline}
            style={{
              fontSize: "2rem",
              width: "90px",
              display: "block",
              margin: "15px auto",
            }}
            onClick={() => {
              history.replace("/share");
            }}
          />
        </Texto>
      </Modal>
    </>
  );
};
