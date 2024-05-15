import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
} from "@ionic/react";
import { checkboxOutline } from "ionicons/icons";
import styles from "./Home.module.scss";

interface Props {
  title: string;
  icon: string;
  buttonID: string;
  buttonTitle: string;
}

export const Card: React.FC<Props> = ({ title, icon, buttonID, buttonTitle }) => {
  return (
    <>
      <IonCard
        className={`ion-no-padding ion-text-center ${styles["card-main"]}`}
      >
        <IonCardHeader className="ion-no-padding">
          <IonCardContent>
            <img src={icon} slot="start" />
            <strong> {title} </strong>
            <IonIcon icon={checkboxOutline} slot="end" />
          </IonCardContent>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            type="button"
            className="ion-margin-top ion-padding-start ion-padding-end"
            id={buttonID}
            shape="round"
          >
            {buttonTitle}
          </IonButton>
        </IonCardContent>
      </IonCard>

    </>
  );
};
