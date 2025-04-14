import { localDB } from "@/helpers/localStore";
import { openWhatsApp } from "@/helpers/Whatsapp";
import { useNetwork } from "@/hooks/useNetwork";
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
  timeOutline
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Popover = ({ trigger = "" }) => {
  const localHome = localDB("home");
  const localData = localHome.get();

  const network = useNetwork();

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

          <Link to="/recordatorios" replace={true}>
            <IonItem button={true} detail={true}>
              <IonIcon slot="start" icon={timeOutline}></IonIcon>
              Mis Recordatorios
            </IonItem>
          </Link>

          <IonItem
            disabled={!network.status}
            button={true}
            detail={true}
            onClick={() =>
              openWhatsApp(
                import.meta.env.VITE_WRITEUS_PHONE,
                `¡Hola! Vi que puedo escribirles por aquí desde ${
                  import.meta.env.VITE_WRITEUS_PHONE
                } . Tengo una consulta y me gustaría hablar con alguien del equipo. ¡Gracias!`
              )
            }
          >
            <IonIcon slot="start" icon={logoWhatsapp}></IonIcon>
            Escríbenos
          </IonItem>

          <IonItem
            disabled={!network.status}
            button={true}
            detail={true}
            onClick={() =>
              openWhatsApp(
                import.meta.env.VITE_HELP_PHONE,
                `Hola, necesito ayuda con algo dentro de la aplicación ${
                  import.meta.env.VITE_NAME
                }. ¿Podrían orientarme? Gracias."`
              )
            }
          >
            <IonIcon slot="start" icon={helpCircleOutline}></IonIcon>
            Ayuda
          </IonItem>

          {data.admin && (
            <IonItem
              disabled={!network.status}
              button={true}
              detail={true}
              onClick={() =>
                openWhatsApp(
                  data.admin.phone,
                  `Hola, me gustaría contactar con ${
                    data.admin.name
                  } para recibir orientación desde ${
                    import.meta.env.VITE_NAME
                  }. ¿Podrían ayudarme?`
                )
              }
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
