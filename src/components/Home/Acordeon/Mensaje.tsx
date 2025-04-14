import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  useIonAlert
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import styles from "./Acordeon.module.scss";

import { shareSocialOutline, trophy } from "ionicons/icons";
import mensajeIcon from "/assets/icons/mensaje.svg";

import { Modal } from "@/components/Shared/Modal/Modal";
import { useDB } from "@/context/Context";
import MensajesDB from "@/database/mensajes";
import { setMensaje, setMsgSource } from "@/store/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Texto } from "../Texto/Texto";

export const Mensaje: React.FC<any> = ({network}) => {
  const history = useHistory();
  const { mensaje } = useSelector((state: any) => state.home);

  const [presentAlert] = useIonAlert();
  const dispatch = useDispatch();
  const { sqlite } = useDB();

  const onSetSource = () => {
    dispatch(setMsgSource('mensaje'));
  }

  const onConfirmMensaje = async () => {
    try {
      const mensajesDB = new MensajesDB(sqlite.db);
      await mensajesDB.markAsDone(sqlite.performSQLAction, () => {}, {
        id: mensaje.id,
        done: 1,
      });

      const newData = {
        ...mensaje,
        done: 1,
      };

      dispatch(setMensaje({ ...newData }));
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
            <IonIcon icon={trophy} slot="end" className={styles.trofeo} />
          ) : (
            <IonText style={{ width: "20px" }}></IonText>
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
        hideButtons={!network.status || mensaje.done || false}
        onConfirm={() => onConfirmMensaje()}
      >
        <Texto descripcion={mensaje.mensaje || ""}>
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
