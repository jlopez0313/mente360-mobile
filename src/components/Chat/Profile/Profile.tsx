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
import styles from "./Profile.module.scss";
import Avatar from "@/assets/images/avatar.jpg";
import { find } from "@/services/user";
import { Photo } from "./Photo/Photo";

// import PinchZoomPan from "react-pinch-zoom-pan";

export const Profile: React.FC<any> = ({
  userID,
  showProfileModal,
  setShowProfileModal,
}) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [edad, setEdad] = useState(0);
  const [otherUser, setOtherUser] = useState({
    id: null,
    name: "",
    photo: null,
    email: "",
    edad: "",
    eneatipo: "",
    genero: "",
    fecha_nacimiento: "",
  });

  const modalRef = useRef<HTMLIonModalElement>(null);

  const onGetEdad = () => {
    if (!otherUser.fecha_nacimiento) {
      setEdad(0);
      return;
    }

    const date = new Date(otherUser.fecha_nacimiento);
    const today = new Date();

    const diffInMs = today - date;

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    setEdad(Math.floor(diffInDays / 365.25));
  };

  const onFindUser = async () => {
    try {
      const {
        data: { data },
      } = await find(userID);
      console.log(data);

      setOtherUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    onFindUser();
  }, []);

  useEffect(() => {
    onGetEdad();
  }, [otherUser]);

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
            src={otherUser.photo ? baseURL + otherUser.photo : Avatar}
            style={{ display: "none" }}
            onLoad={() => setIsLoading(false)}
          />

          <div
            className={`ion-margin-top ${styles["profile-image"]}`}
            style={{
              display: isLoading ? "none" : "block",
              background: `url(
                ${otherUser.photo ? baseURL + otherUser.photo : Avatar}
              )  50% 50% / cover`,
            }}
            onClick={() => setShowImageModal(true)}
          ></div>

          <IonLabel>{otherUser.name}</IonLabel>

          <div className={`ion-margin-top ion-margin-bottom ${styles.profile}`}>
            <div className={styles.info}>
              <IonChip outline={true}>{edad || "00"}</IonChip>
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
                {otherUser.eneatipo || "-"}
              </IonChip>
              <IonNote>
                {" "}
                <strong> Eneatipo </strong>{" "}
              </IonNote>
            </div>
            <div className={styles.info}>
              <IonChip outline={true}>{otherUser.genero || "--"}</IonChip>
              <IonNote>
                {" "}
                <strong> Género </strong>{" "}
              </IonNote>
            </div>
          </div>
        </IonContent>
      </IonModal>

      <Photo otherUser={otherUser} showImageModal={showImageModal} setShowImageModal={setShowImageModal} />

    </>
  );
};
