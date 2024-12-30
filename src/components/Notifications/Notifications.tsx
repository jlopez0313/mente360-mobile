import {
  IonAvatar,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonText,
} from "@ionic/react";
import styles from "./Notifications.module.scss";

import UIContext from "@/context/Context";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGeneral } from "@/store/slices/notificationSlice";
import Logo from "@/assets/images/logo.png";
import dayjs from "dayjs";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";

export const Notifications = () => {
  const dispatch = useDispatch();
  const { notificaciones } = useSelector((state: any) => state.notifications);

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
    <div className={styles["ion-content"]}>
      <IonList className="ion-padding-start ion-padding-end">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Hoy</IonLabel>
          </IonItemDivider>
          {todayNotifications.map((item, idx) => {
            return (
              <IonItem lines="none" button={true} key={idx}>
                <IonAvatar aria-hidden="true" slot="start">
                  <img alt="" src={Logo} />
                </IonAvatar>
                <IonLabel>{item.notificacion}</IonLabel>
                <IonNote>
                  {new Date(item.created_at).toLocaleDateString()}
                </IonNote>
              </IonItem>
            );
          })}
        </IonItemGroup>
      </IonList>

      <IonList className="ion-padding-start ion-padding-end">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Anteriores</IonLabel>
          </IonItemDivider>
          {otherNotifications.map((item, idx) => {
            return (
              <IonItem
                lines="none"
                className={styles["notificacion"]}
                key={idx}
              >
                <IonAvatar aria-hidden="true" slot="start">
                  <img alt="" src={Logo} />
                </IonAvatar>
                <div>
                  <IonText className={styles["message"]}>
                    {item.notificacion}
                  </IonText>
                  <span className={styles["time"]}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </IonItem>
            );
          })}
        </IonItemGroup>
      </IonList>
    </div>
  );
};
