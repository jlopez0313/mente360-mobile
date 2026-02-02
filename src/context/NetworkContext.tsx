import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import AvatarLogo from "@/assets/images/avatar.jpg";
import { useNetwork } from "@/hooks/useNetwork";
import { createContext } from "react";

export const NetworkContext = createContext<{
  AvatarLogo: string;
  AudioNoWifi: string;
  baseURL: string;
  status: boolean;
  connectionType: string;
}>({
  AvatarLogo: '',
  AudioNoWifi: '',
  baseURL: '',
  status: true,
  connectionType: "wifi",
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const network = useNetwork();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  return (
    <NetworkContext.Provider value={{...network, AudioNoWifi, AvatarLogo, baseURL}}>
      {children}
    </NetworkContext.Provider>
  );
};
