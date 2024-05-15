import {
  IonBackdrop,
  IonCard,
  IonCardContent,
  IonChip,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import {
  add,
  helpCircleOutline,
  logoWhatsapp,
  readerOutline,
} from "ionicons/icons";

import styles from "./Home.module.scss";
import { Card } from "./Card";
import { Modal } from "@/components/Modal/Modal";
import { Texto } from "./Texto/Texto";
import { Audio } from "./Audio/Audio";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {

    const [show, setShow] = useState(false)

  const fechaHoy = new Date();
  const today = fechaHoy.getDay();

  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"];

  const onToggleShow = () => {
    setShow( !show );
  }

  return (
    <>
        { show && 
            <IonBackdrop visible={true}></IonBackdrop>
        }

      <IonCard
        className={`ion-no-margin ion-no-padding ${styles["card-calendar"]}`}
      >
        <IonCardContent>
          <div className={styles.header}>
            <div>
              <img src="assets/images/calendario.png" />
              <IonLabel>
                <strong> &nbsp; {fechaHoy.toLocaleDateString()} </strong>
              </IonLabel>
            </div>
            <IonLabel>
              <strong> CALENDARIO </strong>
            </IonLabel>
          </div>
          <div className={styles.daysOfWeek}>
            {daysOfWeek.map((day, key) => {
              return (
                <IonChip
                  key={key}
                  outline={true}
                  className={today != key ? "" : styles.today}
                >
                  {day}
                </IonChip>
              );
            })}
          </div>
        </IonCardContent>
      </IonCard>

      <div className={styles.cards}>
        <Card
          buttonID="modal-tarea"
          buttonTitle="Ver"
          icon="assets/images/tarea.png"
          title="Tarea del día"
        />

        <Card
          buttonID="modal-comentario"
          buttonTitle="Ver"
          icon="assets/images/comentario.png"
          title="Mensaje del día"
        />

        <Card
          buttonID="modal-auricular"
          buttonTitle="Escuchar"
          icon="assets/images/auricular.png"
          title="Audio del día"
        />
      </div>

      <Modal trigger="modal-tarea" title="Tarea del día">
        <Texto />
      </Modal>

      <Modal trigger="modal-comentario" title="Mensaje del día">
        <Texto />
      </Modal>

      <Modal trigger="modal-auricular" title="Audio del día">
        <Audio />
      </Modal>

      <IonFab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        className={styles.fab}
      >
        <IonFabButton onClick={onToggleShow}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>

        <IonFabList side="top">
          <Link to=''>
            <IonFabButton>
              <IonIcon icon={helpCircleOutline}></IonIcon>
            </IonFabButton>
          </Link>
          <Link to=''>
            <IonFabButton>
              <IonIcon icon={logoWhatsapp}></IonIcon>
            </IonFabButton>
          </Link>
          <Link to='/test' onClick={() => setShow( false )}>
            <IonFabButton>
              <IonIcon icon={readerOutline}></IonIcon>
            </IonFabButton>
          </Link>
        </IonFabList>
      </IonFab>
    </>
  );
};
