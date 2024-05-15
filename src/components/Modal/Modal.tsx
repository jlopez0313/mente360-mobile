import {
  IonButton,
  IonContent,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useRef } from "react";
import styles from './Modal.module.scss';

interface Props {
    trigger: string
    title: string,
    children: any
}

export const Modal: React.FC<Props> = ({ trigger, title, children }) => {
    
  const modal = useRef<HTMLIonModalElement>(null);
  
  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <IonModal className={styles['example-modal']} ref={modal} trigger={trigger}>
      <IonContent>
        <IonToolbar>
          <IonTitle> {title} </IonTitle>
        </IonToolbar>
        
        {children}

        <IonButton onClick={() => dismiss()} shape="round">Terminar</IonButton>
      </IonContent>
    </IonModal>
  );
};
