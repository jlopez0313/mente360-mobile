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
  setPodcast
} from "@/store/slices/homeSlice";

import { SuccessOverlay } from "@/components/Shared/Animations/Success/SuccessOverlay";
import { diferenciaEnDias } from "@/helpers/Fechas";
import { DB, localDB } from "@/helpers/localStore";
import { db } from "@/hooks/useDexie";
import { setUser } from "@/store/slices/userSlice";
import { getHomeThunk } from "@/store/thunks/home";
import { useLiveQuery } from "dexie-react-hooks";

export const Home = () => {
  const { getPreference, setPreference, keys } = usePreferences();
  const audio = useLiveQuery( ( ) => db.audios.toCollection().first() );
  const tarea = useLiveQuery( ( ) => db.tareas.toCollection().first() );
  const mensaje = useLiveQuery( ( ) => db.mensajes.toCollection().first() );

  const { podcast } = useSelector(
    (state: any) => state.home
  );

  const localHome = localDB(DB.HOME);
  const localData = localHome.get();

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

          await dispatch(getHomeThunk());
        } else {
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
      onGetHome();
    }
  }, []);

  useEffect(() => {
    if (
      audio?.done == 1 &&
      mensaje?.done == 1 &&
      tarea?.done == 1 &&
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
