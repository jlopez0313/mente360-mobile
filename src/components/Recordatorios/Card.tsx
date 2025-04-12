import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonToggle,
  ToggleCustomEvent,
} from "@ionic/react";

import { remove, toggle } from "@/services/alarmas";
import { LocalNotifications } from "@capacitor/local-notifications";
import { timeOutline, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import styles from "./Recordatorios.module.scss";

export const Card: React.FC<any> = ({ notificacion, aferRemove }) => {
  const daysOfWeek = [
    { day: "Dom", selected: false },
    { day: "Lun", selected: false },
    { day: "Mar", selected: false },
    { day: "Mie", selected: false },
    { day: "Jue", selected: false },
    { day: "Vie", selected: false },
    { day: "Sab", selected: false },
  ];
  const [days, setDays] = useState<any[]>(daysOfWeek);
  const [hour, setHour] = useState<any>("12:30");
  const [checked, setChecked] = useState<any>(false);

  const onGetDays = () => {
    setChecked(notificacion.active == "1" ? true : false);

    const recordatorio = notificacion.recordatorios[0];
    const selectedDays = notificacion.recordatorios.map((r: any) => {
      return r.day;
    });

    const date = new Date(recordatorio?.scheduled_time);
    setHour(`${date.getHours()}:${date.getMinutes()}`);

    const days = daysOfWeek.map((day, index) => ({
      ...day,
      selected: selectedDays.includes(index),
    }));

    setDays(days.filter((day) => day.selected).map((item) => item.day));
  };

  const onRemoveReminder = async () => {
    notificacion.recordatorios.forEach(async (reminder: any) => {
      await LocalNotifications.cancel({
        notifications: [{ id: reminder.notification_id }],
      });

      console.log("Reminder canceled", reminder);
    });
    await remove(notificacion.id);
    await aferRemove();
  };

  const toggleChange = async (ev: ToggleCustomEvent) => {
    if (!ev.detail.checked) {
      notificacion.recordatorios.forEach(async (reminder: any) => {
        await LocalNotifications.cancel({
          notifications: [{ id: reminder.notification_id }],
        });

        console.log("Reminder canceled", reminder);
      });
    } else {
      notificacion.recordatorios.forEach(async (reminder: any) => {
        const date = new Date(reminder?.scheduled_time);

        const notifications = [
          {
            id: reminder.notification_id,
            title: notificacion.title,
            body: notificacion.body,
            smallIcon: "icon.png",
            schedule: {
              repeats: true,
              on: {
                weekday: reminder.day,
                hour: date.getHours(),
                minute: date.getMinutes(),
              },
            },
          },
        ];

        const save = await LocalNotifications.schedule({ notifications });
        console.log(save);
      });
    }
    await toggle(notificacion.id, { activo: ev.detail.checked });
  };

  useEffect(() => {
    onGetDays();
  }, []);

  return (
    <>
      <IonCard
        className={`ion-no-padding ion-text-center ${styles["card-main"]}`}
      >
        <IonCardContent>
          <div className={styles["div-card"]}>
            <h2 className={`ion-margin-bottom ${styles["title-card"]}`}>
              <IonIcon slot="start" icon={timeOutline}></IonIcon>
              {notificacion.title}
            </h2>
            <span className={styles["time"]}> {hour} </span>
            <div>
              <span> {days.join(", ")} </span>
            </div>
          </div>
          <div className={styles["div-icons"]}>
            <IonToggle
              color="warning"
              checked={checked}
              onIonChange={toggleChange}
            />
            <IonIcon
              icon={trashOutline}
              onClick={() => {
                onRemoveReminder();
              }}
            />
          </div>
        </IonCardContent>
      </IonCard>
    </>
  );
};
