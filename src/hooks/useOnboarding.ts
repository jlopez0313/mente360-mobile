import { getPreference, removePreference, setPreference } from "@/helpers/preferences";
import { saveOnboarding, trial } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Flag local para la pantalla 7 ("Primer día completado"): el cierre del
// onboarding lo enciende y GuidedDayPage lo consume la primera vez que se
// completa el Día Guiado. Aparte de onboarding_completed_at porque ese ya
// quedó marcado al salir de la pantalla 5.
const FIRST_GUIDED_DAY_KEY = "mente360_onboarding_first_guided_day";

/**
 * Estado y persistencia del onboarding de primera vez. La fuente de verdad de
 * "ya lo hizo" es user.onboarding_completed_at (viene del backend en el login);
 * lo local es solo el flag de la pantalla de logro.
 */
export function useOnboarding() {
  const dispatch = useDispatch();
  const { user } = useSelector((s: any) => s.user);

  const isCompleted = !!user?.onboarding_completed_at;

  /** Pantalla 3: guarda temas + tiempo. No bloquea el avance si el backend falla. */
  const saveTemas = useCallback(
    async (temas: string[], tiempoDiario: number | null) => {
      try {
        const { data } = await saveOnboarding({ temas, tiempo_diario: tiempoDiario });
        if (data?.data) dispatch(setUser(data.data));
      } catch (e) {
        console.error("onboarding: no se pudo guardar temas/tiempo", e);
      }
    },
    [dispatch]
  );

  /**
   * Cierra el onboarding (fin de la pantalla 5 o "Saltar"): marca completado en
   * el backend y asegura el trial. Si el backend no responde, marca completado
   * localmente igual para no volver a atrapar al usuario en el flujo.
   */
  const finish = useCallback(async () => {
    try {
      const { data } = await saveOnboarding({ completed: true });
      if (data?.data) dispatch(setUser(data.data));
    } catch (e) {
      console.error("onboarding: no se pudo marcar completado", e);
      dispatch(setUser({ onboarding_completed_at: new Date().toISOString() }));
    }

    try {
      const { data } = await trial();
      if (data?.data) dispatch(setUser(data.data));
    } catch {
      // El trial ya se otorga en el registro; esto es solo una red de seguridad.
    }
  }, [dispatch]);

  const setFirstGuidedDayPending = useCallback(async (pending: boolean) => {
    if (pending) await setPreference(FIRST_GUIDED_DAY_KEY, "1");
    else await removePreference(FIRST_GUIDED_DAY_KEY);
  }, []);

  const getFirstGuidedDayPending = useCallback(async () => {
    return (await getPreference(FIRST_GUIDED_DAY_KEY)) === "1";
  }, []);

  return {
    isCompleted,
    saveTemas,
    finish,
    setFirstGuidedDayPending,
    getFirstGuidedDayPending,
  };
}
