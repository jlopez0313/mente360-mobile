import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonText,
} from "@ionic/react";
import { checkbox, checkboxOutline } from "ionicons/icons";
import styles from "./Home.module.scss";
import { memo } from "react";

interface Props {
  done: boolean,
  title: string;
  icon: string;
  buttonID: string;
  buttonTitle: string;
}

export const Card: React.FC<Props> = memo(
  ({
    done,
    title,
    icon,
    buttonID,
    buttonTitle,
  }) => {
    return (
      <>
        <IonCard
          className={`ion-no-padding ion-text-center ${styles["card-main"]}`}
        >
          <IonCardHeader className="ion-no-padding">
            <IonCardContent>
              <img src={icon} slot="start" className="ion-no-margin" />
              <strong> {title} </strong>
              {
                done ?
                <IonIcon icon={checkbox} slot="end" /> : 
                <IonText></IonText>
              }
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
  }
)
