import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import Chat from "@/pages/Chat/Chat";
import Comunidades from "@/pages/Comunidades/Comunidades";
import Home from "@/pages/Home/Home";
import Musicaterapia from "@/pages/Musicaterapia/Musicaterapia";
import Notifications from "@/pages/Notifications/Notifications";
import {
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, useHistory } from "react-router";
import styles from "./TabLayout.module.scss";

export const TabLayout = () => {
  const history = useHistory();

  const network = useNetwork();
  const { userEnabled, payment_status } = usePayment();

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(history.location.pathname);

  const { isGeneral, isRoom, isGrupo } = useSelector(
    (state: any) => state.notifications
  );

  return (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/comunidades">
            <Comunidades />
          </Route>
          <Route exact path="/musicaterapia">
            <Musicaterapia />
          </Route>
          <Route exact path="/notificaciones">
            <Notifications />
          </Route>
          <Route exact path="/chat">
            <Chat />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton
            tab="home"
            href="/home"
            onClick={() => setActiveTab("home")}
            className={activeTab.includes("home") ? styles.tabSelected : ""}
          >
            <span className="material-symbols-outlined filled">home</span>
          </IonTabButton>

          {!userEnabled || payment_status == "free" ? (
            <IonTabButton
              tab="comunidades"
              onClick={() => setIsPremiumOpen(true)}
            >
              <span className="material-symbols-outlined filled">
                diversity_3
              </span>
            </IonTabButton>
          ) : (
            <IonTabButton
              tab="comunidades"
              href="/comunidades"
              onClick={() => setActiveTab("comunidades")}
              className={
                activeTab.includes("comunidades") ? styles.tabSelected : ""
              }
            >
              <span className="material-symbols-outlined filled">
                diversity_3
              </span>
            </IonTabButton>
          )}

          {!userEnabled || payment_status == "free" ? (
            <IonTabButton
              tab="comunidades"
              onClick={() => setIsPremiumOpen(true)}
            >
              <span className="material-symbols-outlined filled">
                headphones
              </span>
            </IonTabButton>
          ) : (
            <IonTabButton
              tab="musicaterapia"
              href="/musicaterapia"
              onClick={() => setActiveTab("musicaterapia")}
              className={
                activeTab.includes("musicaterapia") ? styles.tabSelected : ""
              }
            >
              <span className="material-symbols-outlined filled">
                headphones
              </span>
            </IonTabButton>
          )}

          <IonTabButton
            tab="notificaciones"
            href="/notificaciones"
            onClick={() => setActiveTab("notificaciones")}
            className={
              activeTab.includes("notificaciones") ? styles.tabSelected : ""
            }
          >
            <span className="material-symbols-outlined ">notifications</span>
            {isGeneral && <div className={styles["has-notification"]}></div>}
          </IonTabButton>

          {!userEnabled || payment_status == "free" ? (
            <IonTabButton
              tab="comunidades"
              onClick={() => setIsPremiumOpen(true)}
            >
              <span className="material-symbols-outlined filled">
                connect_without_contact
              </span>
            </IonTabButton>
          ) : (
            <IonTabButton
              tab="chat"
              href="/chat"
              onClick={() => setActiveTab("chat")}
              className={activeTab.includes("chat") ? styles.tabSelected : ""}
            >
              <span className="material-symbols-outlined filled">
                connect_without_contact
              </span>
              {(isRoom || isGrupo) && (
                <div className={styles["has-notification"]}></div>
              )}
            </IonTabButton>
          )}
        </IonTabBar>
      </IonTabs>
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
