import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import styles from "./Footer.module.scss";

import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
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
  const { userEnabled, payment_status } = usePayment();

  const [tab, setTab] = useState(history.location.pathname);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const { isRoom, isGrupo } = useSelector((state: any) => state.notifications);

  return (
    <>
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

            {!userEnabled || payment_status == "free" ? (
              <IonButton onClick={() => setIsPremiumOpen(true)}>
                <IonIcon slot="icon-only" src={auriculares}></IonIcon>
              </IonButton>
            ) : (
              <Link
                to="/musicaterapia"
                replace={true}
                onClick={() => setTab(history.location.pathname)}
              >
                <IonButton
                  className={
                    tab.includes("/musicaterapia") ? styles.active : ""
                  }
                >
                  <IonIcon slot="icon-only" src={auriculares}></IonIcon>
                </IonButton>
              </Link>
            )}

            {!userEnabled || payment_status == "free" ? (
              <IonButton onClick={() => setIsPremiumOpen(true)}>
                <IonIcon slot="icon-only" src={grupo}></IonIcon>
              </IonButton>
            ) : (
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
            )}
          </IonButtons>
        </IonToolbar>
      </IonFooter>

      <Modal
        isOpen={isPremiumOpen}
        title={import.meta.env.VITE_NAME + " premium"}
        hideButtons={!network.status || false}
        showButtons={false}
        onConfirm={() => {}}
        onWillDismiss={() => setIsPremiumOpen(false)}
      >
        <div className="ion-padding">
          <Premium />
          <Buttons />
        </div>
      </Modal>
    </>
  );
};
