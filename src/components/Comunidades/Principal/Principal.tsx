import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { setCurrentDay } from "@/store/slices/homeSlice";
import {
  IonAvatar,
  IonItem,
  IonList,
  IonRadio,
  IonRadioGroup,
  useIonToast,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";

import { downloadOutline } from "ionicons/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Principal.module.scss";

export const Principal = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { currentDay } = useSelector((state: any) => state.home);
  const { user } = useSelector((state: any) => state.user);
  const [present] = useIonToast();

  const network = useNetwork();
  const dispatch = useDispatch();

  const comunidades = useLiveQuery(
    () =>
      db.comunidades
        .where("id")
        .anyOf(user.suscripciones.map((s: any) => s.id))
        .toArray(),
    [user]
  );

  const compareWith = (a: any, b: any) => {
    return a == b;
  };

  const onSelectPrincipal = (value: number) => {
    localStorage.setItem("principal", value.toString());

    onPresentToast(
      "bottom",
      `Recuerda que tu próxima tarea será asignada en ${currentDay} días`,
      downloadOutline
    );
  };

  const onPresentToast = (
    position: "top" | "middle" | "bottom",
    message: string,
    icon: any
  ) => {
    present({
      message: message,
      duration: 2000,
      position: position,
      icon: icon,
    });
  };

  useEffect(() => {
    const daysLeft = 7 - new Date().getDay();
    dispatch(setCurrentDay(daysLeft));
  }, []);

  return (
    <div className={`ion-padding ${styles["ion-content"]}`}>
      <IonList lines="none">
        <IonRadioGroup
          value={localStorage.getItem("principal") ?? "1"}
          compareWith={compareWith}
          onIonChange={(event) => onSelectPrincipal(event.detail.value)}
        >
          {comunidades?.map((comunidad: any, idx: number) => {
            return (
              <IonItem key={idx} className="ion-margin-bottom">
                <IonRadio value={comunidad.id}>
                  <IonAvatar slot="start">
                    <img
                      alt={comunidad?.comunidad}
                      src={
                        network.status
                          ? baseURL + comunidad?.imagen
                          : AudioNoWifi
                      }
                    />
                  </IonAvatar>
                  <div className={styles["texto"]}>
                    <span className={styles["titulo"]}>
                      {" "}
                      {comunidad?.comunidad}{" "}
                    </span>
                    <span className={styles["subtitulo"]}>
                      {" "}
                      {comunidad?.lider?.name}{" "}
                    </span>
                  </div>
                </IonRadio>
              </IonItem>
            );
          })}
        </IonRadioGroup>
      </IonList>
    </div>
  );
};
