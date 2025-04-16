import Avatar from "@/assets/images/avatar.jpg";
import { createGesture, Gesture } from "@ionic/core";
import {
  IonButton,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonNote,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { Photo } from "./Photo/Photo";
import styles from "./Profile.module.scss";

// import PinchZoomPan from "react-pinch-zoom-pan";

export const Profile: React.FC<any> = ({
  usuario,
  showProfileModal,
  setShowProfileModal,
}) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    if (showImageModal) {
      addSwipeToCloseGesture();
    }
  }, [showImageModal]);

  const addSwipeToCloseGesture = () => {
    if (!modalRef.current) return;

    const gesture: Gesture = createGesture({
      el: modalRef.current,
      gestureName: "swipe-to-close",
      direction: "y",
      threshold: 10,
      onMove: (detail) => {
        if (detail.deltaY > 50) {
          setShowImageModal(false);
        }
      },
    });

    gesture.enable(true);
  };

  return (
    <>
      {/* Modal de Perfil */}
      <IonModal
        isOpen={showProfileModal}
        breakpoints={[0, 0.5, 1]}
        initialBreakpoint={0.5}
        onDidDismiss={() => setShowProfileModal(false)}
      >
        <IonHeader>
          <IonToolbar className={styles["ion-header"]}>
            <IonTitle>
              Información de Usuario
            </IonTitle>
            <IonButton
              slot="end"
              fill="clear"
              onClick={() => setShowProfileModal(false)}
              style={{ '--background': 'none'}}
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent class={`${styles["content-modal"]} ${styles["ion-content"]}`}>
          {isLoading && (
            <IonSkeletonText
              animated
              className={`ion-margin-top ${styles["profile-image"]}`}
            />
          )}

          <img
            src={usuario.photo ? baseURL + usuario.photo : Avatar}
            style={{ display: "none" }}
            onLoad={() => setIsLoading(false)}
          />

          <div
            className={`ion-margin-top ${styles["profile-image"]}`}
            style={{
              display: isLoading ? "none" : "block",
              background: `url(
                ${usuario.photo ? baseURL + usuario.photo : Avatar}
              )  50% 50% / cover`,
            }}
            onClick={() => setShowImageModal(true)}
          ></div>

          <IonLabel>{usuario.name}</IonLabel>

          <div className={`ion-margin-top ion-margin-bottom ${styles.profile}`}>
            <div className={styles.info}>
              <IonChip outline={true}>{usuario.edad || "00"}</IonChip>
              <IonNote>
                {" "}
                <strong> Edad </strong>{" "}
              </IonNote>
            </div>
            <div className={styles.info}>
              <IonChip
                outline={true}
                className="ion-padding-start ion-padding-end"
              >
                {usuario.eneatipo || "-"}
              </IonChip>
              <IonNote>
                {" "}
                <strong> Eneatipo </strong>{" "}
              </IonNote>
            </div>
            <div className={styles.info}>
              <IonChip outline={true}>{usuario.genero || "--"}</IonChip>
              <IonNote>
                {" "}
                <strong> Género </strong>{" "}
              </IonNote>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <Photo photo={usuario.photo} showImageModal={showImageModal} setShowImageModal={setShowImageModal} />

    </>
  );
};
