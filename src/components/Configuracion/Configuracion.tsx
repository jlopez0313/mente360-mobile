import { openWhatsApp } from "@/helpers/Whatsapp";
import { usePreferences } from "@/hooks/usePreferences";
import { useSqliteDB } from "@/hooks/useSqliteDB";
import { setRoute } from "@/store/slices/routeSlice";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonToggle,
  ToggleCustomEvent,
  useIonToast,
} from "@ionic/react";
import {
  callOutline,
  cogOutline,
  documentLockOutline,
  documentTextOutline,
  downloadOutline,
  hammerOutline,
  peopleOutline,
  trashOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import styles from "./Configuracion.module.scss";

export const Configuracion = () => {
  const history = useHistory();

  const { makeBackup, exportJson } = useSqliteDB();
  const { removePreference, keys } = usePreferences();

  const dispatch = useDispatch();
  const [presentToast] = useIonToast();

  const onLogout = async () => {
    localStorage.removeItem("home");
    localStorage.removeItem("onboarding");
    history.replace("/login");
  };

  useEffect(() => {
    dispatch(setRoute("/configuracion"));
  }, []);

  const [paletteToggle, setPaletteToggle] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleChange = (ev: ToggleCustomEvent) => {
    localStorage.setItem("darkMode", ev.detail.checked.toString());
    toggleDarkPalette(ev.detail.checked);
  };

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    document.body.classList.toggle("dark", shouldAdd);
  };

  const onDownloadBackup = async () => {
    await makeBackup();
    onPresentToast("bottom", "El Backup ha sido descargado.", "");
  };

  const onClearPreferences = () => {
    Object.keys(keys).forEach((key: string) => {
      removePreference(keys[key]);
    });

    onPresentToast("bottom", "Preferencias Eliminadas.", "");
  };

  const onDownloadJson = async () => {
    await exportJson();
    onPresentToast("bottom", "El Backup ha sido descargado.", "");
  };

  const onPresentToast = (
    position: "top" | "middle" | "bottom",
    message: string,
    icon: any
  ) => {
    presentToast({
      message: message,
      duration: 2000,
      position: position,
      icon: icon,
    });
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDarkMode = savedMode === "true";
    setPaletteToggle(isDarkMode);
    toggleDarkPalette(isDarkMode);
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Configuracion Personal</IonLabel>
          </IonItemDivider>

          <IonItem button={true} lines="none" className={"ion-margin-bottom"}>
            <IonToggle
              checked={paletteToggle}
              onIonChange={toggleChange}
              color={"warning"}
            >
              <IonLabel>Modo Oscuro</IonLabel>
            </IonToggle>
          </IonItem>

          <Link to="/test">
            <IonItem button={true} className={"ion-margin-bottom"}>
              <IonIcon slot="start" icon={cogOutline} />
              <IonLabel>Realizar Test Eneagrama</IonLabel>
            </IonItem>
          </Link>
          {/*
          <Link to="/recordatorios">
            <IonItem button={true}>
              <IonIcon slot="start" icon={timeOutline} />
              <IonLabel>Mis Recordatorios</IonLabel>
            </IonItem>
          </Link>
*/}
        </IonItemGroup>
      </IonList>

      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Acerca de Mente360</IonLabel>
          </IonItemDivider>

          <IonItem
            lines="none"
            className={"ion-margin-bottom"}
            onClick={() => {
              window.open("https://soymente360.com/#quienes-somos", "_blank");
            }}
          >
            <IonIcon slot="start" icon={peopleOutline} />
            <IonLabel>Sobre Nosotros</IonLabel>
          </IonItem>

          <IonItem
            lines="none"
            className={"ion-margin-bottom"}
            onClick={() => {
              window.open("https://soymente360.com/privacy-policy/", "_blank");
            }}
          >
            <IonIcon slot="start" icon={documentTextOutline} />
            <IonLabel>Términos y Condiciones</IonLabel>
          </IonItem>

          <IonItem
            lines="none"
            onClick={() => {
              window.open("https://soymente360.com/privacy-policy/", "_blank");
            }}
          >
            <IonIcon slot="start" icon={documentLockOutline} />
            <IonLabel>Política de Privacidad</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>

      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Contáctanos</IonLabel>
          </IonItemDivider>
        </IonItemGroup>

        <IonItem
          lines="none"
          className={"ion-margin-bottom"}
          onClick={() =>
            openWhatsApp(
              import.meta.env.VITE_SUPPORT_PHONE,
              `Hola, tengo un problema con la aplicación ${import.meta.env.VITE_NAME
              } y necesito ayuda. Esto es lo que me sucede: `
            )
          }
        >
          <IonIcon slot="start" icon={hammerOutline} />
          <IonLabel>Soporte</IonLabel>
        </IonItem>

        <IonItem
          lines="none"
          className={"ion-margin-bottom"}
          onClick={async () => onDownloadBackup()}
        >
          <IonIcon slot="start" icon={downloadOutline} />
          <IonLabel>Backup BD</IonLabel>
        </IonItem>

        <IonItem
          lines="none"
          className={"ion-margin-bottom"}
          onClick={async () => onDownloadJson()}
        >
          <IonIcon slot="start" icon={downloadOutline} />
          <IonLabel>Backup JSON</IonLabel>
        </IonItem>

        <IonItem
          lines="none"
          className={"ion-margin-bottom"}
          onClick={async () => onClearPreferences()}
        >
          <IonIcon slot="start" icon={trashOutline} />
          <IonLabel>Limpiar Preferencias</IonLabel>
        </IonItem>

        <IonItem
          onClick={() =>
            openWhatsApp(
              import.meta.env.VITE_CONTACT_PHONE,
              `¡Hola! Me gustaría obtener más información sobre su servicio en ${import.meta.env.VITE_NAME
              }. ¿Podrían ayudarme?`
            )
          }
        >
          <IonIcon slot="start" icon={callOutline} />
          <IonLabel>Contáctanos</IonLabel>
        </IonItem>
      </IonList>

      <div className="ion-text-center">
        <span className={styles["version"]}>
          {" "}
          Version. {import.meta.env.VITE_VERSION}{" "}
        </span>
      </div>

      <div className="ion-text-center ion-margin-bottom ion-padding">
        <IonButton onClick={onLogout} expand="block">
          Cerrar Sesión
        </IonButton>
      </div>
    </div>
  );
};
