import { cn } from "@/lib/utils";
import { IonContent, IonPage } from "@ionic/react";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <IonPage>
      <IonContent fullscreen scrollY={false} className="space-y-4">
        <div className="h-full flex flex-col bg-background">
          <main className={cn(
              "flex-1 flex flex-col min-h-0",
              hideNav ? "" : ""
            )}>
            {children}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
