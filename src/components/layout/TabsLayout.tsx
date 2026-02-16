import {
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  Bell,
  Home as HomeIcon,
  MessageCircle,
  Music,
  Users,
} from "lucide-react";
import { Route } from "react-router-dom";

import Chat from "@/pages/Chat/Chat";
import Comunidades from "@/pages/Comunidades/Comunidades";

import Musicaterapia from "@/pages/Musicaterapia/Musicaterapia";
import Notifications from "@/pages/Notifications/Notifications";
import { useSelector } from "react-redux";
import Home from "@/pages/Home/Home";

const navItems: {
  path: string;
  tab: string;
  label: string;
  child: any;
  icon: any;
}[] = [
  {
    path: "/home",
    tab: "home",
    label: "Inicio",
    child: <Home />,
    icon: HomeIcon,
  },
  {
    path: "/comunidades",
    tab: "comunidades",
    label: "Comunidades",
    child: <Comunidades />,
    icon: Users,
  },
  {
    path: "/musicaterapia",
    tab: "musicaterapia",
    label: "Música",
    child: <Musicaterapia />,
    icon: Music,
  },
  {
    path: "/notificaciones",
    tab: "notificaciones",
    label: "Alertas",
    child: <Notifications />,
    icon: Bell,
  },
  {
    path: "/chat",
    tab: "chat",
    label: "Chat",
    child: <Chat />,
    icon: MessageCircle,
  },
];

export const TabsLayout = () => {
  const { isGeneral, isRoom, isGrupo } = useSelector(
    (state: any) => state.notifications
  );

  return (
    <IonTabs>
      <IonRouterOutlet>
        {navItems.map((item, index) => (
          <Route exact path={item.path} key={index}>
            {item.child}
          </Route>
        ))}
      </IonRouterOutlet>

      <IonTabBar className="border-t border-border safe-bottom" slot="bottom">
        {navItems.map((item, index) => (
          <IonTabButton tab={item.tab} href={item.path} key={index}>
            <item.icon size={22} strokeWidth={2} />
            <IonLabel>{item.label}</IonLabel>
            {item.tab == "chat" && (isRoom || isGrupo) ? (
              <div className="absolute top-1 right-3 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
            ) : null}
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};
