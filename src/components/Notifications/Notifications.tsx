import {
  IonItemGroup,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton
} from "@ionic/react";
import styles from "./Notifications.module.scss";

import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { setGeneral } from "@/store/slices/notificationSlice";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Notifications = () => {
  const dispatch = useDispatch();
  const { notificaciones } = useSelector((state: any) => state.notifications);

  const [segment, setSegment] = useState<string>("hoy");
  const [todayNotifications, setTodayNotifications] = useState([]);
  const [otherNotifications, setOtherNotifications] = useState([]);

  const onPrepareLista = () => {
    const today = dayjs().startOf("day");

    const todayList = notificaciones.filter((notificacion: any) =>
      dayjs(notificacion.created_at).isSame(today, "day")
    );

    const otherList = notificaciones.filter(
      (notificacion: any) =>
        !dayjs(notificacion.created_at).isSame(today, "day")
    );

    setTodayNotifications(todayList);
    setOtherNotifications(otherList);
  };

  useEffect(() => {
    dispatch(setShowGlobalAudio(false));
    dispatch(setGeneral(false));
  }, []);

  useEffect(() => {
    onPrepareLista();
  }, [notificaciones]);

  return (
    <div className={`ion-padding ${styles["ion-content"]}`}>
      <IonSegment
        className={`${styles["ion-segment"]}`}
        value={segment}
        mode="ios"
        onIonChange={(e) => setSegment(e.detail.value!.toString())}
      >
        <IonSegmentButton value="hoy" className={styles["ion-segment-button"]}>
          <div className="flex items-center gap-2">
            {segment == "hoy" && (
              <span className="material-symbols-outlined">check</span>
            )}
            <IonLabel>Hoy</IonLabel>
          </div>
        </IonSegmentButton>
        <IonSegmentButton
          value="anteriores"
          className={styles["ion-segment-button"]}
        >
          <div className="flex items-center gap-2">
            {segment == "anteriores" && (
              <span className="material-symbols-outlined">check</span>
            )}
            <IonLabel>Anteriores</IonLabel>
          </div>
        </IonSegmentButton>
      </IonSegment>

      {segment == "hoy" && (
        <IonList className="ion-margin-top">
          <IonItemGroup>
            {todayNotifications.map((item, idx) => {
              return <Item item={item} key={idx} />;
            })}
          </IonItemGroup>
        </IonList>
      )}

      {segment == "anteriores" && (
        <IonList className="ion-margin-top">
          <IonItemGroup>
            {otherNotifications.map((item, idx) => {
              return <Item item={item} key={idx} />;
            })}
          </IonItemGroup>
        </IonList>
      )}
    </div>
  );
};
