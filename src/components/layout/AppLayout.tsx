import { IonContent, IonPage } from "@ionic/react";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <IonPage>
      <IonContent fullscreen  className="space-y-4">
        <div className="px-4 py-4 bg-background">
          <main className={hideNav ? "" : "pb-20"}>
            {children}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
