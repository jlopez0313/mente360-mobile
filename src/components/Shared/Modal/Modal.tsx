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
  showButtons?: boolean;
  isOpen?: boolean;
  isBtnDisabled?: boolean;
  canDismiss?: boolean;
  trigger?: string;
  title?: string;
  closeText?: string;
  children: any;
  hideButtons: boolean;
  onConfirm: (params?: any) => void;
  onWillDismiss?: (params?: any) => void;
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
    isBtnDisabled = false,
    closeText = 'Cerrar',
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
        isOpen={isOpen ?? undefined}
        trigger={isOpen ? undefined : trigger}
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
            <IonTitle className={styles["title"]}> {title} </IonTitle>
          </IonToolbar>

          {children.length
            ? children.map((child: any, idx: number) => {
                return cloneElement(child, { doChild, key: child.key ?? idx });
              })
            : cloneElement(children, { doChild })}

          {showButtons ? (
            !hideButtons ? (
              <IonButton onClick={() => dismiss()}>Completar</IonButton>
            ) : (
              <IonButton disabled={isBtnDisabled} onClick={() => dismiss()}>
                <IonIcon icon={close} slot="start" />
                {closeText}
              </IonButton>
            )
          ) : null}
        </IonContent>
      </IonModal>
    );
  }
);
