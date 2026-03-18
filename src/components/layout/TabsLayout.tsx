import { db } from "@/hooks/useDexie";
import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Bell,
  Home as HomeIcon,
  MessageCircle,
  Music,
  Users,
} from "lucide-react";
import { Route } from "react-router-dom";

import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

import { PageLoader } from "@/components/Shared/PageLoader/PageLoader";
import { usePayment } from "@/hooks/usePayment";

const Chat = lazy(() => import("@/pages/Chat/Chat"));
const Comunidades = lazy(() => import("@/pages/Comunidades/Comunidades"));
const Home = lazy(() => import("@/pages/Home/Home"));
const Musicaterapia = lazy(() => import("@/pages/Musicaterapia/Musicaterapia"));
const Notifications = lazy(() => import("@/pages/Notifications/Notifications"));

const navItems: {
  isEnabled: boolean;
  path: string;
  tab: string;
  label: string;
  child: any;
  icon: any;
}[] = [
    {
      isEnabled: true,
      path: "/home",
      tab: "home",
      label: "Inicio",
      child: <Home />,
      icon: HomeIcon,
    },
    {
      isEnabled: false,
      path: "/comunidades",
      tab: "comunidades",
      label: "Comunidades",
      child: <Comunidades />,
      icon: Users,
    },
    {
      isEnabled: false,
      path: "/musicaterapia",
      tab: "musicaterapia",
      label: "Música",
      child: <Musicaterapia />,
      icon: Music,
    },
    {
      isEnabled: true,
      path: "/notificaciones",
      tab: "notificaciones",
      label: "Alertas",
      child: <Notifications />,
      icon: Bell,
    },
    {
      isEnabled: false,
      path: "/chat",
      tab: "chat",
      label: "Chat",
      child: <Chat />,
      icon: MessageCircle,
    },
  ];

export const TabsLayout = () => {
  const { userEnabled, payment_status } = usePayment();

  const { isRoom, isGrupo } = useSelector(
    (state: any) => state.notifications
  );

  const hasUnreadNotifications = useLiveQuery(
    async () => {
      const count = await db.notificaciones.filter((n: any) => !n.isRead && !n.isDeleted).count();
      return count > 0;
    },
    []
  );

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Suspense fallback={<PageLoader />}>
          {navItems.map((item, index) => (
            <Route exact path={item.path} key={index}>
              {item.child}
            </Route>
          ))}
        </Suspense>
      </IonRouterOutlet>

      <IonTabBar className="border-t border-border safe-bottom bg-background" slot="bottom" style={{ '--background': 'hsl(var(--background))' } as any}>
        {navItems.map((item, index) => (
          <IonTabButton
            tab={item.tab}
            href={item.path}
            key={index}
            disabled={
              !item.isEnabled && (!userEnabled || payment_status == "free")
            }
          >
            <item.icon size={22} strokeWidth={2} />
            <IonLabel>{item.label}</IonLabel>

            {/* Badge for chat */}
            {item.tab == "chat" && (isRoom || isGrupo) ? (
              <div className="absolute top-1 right-3 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
            ) : null}

            {/* Badge for notifications */}
            {item.tab == "notificaciones" && hasUnreadNotifications ? (
              <div className="absolute top-1 right-3 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
            ) : null}

          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};
