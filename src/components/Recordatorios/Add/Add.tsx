import { create } from "@/services/alarmas";
import {
  IonItemDivider,
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
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./Add.module.scss";

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

    const dataNotification = {
      title: titulo,
      days: selectedIndexes.map((i: number) => i - 1),
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

      <IonItemDivider className="line-divider"></IonItemDivider>

      <IonItem lines="none" className={styles.section}>
        <IonIcon icon={timeOutline} slot="start" />
        <IonLabel className="ion-text-justify">Hora</IonLabel>
      </IonItem>

      <IonItem mode="md" lines="none" className={styles["picker"]}>
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

        <IonPicker className={styles.picker}>
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
      <br></br>
      <IonItemDivider className="line-divider"></IonItemDivider>

      <IonItem lines="none" className={styles.section}>
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
                className={day.selected ? styles.dayselected : ""}
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
          <IonCol class="ion-no-padding">

            <IonButton
              shape="round"
              expand="block"
              onClick={onCreate}
              disabled={!titulo || !days.some((x: any) => x.selected)}
            >
              Guardar
            </IonButton>
            <br></br>
            <Link to="/recordatorios" replace={true}>
              <IonButton fill="outline" className="yellow-outline-button" shape="round" expand="block">Cancelar</IonButton>
            </Link>

          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};
