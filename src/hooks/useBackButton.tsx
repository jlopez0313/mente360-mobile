import { useEffect } from "react";
import { useHistory } from "react-router";

export const useBackButton = (route: string) => {
  const history = useHistory();

  useEffect(() => {
    const handleBackButton = (ev: any) => {
      ev.detail.register(10, () => {
        history.replace(route);
      });
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history, route]);

  return { history };
};
