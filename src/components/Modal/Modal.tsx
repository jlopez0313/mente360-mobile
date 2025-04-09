import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, closeCircleOutline } from "ionicons/icons";
import React, { cloneElement, memo, useRef, useState } from "react";
import styles from "./Modal.module.scss";

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
    ...props
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

    const onClose = () => {
      console.log('closing modal')
      modal.current?.dismiss()
    }

    return (
      <IonModal
        className={styles["example-modal"]}
        ref={modal}
        trigger={trigger}
        isOpen={isOpen}
        canDismiss={canDismiss}
        onWillDismiss={onWillDismiss}
        {...props}
      >
        <IonContent>
          {canDismiss && (
            <IonIcon
              className={styles["close-icon"]}
              icon={closeCircleOutline}
              onClick={() => onClose()}
            />
          )}

          <IonToolbar>
            <IonTitle> {title} </IonTitle>
          </IonToolbar>

          {children.length
            ? children.map((child: any, idx: number) => {
                return cloneElement(child, { doChild });
              })
            : cloneElement(children, { doChild })}

          {showButtons ? (
            !hideButtons ? (
              <IonButton onClick={() => dismiss()}>Completar</IonButton>
            ) : (
              <IonButton onClick={() => dismiss()}>
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
