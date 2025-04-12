import {
  IonButton,
  IonCol,
  IonRow,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";

import { useEffect, useState } from "react";

import { getUser, setUser } from "@/helpers/onboarding";
import { update } from "@/services/user";
import { FCM } from "@capacitor-community/fcm";
import { useHistory } from "react-router";

import { Modal } from "@/components/Shared/Modal/Modal";
import { Texto } from "./Texto/Texto";

import { setRoute } from "@/store/slices/routeSlice";
import { useDispatch } from "react-redux";
import { Acordeon } from "./Acordeon/Acordeon";
import { Calendar } from "./Calendar/Calendar";

import { useNetwork } from "@/hooks/useNetwork";
import { usePreferences } from "@/hooks/usePreferences";
import { getHome } from "@/services/home";
import { setAudio, setMensaje, setTarea } from "@/store/slices/homeSlice";

import { useDB } from "@/context/Context";
import AudiosDB from "@/database/audios";
import MensajesDB from "@/database/mensajes";
import TareasDB from "@/database/tareas";
import { diferenciaEnDias } from "@/helpers/Fechas";

export const Home = () => {
  const { getPreference, setPreference, keys } = usePreferences();

  const { sqlite } = useDB();
  const network = useNetwork();

  const user = getUser();

  const history = useHistory();

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const onGetHome = async () => {
    try {
      const audiosDB = new AudiosDB(sqlite.db);
      const mensajesDB = new MensajesDB(sqlite.db);
      const tareasDB = new TareasDB(sqlite.db);

      if (user.user.eneatipo) {
        const lastDateStr =
          (await getPreference(keys.HOME_SYNC_KEY)) ?? "2024-01-01T05:00:00Z";

        const lastDate = new Date(lastDateStr);
        const now = new Date();

        if (diferenciaEnDias(now, lastDate) > 0) {
          await setPreference(keys.HOME_SYNC_KEY, now.toISOString());

          present({
            message: "Cargando ...",
          });

          const { data } = await getHome({});

          await audiosDB.remove(sqlite.performSQLAction, () => {});
          await audiosDB.create(sqlite.performSQLAction, () => {}, [
            data.audio,
          ]);

          await mensajesDB.remove(sqlite.performSQLAction, () => {});
          await mensajesDB.create(sqlite.performSQLAction, () => {}, [
            data.mensaje,
          ]);

          await tareasDB.remove(sqlite.performSQLAction, () => {});
          await tareasDB.create(sqlite.performSQLAction, () => {}, [
            data.tarea,
          ]);

          dispatch(setAudio(data.audio));
          dispatch(setMensaje(data.mensaje));
          dispatch(setTarea(data.tarea));
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
    dispatch(setRoute("/home"));

    onCheckEneatipo();

    if (network.status) {
      onUpdateFCM();
      onGetHome();
    }
  }, [sqlite.initialized]);

  return (
    <>
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
