import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
} from "@ionic/react";
import styles from "./Footer.module.scss";

import crecimiento from "/assets/icons/crecimiento.svg";
import auriculares from "/assets/icons/auriculares.svg";
import calendario from "/assets/icons/calendario.svg";
import grupo from "/assets/icons/grupo.svg";
import { Link, Redirect, Route, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { library, playCircle, radio, search } from "ionicons/icons";
import UIContext from "@/context/Context";
import { Modal } from "@/components/Modal/Modal";

export const Footer = (props: any) => {
  const history = useHistory();
  const [tab, setTab] = useState(history.location.pathname);

  return (
    <IonFooter {...props}>
      <IonToolbar className={styles["ion-footer"]}>
        <IonButtons class="ion-justify-content-around">
          <Link
            to="/home"
            replace={true}
            onClick={() => setTab(history.location.pathname)}
          >
            <IonButton className={tab.includes("/home") ? styles.active : ""}>
              <IonIcon slot="icon-only" src={calendario}></IonIcon>
            </IonButton>
          </Link>

          <Link
            to="/crecimiento"
            replace={true}
            onClick={() => setTab(history.location.pathname)}
          >
            <IonButton
              className={tab.includes("/crecimiento") ? styles.active : ""}
            >
              <IonIcon slot="icon-only" src={crecimiento}></IonIcon>
            </IonButton>
          </Link>

          <Link
            to="/musicaterapia"
            replace={true}
            onClick={() => setTab(history.location.pathname)}
          >
            <IonButton
              className={tab.includes("/musicaterapia") ? styles.active : ""}
            >
              <IonIcon slot="icon-only" src={auriculares}></IonIcon>
            </IonButton>
          </Link>

          <Link
            to="/chat"
            replace={true}
            onClick={() => setTab(history.location.pathname)}
          >
            <IonButton
              className={
                tab.includes("/chat") || tab.includes("/grupo")
                  ? styles.active
                  : ""
              }
            >
              <IonIcon slot="icon-only" src={grupo}></IonIcon>
            </IonButton>
          </Link>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
};
