import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";

const NIGHT_SERIES_PROGRESS_KEY = "mente360_night_series_day";
const NIGHT_SERIES_COMPLETED_DATE = "mente360_night_series_date";

export function useNightRoutine() {
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(() => {
    const saved = localStorage.getItem(NIGHT_SERIES_PROGRESS_KEY);
    return saved ? Math.min(Math.max(parseInt(saved, 10), 1), 21) : 1;
  });

  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem(NIGHT_SERIES_COMPLETED_DATE);
    return savedDate === today;
  });

  // Audios de noche sincronizados de la API (sin fallback local).
  const availableAudios = useLiveQuery(() => db.audios_noche.toArray()) ?? [];

  const currentAudio =
    availableAudios.length > 0
      ? availableAudios[(currentDayIndex - 1) % availableAudios.length]
      : null;

  // Largo de la serie = cantidad real de audios de noche sincronizados.
  const totalDays = availableAudios.length;

  const markDayCompleted = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setIsCompletedToday(true);
    localStorage.setItem(NIGHT_SERIES_COMPLETED_DATE, today);

    const nextDay =
      totalDays > 0 && currentDayIndex >= totalDays ? 1 : currentDayIndex + 1;
    setCurrentDayIndex(nextDay);
    localStorage.setItem(NIGHT_SERIES_PROGRESS_KEY, nextDay.toString());

    db.noche_secuencia.add({
      date: today,
      dayIndex: currentDayIndex,
      isCompleted: true,
      audioId: currentAudio?.id,
    });
  }, [currentDayIndex, currentAudio, totalDays]);

  return {
    currentDayIndex,
    totalDays,
    currentAudio,
    isCompletedToday,
    markDayCompleted,
  };
}
