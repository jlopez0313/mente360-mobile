import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonChip,
  IonIcon,
  IonText,
  IonToggle,
  ToggleCustomEvent,
} from "@ionic/react";

import styles from "./Recordatorios.module.scss";
import { useEffect, useState } from "react";
import { calendarOutline, timeOutline, trashOutline } from "ionicons/icons";
import { toggle } from "@/services/alarmas";
import { remove } from "@/services/alarmas";

export const Card: React.FC<any> = ({
  notificacion,
  aferRemove
}) => {

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
    setChecked(notificacion.active == '1'  ?true : false)

    const date = new Date( notificacion.scheduled_time );
    setHour( `${date.getHours()}:${date.getMinutes()}` );
    /*
    const days = daysOfWeek.map((day, index) => ({
      ...day,
      selected: notificacion.on.weekdays.includes(index),
    }));

    setDays(days.filter((day) => day.selected).map((item) => item.day));
    */
  };


  const onRemoveReminder = async () => {
    await remove( notificacion.id ) ;
    await aferRemove();
  }

  const toggleChange = async(ev: ToggleCustomEvent) => {
    await toggle( notificacion.id, { activo: ev.detail.checked } )
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
              color='warning'
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
