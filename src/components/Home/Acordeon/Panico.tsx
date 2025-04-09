import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";

import { useHistory } from "react-router";
import styles from "./Acordeon.module.scss";

import { Modal } from "@/components/Modal/Modal";
import { shareSocialOutline } from "ionicons/icons";
import { useSelector } from "react-redux";
import { Audio } from "../Audio/Audio";
import { Texto } from "../Texto/Texto";
import panico from "/assets/icons/panico.svg";

export const Panico: React.FC<any> = () => {
  const { audio, currentDate } = useSelector((state: any) => state.home);

  const history = useHistory();

  return (
    <>
      <IonAccordion
        value="panico"
        toggleIcon={panico}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>S.O.S emocional</IonLabel>
          <IonText style={{ width: "20px" }}></IonText>
        </IonItem>
        <div className="ion-padding" slot="content">
          <IonButton
            expand="block"
            type="button"
            className="ion-margin-top ion-padding-start ion-padding-end"
            id="modal-panico"
          >
            Activar
          </IonButton>
        </div>
      </IonAccordion>

      <Modal
        trigger="modal-panico"
        title="S.O.S emocional"
        showButtons={false}
        style={{ "--height": "95%" }}
        onConfirm={() => {}}
      >
        <Texto descripcion="Completa nuestro test y descúbrelo. ¡Es el primer paso para entenderte mejor!">
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

        <Audio audio={audio} onConfirm={() => {}} />
      </Modal>
    </>
  );
};
