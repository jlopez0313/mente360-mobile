import Logo from "@/assets/images/logo.png";
import { IonAvatar, IonIcon, IonItem, IonText } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import { format } from "timeago.js";
import styles from './Notifications.module.scss';

export const Item = ({ item }: any) => {
  return (
    <IonItem lines="none" className={styles["notificacion"]}>
      <IonAvatar aria-hidden="true" slot="start">
        <img alt="" src={Logo} />
      </IonAvatar>
      <div>
        <span className={styles["time"]}>
          <IonIcon icon={calendarOutline} slot="start" />
          {format(item.created_at)}
        </span>
        <IonText className={styles["message"]}>{item.notificacion}</IonText>
      </div>
    </IonItem>
  );
};
