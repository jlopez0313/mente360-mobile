import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";

/**
 * "Mi secuencia nocturna": muestra el audio de la noche del usuario, que sale
 * de la tabla `audios` filtrada por su eneatipo. Es el MISMO audio que el Home
 * ya trae vía /home; el backend lo rota 1 por día (HomeController@getAudio).
 * No hay contador ni tracking de progreso en el cliente.
 */
export function useNightRoutine() {
  const currentAudio =
    useLiveQuery(() => db.audios.toCollection().first()) ?? null;

  return { currentAudio };
}
