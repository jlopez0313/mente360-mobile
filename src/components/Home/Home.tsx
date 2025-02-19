import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";

import styles from "./Home.module.scss";
import { Card } from "./Card";
import { Modal } from "@/components/Modal/Modal";
import { Texto } from "./Texto/Texto";
import { Audio } from "./Audio/Audio";
import { useEffect, useState } from "react";
import {
  getHome,
  confirmAudio,
  confirmMensaje,
  confirmTarea,
} from "@/services/home";
import { localDB } from "@/helpers/localStore";

import { useContext } from "react";
import UIContext from "@/context/Context";

import { FCM } from "@capacitor-community/fcm";
import { getUser, setUser } from "@/helpers/onboarding";
import { update } from "@/services/user";
import calendario from "/assets/icons/calendario.svg";
import auriculares from "/assets/icons/auriculares.svg";
import tarea from "/assets/icons/tarea.svg";
import mensaje from "/assets/icons/mensaje.svg";
import { useHistory } from "react-router";

import { useDispatch } from "react-redux";
import { setRoute } from "@/store/slices/routeSlice";
import { shareSocial, shareSocialOutline } from "ionicons/icons";
import { LocalNotifications } from "@capacitor/local-notifications";

export const Home = () => {
  const user = getUser();
  const history = useHistory();

  const dispatch = useDispatch();

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const localHome = localDB("home");

  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState<any>({ mensaje: {}, tarea: {}, audio: {} });
  const [dateEnd, setDateEnd] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const fechaHoy = new Date();
  const today = fechaHoy.getDay();

  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"];

  const onToggleShow = () => {
    setShow(!show);
  };

  setTimeout(() => {
    setCurrentDate(new Date().toLocaleString());
  }, 1000);

  const onGetHome = async () => {
    try {
      if (user.user.eneatipo) {
        const localData = localHome.get();

        if (!localData.data || new Date(localData.endTime) < new Date()) {
          present({
            message: "Cargando ...",
          });

          const { data: info } = await getHome({});

          const endTime = new Date();
          endTime.setHours(23, 59, 59, 0o0);
          setDateEnd(endTime.toLocaleString());

          localHome.set({ data: info, endTime });
          setData(info);
        } else {
          setData({ ...localData.data });
          const endTime = new Date(localData.endTime);
          setDateEnd(endTime.toLocaleString());
        }
      }
    } catch (error: any) {
      console.log(error);

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
      /*
      const formData = {
        audios_id: data.audio.id,
      };

      await confirmAudio(formData);
*/
      data.audio.done = true;
      setData({ ...data });

      const localData = localHome.get();
      localHome.set({ ...localData, data: { ...data } });
    } catch (error: any) {
      console.error(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message:
          error.data?.message ||
          "Tu audio ha finalizado. Cuando estés listo, presiona 'Finalizar'.",
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
      /*
      const formData = {
        mensajes_id: data.mensaje.id,
      };

      await confirmMensaje(formData);
*/
      data.mensaje.done = true;

      setData({ ...data });

      const localData = localHome.get();
      localHome.set({ ...localData, data: { ...data } });
    } catch (error: any) {
      console.log(error);

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
      console.log(error);

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

  const onUpdateFCM = async () => {
    try {
      // Obtener el token FCM del dispositivo
      const token = await FCM.getToken();
      console.log("FCM Token:", token.token);
      console.log("USER:", user);

      const formData = {
        fcm_token: token.token,
      };

      const { data } = await update(formData, user.user.id);
      setUser({ ...user, user: data.data });
    } catch (error: any) {
      console.log(error);
    }
  };

  const onCheckEneatipo = () => {
    if (!user.user.eneatipo) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    onGetHome();
  }, [currentDate]);

  useEffect(() => {
    dispatch(setRoute("/home"));

    onCheckEneatipo();
    onUpdateFCM();
  }, []);

  return (
    <>
      <IonCard
        className={`ion-no-margin ion-no-padding ${styles["card-calendar"]}`}
      >
        <IonCardContent>
          <div className={styles.header}>
            <div>
              <img src={calendario} style={{ width: "14px", height: "14px" }} />
              <IonLabel>
                <strong> &nbsp; {currentDate} </strong>
              </IonLabel>
            </div>
            <IonLabel>
              <strong>
                {" "}
                {/* CALENDARIO */} {/* dateEnd */}{" "}
              </strong>
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
          icon={tarea}
          title="Tarea de la semana"
          done={data.tarea?.done || false}
        />

        <Card
          buttonID="modal-comentario"
          buttonTitle="Ver"
          icon={mensaje}
          title="Mensaje del día"
          done={data.mensaje?.done || false}
        />

        <Card
          buttonID="modal-auricular"
          buttonTitle="Escuchar"
          icon={auriculares}
          title="Audio de la noche"
          done={data.audio?.done || false}
        />
      </div>

      <Modal
        trigger="modal-tarea"
        title="Tarea de la semana"
        hideButtons={data.tarea?.done || false}
        onConfirm={() => onConfirmTarea()}
      >
        <Texto descripcion={data.tarea?.tarea || ""} children={null} />
      </Modal>

      <Modal
        trigger="modal-comentario"
        title="Mensaje del día"
        hideButtons={data.mensaje?.done || false}
        onConfirm={() => onConfirmMensaje()}
      >
        <Texto descripcion={data.mensaje?.mensaje || ""}>
          <img
            src="assets/images/logo_texto.png"
            style={{ width: "90px", display: "block", margin: "10px auto" }}
          />
          <IonIcon
            icon={shareSocialOutline}
            style={{
              fontSize: "2rem",
              width: "90px",
              display: "block",
              margin: "15px auto",
            }}
            onClick={() => {
              history.replace("/share");
            }}
          />
        </Texto>
      </Modal>

      <Modal
        trigger="modal-auricular"
        title="Audio de la noche"
        hideButtons={data.audio?.done || false}
        onConfirm={() => onConfirmAudio()}
      >
        <Audio audio={data.audio} onConfirm={() => onConfirmAudio()} />
      </Modal>

      <Modal
        isOpen={isOpen}
        showButtons={false}
        canDismiss={false}
        title="¿Aún no conoces tu eneatipo?"
        hideButtons={data.mensaje?.done || false}
        onConfirm={() => onConfirmMensaje()}
      >
        <Texto descripcion="Completa nuestro test y descúbrelo. ¡Es el primer paso para entenderte mejor!">
          <IonRow>
            <IonCol size="6">
              <IonButton
                onClick={() => {
                  history.replace("/perfil");
                }}
                style={{ width: "100%" }}
              >
                Sí lo conozco
              </IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton
                onClick={() => {
                  history.replace("/test");
                }}
                style={{ width: "100%" }}
              >
                Quiero descubrirlo
              </IonButton>
            </IonCol>
          </IonRow>

          <img
            src="assets/images/logo_texto.png"
            style={{ width: "150px", display: "block", margin: "40px auto" }}
          />
        </Texto>
      </Modal>
    </>
  );
};
