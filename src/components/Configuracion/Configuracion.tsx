import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonToggle,
  ToggleCustomEvent,
} from "@ionic/react";
import {
  callOutline,
  cogOutline,
  documentLockOutline,
  documentTextOutline,
  hammerOutline,
  peopleOutline,
} from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import Login from "@/pages/Login/Login";
import styles from "./Configuracion.module.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import UIContext from "@/context/Context";
import { useDispatch } from "react-redux";
import { setRoute } from "@/store/slices/routeSlice";

export const Configuracion = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const { db }: any = useContext(UIContext);

  const onLogout = async () => {
    localStorage.removeItem('home');
    localStorage.removeItem('onboarding');
    await db.clear();
    history.replace("/login");
  };

  useEffect(() => {
    dispatch(setRoute("/configuracion"));
  }, []);

  const [paletteToggle, setPaletteToggle] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleChange = (ev: ToggleCustomEvent) => {
    localStorage.setItem('darkMode', ev.detail.checked.toString())
    toggleDarkPalette(ev.detail.checked);
  };

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle("ion-palette-dark", shouldAdd);
    document.body.classList.toggle("dark", shouldAdd);
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
              color={"danger"}
            >
              <IonLabel>Modo Oscuro</IonLabel>
            </IonToggle>
          </IonItem>

          <Link to="/test">
            <IonItem button={true}>
              <IonIcon slot="start" icon={cogOutline} />
              <IonLabel>Realizar Test Eneagrama</IonLabel>
            </IonItem>
          </Link>
        </IonItemGroup>
      </IonList>

      <IonList inset={true}>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Acerca de Mente360</IonLabel>
          </IonItemDivider>

          <IonItem lines="none" className={"ion-margin-bottom"}>
            <IonIcon slot="start" icon={peopleOutline} />
            <IonLabel>Sobre Nosotros</IonLabel>
          </IonItem>

          <IonItem lines="none" className={"ion-margin-bottom"}>
            <IonIcon slot="start" icon={documentTextOutline} />
            <IonLabel>Términos y Condiciones</IonLabel>
          </IonItem>

          <IonItem>
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

        <IonItem lines="none" className={"ion-margin-bottom"}>
          <IonIcon slot="start" icon={hammerOutline} />
          <IonLabel>Soporte</IonLabel>
        </IonItem>

        <IonItem>
          <IonIcon slot="start" icon={callOutline} />
          <IonLabel>Contáctanos</IonLabel>
        </IonItem>
      </IonList>

      <div className="ion-text-center">
        <span className={styles["version"]}> Version. { import.meta.env.VITE_VERSION } </span>
      </div>

      <div className="ion-text-center ion-margin-bottom ion-padding">
        <IonButton onClick={onLogout} expand="block">
          Cerrar Sesión
        </IonButton>
      </div>
    </div>
  );
};
