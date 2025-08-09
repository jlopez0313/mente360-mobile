import { App } from "@capacitor/app";
import { useEffect } from "react";

export const useAppExitTracker = (onExit: any) => {
  useEffect(() => {
    let listener: any;

    const setupListener = async () => {
      listener = App.addListener(
        "appStateChange",
        async ({ isActive }) => {
          if (!isActive) {
            onExit();
          }
        }
      );
    };

    setupListener();

    return () => {
        listener.then(l => l.remove());
    };
  }, []);
};
