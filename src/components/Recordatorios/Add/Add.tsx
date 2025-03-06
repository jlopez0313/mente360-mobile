import {
  IonButton,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonRow,
} from "@ionic/react";
import { repeatOutline, timeOutline } from "ionicons/icons";
import styles from "./Add.module.scss";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { create } from "@/services/alarmas";

export const Add = () => {
  const history = useHistory();

  const daysOfWeek = [
    { day: "D", selected: false },
    { day: "L", selected: false },
    { day: "M", selected: false },
    { day: "M", selected: false },
    { day: "J", selected: false },
    { day: "V", selected: false },
    { day: "S", selected: false },
  ];

  const [titulo, setTitulo] = useState<any>("");
  const [hora, setHora] = useState<any>(12);
  const [mins, setMins] = useState<any>(30);
  const [days, setDays] = useState<any[]>(daysOfWeek);

  const onToggleDay = (idx: number) => {
    const tmpDays = [...days];
    tmpDays[idx].selected = !tmpDays[idx].selected;

    setDays(tmpDays);
  };

  const onCreate = async () => {
    const selectedIndexes = days.reduce((newArray, item, index) => {
      if (item.selected) newArray.push(index + 1);
      return newArray;
    }, []);

    const notifications = selectedIndexes.map((day: any, index: number) => ({
      id: Math.floor(Date.now() % 1000000) + index,
      title: titulo,
      body: "Es hora de tu recordatorio!",
      smallIcon: "icon.png",
      schedule: {
        repeats: true,
        on: {
          weekday: day,
          hour: hora,
          minute: mins,
        },
      },
    }));

    const savedNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]"
    );

    const save = await LocalNotifications.schedule({ notifications });
    console.log(save);

    const dataNotification = {
      id: save.notifications,
      title: titulo,
      days: days.reduce((indices, day, index) => {
        if (day.selected) indices.push(index);
        return indices;
      }, []),
      hora: hora < 10 ? `0${hora}` : `${hora}`,
      min: mins < 10 ? `0${mins}` : `${mins}`,
    };

    await create(dataNotification);

    history.replace("/recordatorios");
  };

  return (
    <>
      <IonInput
        id="open_cal"
        labelPlacement="stacked"
        fill="outline"
        value={titulo}
        placeholder="Título del Recordatorio"
        className={`ion-margin-bottom`}
        onIonInput={(e) => setTitulo(e.target.value)}
      ></IonInput>

      <IonItem lines="none">
        <IonIcon icon={timeOutline} slot="start" />
        <IonLabel className="ion-text-justify">Hora</IonLabel>
      </IonItem>

      <IonItem lines="none" className={styles["picker"]}>
        <IonPicker>
          <IonPickerColumn
            value={hora}
            onIonChange={({ detail }) => setHora(detail.value)}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <IonPickerColumnOption key={i} value={i}>
                {i < 10 ? `0${i}` : `${i}`}
              </IonPickerColumnOption>
            ))}
          </IonPickerColumn>
        </IonPicker>

        <IonPicker>
          <IonPickerColumn
            value={mins}
            onIonChange={({ detail }) => setMins(detail.value)}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <IonPickerColumnOption key={i} value={i}>
                {i < 10 ? `0${i}` : `${i}`}
              </IonPickerColumnOption>
            ))}
          </IonPickerColumn>
        </IonPicker>
      </IonItem>

      <IonItem lines="none">
        <IonIcon icon={repeatOutline} slot="start" />
        <IonLabel className="ion-text-justify">Repetir</IonLabel>
      </IonItem>

      <IonItem lines="none" className="ion-margin-bottom">
        <div className={styles.days}>
          {days.map((day: any, key: number) => {
            return (
              <IonChip
                key={key}
                outline={true}
                className={day.selected ? styles["day-selected"] : ""}
                onClick={() => onToggleDay(key)}
              >
                {day.day}
              </IonChip>
            );
          })}
        </div>
      </IonItem>

      <IonGrid className="ion-padding-top">
        <IonRow>
          <IonCol size="6" class="ion-no-padding">
            <Link to="/recordatorios" replace={true}>
              <IonButton expand="block">Cancelar</IonButton>
            </Link>
          </IonCol>
          <IonCol size="6" class="ion-no-padding">
            <IonButton
              expand="block"
              onClick={onCreate}
              disabled={!titulo || !days.some((x: any) => x.selected)}
            >
              Guardar
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};
