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
import React, { cloneElement, memo, useRef, useState } from "react";
import styles from "./Modal.module.scss";
import { close, closeCircle } from "ionicons/icons";

interface Props {
  showButtons: boolean;
  isOpen: boolean;
  canDismiss: boolean;
  trigger: string;
  title?: string;
  children: any;
  hideButtons: boolean;
  onConfirm: (params?: any) => void;
  onWillDismiss: (params?: any) => void;
}

export const Modal: React.FC<Props> = memo(
  ({
    trigger,
    title,
    children,
    hideButtons = false,
    isOpen = false,
    canDismiss = true,
    showButtons = true,
    onConfirm,
    onWillDismiss,
  }) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [data, setData] = useState();

    function dismiss() {
      onConfirm(data);
      modal.current?.dismiss();
    }

    const doChild = (params: any) => {
      setData(params);
    };

    return (
      <IonModal
        className={styles["example-modal"]}
        ref={modal}
        trigger={trigger}
        isOpen={isOpen}
        canDismiss={canDismiss}
        onWillDismiss={ onWillDismiss }
      >
        <IonContent>
          <IonToolbar>
            <IonTitle> {title} </IonTitle>
          </IonToolbar>

          {cloneElement(children, { doChild })}

          {showButtons ? (
            !hideButtons ? (
              <IonButton onClick={() => dismiss()}>
                Terminar
              </IonButton>
            ) : (
              <IonButton onClick={() => modal.current?.dismiss()}>
                <IonIcon icon={close} slot="start" />
                Cerrar
              </IonButton>
            )
          ) : null}
        </IonContent>
      </IonModal>
    );
  }
);
