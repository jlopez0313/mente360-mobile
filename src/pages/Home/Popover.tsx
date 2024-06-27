import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
} from "@ionic/react";
import {
  helpCircleOutline,
  logoWhatsapp,
  readerOutline,
} from "ionicons/icons";
import { Link } from "react-router-dom";

export const Popover = ({ trigger = "" }) => {

  return (
    <IonPopover trigger={trigger} dismissOnSelect={true}>
      <IonContent>
        <IonList lines="full">
          <Link to="/test" replace={true}>
            <IonItem button={true} detail={true}>
              <IonIcon slot="start" icon={readerOutline}></IonIcon>
              Realizar Test
            </IonItem>
          </Link>
          <IonItem button={true} detail={true} onClick={() => {}}>
            <IonIcon slot="start" icon={logoWhatsapp}></IonIcon>
            Escríbenos
          </IonItem>
          <IonItem button={true} detail={true} onClick={() => {}}>
            <IonIcon slot="start" icon={helpCircleOutline}></IonIcon>
            Ayuda
          </IonItem>
        </IonList>
      </IonContent>
    </IonPopover>
  );
};
