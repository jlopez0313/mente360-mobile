import { getPreference, KEYS, setPreference } from "@/helpers/preferences";
import { ONBOARDING_TIPS } from "@/lib/onboardingTips";
import { useCallback, useEffect, useState } from "react";

type SeenMap = Record<string, boolean>;

const readSeen = async (): Promise<SeenMap> => {
  const raw = await getPreference(KEYS.ONBOARDING_TIPS_SEEN);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const writeSeen = async (seen: SeenMap): Promise<void> => {
  await setPreference(KEYS.ONBOARDING_TIPS_SEEN, JSON.stringify(seen));
};

/**
 * Tip contextual de una pantalla (ver TipCard): se muestra la primera vez que
 * se entra y se recuerda para siempre, hasta que se reinicie desde
 * Configuración (resetOnboardingTips). Comparte el mismo storage que
 * useOnboardingProgress, así que marcar "Entendido" acá también tacha el
 * paso correspondiente en el checklist "Primeros pasos" de Home.
 */
export const useOnboardingTip = (key: string) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    readSeen().then((seen) => {
      if (mounted && !seen[key]) setVisible(true);
    });
    return () => {
      mounted = false;
    };
  }, [key]);

  const dismiss = useCallback(async () => {
    setVisible(false);
    const seen = await readSeen();
    seen[key] = true;
    await writeSeen(seen);
  }, [key]);

  return { visible, dismiss };
};

/**
 * Progreso del checklist "Primeros pasos" de Home: cuenta cuántas de las
 * pantallas en ONBOARDING_TIPS ya se visitaron/descartaron. `refresh` hay que
 * llamarlo al reentrar a Home (con useIonViewWillEnter): Home vive dentro de
 * IonTabs y no se desmonta al cambiar de pestaña, así que sin esto el
 * progreso quedaría pegado al de la primera carga.
 */
export const useOnboardingProgress = () => {
  const [seen, setSeen] = useState<SeenMap>({});

  const refresh = useCallback(async () => {
    setSeen(await readSeen());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const doneCount = ONBOARDING_TIPS.filter((t) => seen[t.key]).length;

  return { seen, refresh, doneCount, total: ONBOARDING_TIPS.length };
};

/** Borra el progreso guardado: botón "Reiniciar guías" en Configuración. */
export const resetOnboardingTips = async (): Promise<void> => {
  await writeSeen({});
};
