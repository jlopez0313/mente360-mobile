import { setCurrentDay } from "@/store/slices/homeSlice";
import {
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { timeOutline } from "ionicons/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Calendar.module.scss";

export const Calendar: React.FC<any> = () => {
  
  const dispatch = useDispatch();

  const fechaHoy = new Date();
  const today = fechaHoy.getDay();

  const {currentDay} = useSelector((state: any) => state.home);

  const daysOfWeek = ["D", "L", "M", "M", "J", "V", "S"];

  useEffect(() => {
    const daysLeft = 8 - new Date().getDay()
    dispatch(setCurrentDay( daysLeft ));
  }, [])

  return (
    <IonCard
      className={`ion-no-margin ion-no-padding ${styles["card-calendar"]}`}
    >
      <IonCardContent>
        <div className={`ion-text-center ${styles.header}`}>
            <IonIcon icon={timeOutline} />
            <IonLabel>
              <strong> {currentDay} días para finalizar tu tarea </strong>
            </IonLabel>
        </div>
        <div className={styles.daysOfWeek}>
          {daysOfWeek.map((day, key) => {
            return (
              <IonChip
                key={key}
                outline={true}
                className={today != key ? "" : styles.today}
              >
                {day}
              </IonChip>
            );
          })}
        </div>
      </IonCardContent>
    </IonCard>
  );
};
