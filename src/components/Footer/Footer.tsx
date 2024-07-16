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
import { Link, Redirect, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { library, playCircle, radio, search } from "ionicons/icons";
import UIContext from "@/context/Context";
import { Modal } from "@/components/Modal/Modal";

export const Footer = (props: any) => {
  const { tab, setTab }: any = useContext(UIContext);

  return (
    <IonFooter {...props}>
      <IonToolbar className={styles["ion-footer"]}>
        <IonButtons class="ion-justify-content-around">
          <Link
            to="/crecimiento"
            replace={true}
            onClick={() => setTab("crecimiento")}
          >
            <IonButton className={tab == "crecimiento" ? styles.active : ""}>
              <IonIcon slot="icon-only" src={crecimiento}></IonIcon>
            </IonButton>
          </Link>

          <Link
            to="/musicaterapia"
            replace={true}
            onClick={() => setTab("auriculares")}
          >
            <IonButton className={tab == "auriculares" ? styles.active : ""}>
              <IonIcon slot="icon-only" src={auriculares}></IonIcon>
            </IonButton>
          </Link>

          <Link to="/home" replace={true} onClick={() => setTab("calendario")}>
            <IonButton className={tab == "calendario" ? styles.active : ""}>
              <IonIcon slot="icon-only" src={calendario}></IonIcon>
            </IonButton>
          </Link>

          <IonButton
            className={tab == "grupo" ? styles.active : ""}
            id="modal-chat"
          >
            <IonIcon slot="icon-only" src={grupo}></IonIcon>
          </IonButton>

          <Modal
            trigger="modal-chat"
            title="Mensaje importante!"
            hideButtons={true}
          >
            <div className={styles.texto}>
              <p>
              Lo sentimos, esta funcionalidad aún no se encuentra disponible.. ¡Esperala pronto!
              </p>
            </div>
          </Modal>

          {/*<Link to='/chat' replace={true} onClick={() => setTab('grupo')}>
            <IonButton className={ tab == 'grupo' ? styles.active : ''} >
              <IonIcon slot="icon-only" src={grupo}></IonIcon>
            </IonButton>
          </Link>
          */}
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
};
