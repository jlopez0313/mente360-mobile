import {
  IonButton,
  IonCol,
  IonRow,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";

import { useEffect, useState } from "react";

import { update } from "@/services/user";
import { FCM } from "@capacitor-community/fcm";
import { useHistory } from "react-router";

import { Modal } from "@/components/Shared/Modal/Modal";
import { Texto } from "./Texto/Texto";

import { setRoute } from "@/store/slices/routeSlice";
import { useDispatch, useSelector } from "react-redux";
import { Acordeon } from "./Acordeon/Acordeon";
import { Calendar } from "./Calendar/Calendar";

import { useNetwork } from "@/hooks/useNetwork";
import { usePreferences } from "@/hooks/usePreferences";
import {
  setAdmin,
  setAudio,
  setMensaje,
  setPodcast,
  setTarea,
} from "@/store/slices/homeSlice";

import { SuccessOverlay } from "@/components/Shared/Animations/Success/SuccessOverlay";
import { useDB } from "@/context/Context";
import AudiosDB from "@/database/audios";
import MensajesDB from "@/database/mensajes";
import TareasDB from "@/database/tareas";
import { diferenciaEnDias } from "@/helpers/Fechas";
import { DB, localDB } from "@/helpers/localStore";
import { setUser } from "@/store/slices/userSlice";
import { getHomeThunk } from "@/store/thunks/home";

export const Home = () => {
  const { getPreference, setPreference, keys } = usePreferences();

  const { audio, mensaje, tarea, podcast } = useSelector(
    (state: any) => state.home
  );

  const localHome = localDB(DB.HOME);
  const localData = localHome.get();

  const { sqlite } = useDB();
  const network = useNetwork();

  const { user } = useSelector((state: any) => state.user);

  const history = useHistory();
  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const onGetHome = async () => {
    try {
      const audiosDB = new AudiosDB(sqlite.db);
      const mensajesDB = new MensajesDB(sqlite.db);
      const tareasDB = new TareasDB(sqlite.db);

      if (user.eneatipo) {
        const lastDateStr =
          (await getPreference(keys.HOME_SYNC_KEY)) ?? "2024-01-01T00:00:00Z";

        const lastDate = new Date(lastDateStr);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (diferenciaEnDias(now, lastDate) > 0) {
          await setPreference(keys.HOME_SYNC_KEY, now.toISOString());

          present({
            message: "Cargando ...",
          });

          await dispatch(getHomeThunk(sqlite, audiosDB, mensajesDB, tareasDB));
        } else {
          await audiosDB.all(sqlite.performSQLAction, (data: any) => {
            if (data?.length) dispatch(setAudio(data[0]));
          });
          await mensajesDB.all(sqlite.performSQLAction, (data: any) => {
            if (data?.length) dispatch(setMensaje(data[0]));
          });
          await tareasDB.all(sqlite.performSQLAction, (data: any) => {
            if (data?.length) dispatch(setTarea(data[0]));
          });

          dispatch(setPodcast(localData.podcast));
          dispatch(setAdmin(localData.admin));
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

  const onUpdateFCM = async () => {
    try {
      // Obtener el token FCM del dispositivo
      const token = await FCM.getToken();
      console.log("FCM Token:", token.token);
      console.log("USER:", user);

      const formData = {
        fcm_token: token.token,
      };

      const { data } = await update(formData, user.id);

      dispatch(setUser(data.data));
    } catch (error: any) {
      console.log(error);
    }
  };

  const onCheckEneatipo = () => {
    if (!user.eneatipo) {
      setIsOpen(true);
    }
  };

  const onCompleteAll = () => {
    setShowSuccess(true);

    localHome.set({ ...localData, showSuccess: true });

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  useEffect(() => {
    dispatch(setRoute("/home"));

    onCheckEneatipo();

    if (network.status) {
      onUpdateFCM();
      sqlite.initialized && onGetHome();
    }
  }, [sqlite.initialized]);

  useEffect(() => {
    if (
      audio.done &&
      mensaje.done &&
      tarea.done &&
      podcast.done &&
      !localData.showSuccess
    ) {
      onCompleteAll();
    }
  }, [audio, mensaje, tarea, podcast]);

  return (
    <>
      <SuccessOverlay show={showSuccess} />

      <Calendar />
      <Acordeon />

      <Modal
        isOpen={isOpen}
        showButtons={false}
        canDismiss={false}
        title="¿Aún no conoces tu eneatipo?"
        hideButtons={false}
        onConfirm={() => {}}
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
