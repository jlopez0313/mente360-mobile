import { IonButton, IonContent, IonIcon, IonModal } from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useRef } from "react";
import Avatar from "@/assets/images/avatar.jpg";

export const Photo: React.FC<any> = ({otherUser, showImageModal, setShowImageModal}) => {

  const baseURL = import.meta.env.VITE_BASE_BACK;

  const modalRef = useRef<HTMLIonModalElement>(null);

  return (
    <IonModal
      ref={modalRef}
      isOpen={showImageModal}
      onDidDismiss={() => setShowImageModal(false)}
      className="fullscreen-modal"
    >
      <IonContent className="ion-text-center ion-align-items-center">
        <IonButton
          fill="clear"
          onClick={() => setShowImageModal(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
          }}
        >
          <IonIcon icon={close} size="large" color="light" />
        </IonButton>

        {/* Imagen con zoom
        <PinchZoomPan>
          <img src....
        </PinchZoomPan>
        */}

        <img
          src={otherUser.photo ? baseURL + otherUser.photo : Avatar}
          alt="Foto de ¨Perfil"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "#000",
          }}
        />
      </IonContent>
    </IonModal>
  );
};
