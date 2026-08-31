import { db } from "@/hooks/useDexie";
import { getAudios } from "@/services/audios";
import { confirmAudio } from "@/services/home";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";

/**
 * "Mi secuencia nocturna" = los audios del eneatipo del usuario (tabla `audios`).
 * Es el MISMO contenido que el "audio de la noche" del Home: el backend lo rota
 * 1 por día (HomeController@getAudio, vía UsuariosAudios). El avance vive en el
 * servidor, no en el dispositivo.
 *
 * - currentAudio: el audio de hoy (el que ya guarda `db.audios` desde /home).
 * - currentDayIndex / totalDays: posición en la secuencia, desde GET /audios.
 * - markDayCompleted: marca el de hoy como escuchado (POST /users_audios).
 */
export function useNightRoutine() {
  const currentAudio =
    useLiveQuery(() => db.audios.toCollection().first()) ?? null;

  const [progress, setProgress] = useState<{
    currentDay: number;
    totalDays: number;
  }>({ currentDay: 1, totalDays: 0 });

  useEffect(() => {
    let alive = true;

    getAudios()
      .then(({ data }: any) => {
        if (!alive) return;
        const meta = data?.meta ?? {};
        setProgress({
          currentDay: Number(meta.current_day) || 1,
          totalDays: Number(meta.total_days) || 0,
        });
      })
      .catch((e: any) => console.error("getAudios", e));

    return () => {
      alive = false;
    };
  }, [currentAudio?.id]);

  const isCompletedToday = Number(currentAudio?.done) === 1;

  const markDayCompleted = useCallback(async () => {
    if (!currentAudio?.id) return;
    try {
      await db.audios.update(currentAudio.id, { done: 1 });
      await confirmAudio({ audios_id: currentAudio.id });
    } catch (e: any) {
      console.error("markDayCompleted", e);
    }
  }, [currentAudio?.id]);

  return {
    currentDayIndex: progress.currentDay,
    totalDays: progress.totalDays,
    currentAudio,
    isCompletedToday,
    markDayCompleted,
  };
}
