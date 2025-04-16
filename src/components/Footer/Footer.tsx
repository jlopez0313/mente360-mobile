import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import styles from "./Footer.module.scss";

import { useNetwork } from "@/hooks/useNetwork";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import auriculares from "/assets/icons/auriculares.svg";
import calendario from "/assets/icons/calendario.svg";
import crecimiento from "/assets/icons/crecimiento.svg";
import grupo from "/assets/icons/grupo.svg";

export const Footer = (props: any) => {
  const history = useHistory();
  const network = useNetwork();

  const [tab, setTab] = useState(history.location.pathname);

  const { isRoom, isGrupo } = useSelector((state: any) => state.notifications);

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
            style={{
              opacity: !network.status ? 0.5 : 1,
              pointerEvents: !network.status ? "none" : "auto",
            }}
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
              {(isRoom || isGrupo) && (
                <div className={styles["has-notification"]}></div>
              )}
              <IonIcon slot="icon-only" src={grupo}></IonIcon>
            </IonButton>
          </Link>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
};
