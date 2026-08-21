import { cn } from "@/lib/utils";
import { IonContent, IonPage } from "@ionic/react";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

/**
 * Exposes IonContent's real scroll element so descendants can hand it to
 * react-virtuoso as `customScrollParent`, instead of relying on a fragile
 * min-h-full/flex-1/h-full percentage chain to give a virtualized list a
 * resolvable pixel height.
 */
export const IonScrollContext = createContext<HTMLElement | null>(null);

export function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    contentRef.current?.getScrollElement().then(setScrollElement);
  }, []);

  return (
    <IonPage>
      <IonContent ref={contentRef} fullscreen scrollY={true} className="space-y-4">
        <IonScrollContext.Provider value={scrollElement}>
          <div className="min-h-full flex flex-col bg-background">
            <main className={cn(
                "flex-1 flex flex-col min-h-0",
                hideNav ? "pb-20" : ""
              )}>
              {children}
            </main>
          </div>
        </IonScrollContext.Provider>
      </IonContent>
    </IonPage>
  );
}
