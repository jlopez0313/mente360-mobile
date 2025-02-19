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
  peopleOutline,
  readerOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { localDB } from "@/helpers/localStore";

export const Popover = ({ trigger = "" }) => {
  const localHome = localDB("home");
  const localData = localHome.get();

  const [data, setData] = useState<any>({});

  useEffect(() => {
    setData({ ...localData.data });
  }, []);

  return (
    <IonPopover trigger={trigger} dismissOnSelect={true}>
      <IonContent class="ion-no-padding">
        <IonList lines="full" class="ion-no-padding">
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
          {data.admin && (
            <IonItem
              button={true}
              detail={true}
              onClick={() => {
                window.open("https://www.google.com", "_system");
              }}
            >
              <IonIcon slot="start" icon={peopleOutline}></IonIcon>
              Contacta con {data.admin.name}
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPopover>
  );
};
