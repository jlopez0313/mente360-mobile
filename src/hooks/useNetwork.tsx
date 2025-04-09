import React, { useEffect, useRef, useState } from "react";
import { Network } from "@capacitor/network";
import { PluginListenerHandle } from "@capacitor/core";

export const useNetwork = () => {
  const [status, setStatus] = useState(true);
  const [connectionType, setConnectionType] = useState("wifi");
  const listenerRef = useRef<PluginListenerHandle | null>(null);

  useEffect(() => {
    const updateNetworkStatus = async () => {
      try {
        const networkStatus = await Network.getStatus();
        setStatus(networkStatus.connected);
        setConnectionType(networkStatus.connectionType);

        console.log(networkStatus);

      } catch (error) {
        console.error("Error fetching network status:", error);
      }
    };

    updateNetworkStatus();

    const setupListener = async () => {
      try {
        listenerRef.current = await Network.addListener(
          "networkStatusChange",
          (status) => {
            console.log("Network status changed", status);
            setStatus(status.connected);
            setConnectionType(status.connectionType);
          }
        );
      } catch (error) {
        console.error("Error setting up network listener:", error);
      }
    };

    setupListener();

    return () => {
      listenerRef.current?.remove();
      listenerRef.current = null;
    };
  }, []);

  return {
    status,
    connectionType,
  };
};
