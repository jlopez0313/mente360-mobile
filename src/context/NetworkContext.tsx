import { useNetwork } from "@/hooks/useNetwork";
import { createContext } from "react";

export const NetworkContext = createContext<{
  status: boolean;
  connectionType: string;
}>({
  status: true,
  connectionType: "wifi",
});

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const network = useNetwork();

  return (
    <NetworkContext.Provider value={network}>
      {children}
    </NetworkContext.Provider>
  );
};
