import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { memo, useRef } from "react";
import styles from './Modal.module.scss';
import { close, closeCircle } from "ionicons/icons";

interface Props {
    trigger: string;
    title?: string;
    children: any;
    hideButtons: boolean;
    onConfirm: () => void;
}

export const Modal: React.FC<Props> = memo(
  ({ trigger, title, children, onConfirm, hideButtons = false }) => {

    const modal = useRef<HTMLIonModalElement>(null);
    
    function dismiss() {
      onConfirm();
      modal.current?.dismiss();
    }

    return (
      <IonModal className={styles['example-modal']} ref={modal} trigger={trigger}>
        <IonContent>

          <IonToolbar>
            <IonTitle> {title} </IonTitle>
          </IonToolbar>
          
          {children}

          {
            !hideButtons ?
            <IonButton onClick={() => dismiss()} shape="round">Terminar</IonButton> :
            <IonButton onClick={() => modal.current?.dismiss()} shape="round"> 
              <IonIcon icon={close} slot="start" />
              Cerrar
            </IonButton>
          }


        </IonContent>
      </IonModal>
    );
  }
);
