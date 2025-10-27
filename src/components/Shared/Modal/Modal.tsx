import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";
import React, { cloneElement, memo, useRef, useState } from "react";
import styles from "./Modal.module.scss";

interface ExtraButton {
  text: string;
  className?: string; 
  icon?: string;
  iconSlot?: "start" | "end";
  onClick: (data?: any) => void;
}
interface Props {
  showButtons?: boolean;
  isOpen?: boolean;
  isBtnDisabled?: boolean;
  canDismiss?: boolean;
  trigger?: string;
  title?: string;
  closeText?: string;
  modalHeight?: string;
  children: any;
  hideButtons: boolean;
  onConfirm: (params?: any) => void;
  onWillDismiss?: (params?: any) => void;
  validateConfirm?: (data: any) => boolean;
  extraButtons?: ExtraButton[]; 
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
    modalHeight = '70vh',
    onConfirm,
    onWillDismiss,
    validateConfirm,
    extraButtons,
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
        style={modalHeight ? ({ ['--height' as any]: modalHeight } as React.CSSProperties) : undefined}
      >
        <IonContent>
          {canDismiss && (
            <IonIcon
              className={styles["close-icon"]}
              icon={closeCircleOutline}
              onClick={() => onClose()}
            />
          )}

          {title?.trim() && (
            <IonToolbar>
              <IonTitle className={styles["title"]}>{title}</IonTitle>
            </IonToolbar>
          )}

          {children.length
            ? children.map((child: any, idx: number) => {
                return cloneElement(child, { doChild, key: child.key ?? idx });
              })
            : cloneElement(children, { doChild })}

          <div className="flex space-around">
            {showButtons ? (
              !hideButtons ? (
                <IonButton shape="round" className="accept-button"
                  disabled={validateConfirm ? !validateConfirm(data) : isBtnDisabled}
                  onClick={() => dismiss()}>Completar</IonButton>
              ) : (
                <IonButton shape="clear" className="close-button" disabled={isBtnDisabled} onClick={() => dismiss()}>
                  {closeText}
                </IonButton>
              )
            ) : null}

            {extraButtons?.map((btn, idx) => (
              <IonButton
                key={idx}
                shape="round"
                className={btn.className}
                onClick={() => btn.onClick(data)}
              >
                {btn.icon && (
                  <IonIcon slot={btn.iconSlot || "start"} icon={btn.icon} />
                )}
                {btn.text}
              </IonButton>
            ))}
          </div>
        </IonContent>
      </IonModal>
    );
  }
);
