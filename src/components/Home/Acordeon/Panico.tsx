import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  useIonLoading,
} from "@ionic/react";

import { useHistory } from "react-router";
import styles from "./Acordeon.module.scss";

import { Modal } from "@/components/Shared/Modal/Modal";
import { usePayment } from "@/hooks/usePayment";
import { activar } from "@/services/sos";
import { setMsgSource, setPanico } from "@/store/slices/homeSlice";
import { shareSocialOutline } from "ionicons/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Audio } from "../Audio/Audio";
import { Texto } from "../Texto/Texto";
import panico from "/assets/icons/panico.svg";

export const Panico: React.FC<any> = ({ network }) => {
  const { user } = useSelector( (state: any) => state.user);
  const history = useHistory();
  const dispatch = useDispatch()
  const [present, dismiss] = useIonLoading();
  
  const { userEnabled } = usePayment();
  const [sos, setSOS] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const onGetSos = async () => {

    try {
      present({
        message: 'Activando...'
      })

      const { data } = await activar(user.eneatipo);

      setSOS({
        ...data,
        audio: {
          ...data.clip,
          imagen: data.imagen?.imagen,
          audio: data.clip?.clip,
        }
      });

      setIsOpen(true);

      dispatch(setPanico(data.texto));
      dispatch(setMsgSource('panico'));

    } catch (error) {
      console.error(error)
    } finally {
      dismiss();
    }
  }

  const onCloseModal = () => {
    setIsOpen(false);
  }

  return (
    <>
      <IonAccordion
        value="panico"
        toggleIcon={panico}
        toggleIconSlot="start"
        className={styles["custom-accordion"]}
      >
        <IonItem slot="header">
          <IonLabel>S.O.S Emocional</IonLabel>
          <IonText style={{ width: "20px" }}></IonText>
        </IonItem>
        <div className="ion-padding" slot="content">
          {
            !userEnabled?
              <IonButton
                disabled={true}
                expand="block"
                type="button"
                className="ion-margin-top ion-padding-start ion-padding-end"
              >
                Premium
              </IonButton> :
              <IonButton
                disabled={!network.status}
                expand="block"
                type="button"
                className="ion-margin-top ion-padding-start ion-padding-end"
                id="modal-panico"
                onClick={onGetSos}
              >
                Activar
              </IonButton>

          }
        </div>
      </IonAccordion>

      <Modal
        trigger=""
        title="S.O.S emocional"
        showButtons={false}
        style={{ "--height": "90%" }}
        onWillDismiss={() => onCloseModal()}
        isOpen={isOpen}
      >
        <Texto descripcion={sos.texto?.texto}>
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

        <Audio audio={sos.audio} onConfirm={() => { }} />
      </Modal>
    </>
  );
};
