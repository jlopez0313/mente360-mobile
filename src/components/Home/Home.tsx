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
  useIonAlert,
  useIonLoading,
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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getHome,
  confirmAudio,
  confirmMensaje,
  confirmTarea,
} from "@/services/home";
import { localDB } from "@/helpers/localStore";

import { useContext } from "react";
import UIContext from "@/context/Context";
import { Toast } from "@/components/Toast/Toast";

export const Home = () => {
  
  const { globalAudio }: any = useContext(UIContext);

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const localHome = localDB("home");
  
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>({ mensaje: {}, tarea: {}, audio: {} });
  const [dateEnd, setDateEnd] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  const fechaHoy = new Date();
  const today = fechaHoy.getDay();

  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"];

  const onToggleShow = () => {
    setShow(!show);
  };

  setTimeout(() => { 
    setCurrentDate( new Date().toLocaleString() )
  }, 1000);
  
  const onGetHome = async () => {
    try {
      const localData = localHome.get();

      if (!localData.data || new Date(localData.endTime) < new Date()) {
        present({
          message: "Cargando ...",
        });

        const { data: info } = await getHome({});

        const endTime = new Date();
        endTime.setHours(23, 59, 59, 0o0);
        setDateEnd( endTime.toLocaleString() )

        localHome.set({ data: info, endTime });
        setData(info);
      } else {
        setData({ ...localData.data });
        const endTime = new Date( localData.endTime ); 
        setDateEnd( endTime.toLocaleString() )
      }
    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const onConfirmAudio = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const formData = {
        audios_id: data.audio.id,
      };

      await confirmAudio(formData);

      data.audio.done = true;
      setData({ ...data });

      const localData = localHome.get();
      localHome.set({ ...localData, data: { ...data } });
    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const onConfirmMensaje = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const formData = {
        mensajes_id: data.mensaje.id,
      };

      await confirmMensaje(formData);

      data.mensaje.done = true;

      setData({ ...data });

      const localData = localHome.get();
      localHome.set({ ...localData, data: { ...data } });
    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const onConfirmTarea = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const formData = {
        tareas_id: data.tarea.id,
      };

      await confirmTarea(formData);

      data.tarea.done = true;
      setData({ ...data });

      const localData = localHome.get();
      localHome.set({ ...localData, data: { ...data } });
    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  useEffect(() => {
    onGetHome();
  }, [currentDate]);

  return (
    <>
      <IonCard
        className={`ion-no-margin ion-no-padding ${styles["card-calendar"]}`}
      >
        <IonCardContent>
          <div className={styles.header}>
            <div>
              <img src="assets/images/calendario.png" />
              <IonLabel>
                <strong> &nbsp; { currentDate } </strong>
              </IonLabel>
            </div>
            <IonLabel>
              <strong> {/* CALENDARIO */} {dateEnd} </strong>
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
          done={data.tarea?.done || false}
        />

        <Card
          buttonID="modal-comentario"
          buttonTitle="Ver"
          icon="assets/images/comentario.png"
          title="Mensaje del día"
          done={data.mensaje?.done || false}
        />

        <Card
          buttonID="modal-auricular"
          buttonTitle="Escuchar"
          icon="assets/images/auricular.png"
          title="Audio de la noche"
          done={data.audio?.done || false}
        />
      </div>

      <Modal
        trigger="modal-tarea"
        title="Tarea del día"
        hideButtons={data.tarea?.done || false}
        onConfirm={() => onConfirmTarea()}
      >
        <Texto descripcion={data.tarea?.tarea || ''} />
      </Modal>

      <Modal
        trigger="modal-comentario"
        title="Mensaje del día"
        hideButtons={data.mensaje?.done || false}
        onConfirm={() => onConfirmMensaje()}
      >
        <Texto descripcion={data.mensaje?.mensaje || ''} />
      </Modal>

      <Modal
        trigger="modal-auricular"
        title="Audio de la noche"
        hideButtons={data.audio?.done || false}
        onConfirm={() => onConfirmAudio()}
      >
        <Audio audio={data.audio} onConfirm={() => onConfirmAudio()} />
      </Modal>

      {/*
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
      */}

    </>
  );
};
