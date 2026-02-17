import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import AvatarLogo from "@/assets/images/avatar.jpg";
import { useNetwork } from "@/hooks/useNetwork";
import { createContext, ReactNode } from "react";

interface NetworkContextType {
  AvatarLogo: string;
  AudioNoWifi: string;
  baseURL: string;
  status: boolean;
  connectionType: string;
}

export const NetworkContext = createContext<NetworkContextType>({
  AvatarLogo: "",
  AudioNoWifi: "",
  baseURL: "",
  status: true,
  connectionType: "wifi",
});

interface Props {
  children: ReactNode;
}

export function NetworkProvider({ children }: Props): JSX.Element {
  const network = useNetwork();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  return (
    <NetworkContext.Provider
      value={{ ...network, AvatarLogo, AudioNoWifi, baseURL }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
