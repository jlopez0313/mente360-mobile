import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useState } from "react";

const NIGHT_SERIES_PROGRESS_KEY = "mente360_night_series_day";
const NIGHT_SERIES_COMPLETED_DATE = "mente360_night_series_date";

export function useNightRoutine() {
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(() => {
    const saved = localStorage.getItem(NIGHT_SERIES_PROGRESS_KEY);
    return saved ? Math.min(Math.max(parseInt(saved, 10), 1), 21) : 8; // Default Day 8 of 21 as illustrated in the design
  });

  const [isCompletedToday, setIsCompletedToday] = useState<boolean>(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem(NIGHT_SERIES_COMPLETED_DATE);
    return savedDate === today;
  });

  // Get audio for the current day index from Dexie audios_noche (or fallback to audios)
  const audiosNoche = useLiveQuery(() => db.audios_noche.toArray());
  const fallbackAudios = useLiveQuery(() => db.audios.toArray());

  const availableAudios =
    audiosNoche && audiosNoche.length > 0 ? audiosNoche : fallbackAudios;

  // Pick audio for this day (modulo or index)
  const currentAudio =
    availableAudios && availableAudios.length > 0
      ? availableAudios[(currentDayIndex - 1) % availableAudios.length]
      : null;

  const markDayCompleted = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setIsCompletedToday(true);
    localStorage.setItem(NIGHT_SERIES_COMPLETED_DATE, today);

    // Increment day index for next session (up to 21, then loop or stay at 21)
    const nextDay = currentDayIndex >= 21 ? 1 : currentDayIndex + 1;
    setCurrentDayIndex(nextDay);
    localStorage.setItem(NIGHT_SERIES_PROGRESS_KEY, nextDay.toString());

    // Record in Dexie
    db.noche_secuencia.add({
      date: today,
      dayIndex: currentDayIndex,
      isCompleted: true,
      audioId: currentAudio?.id,
    });
  }, [currentDayIndex, currentAudio]);

  return {
    currentDayIndex,
    totalDays: 21,
    currentAudio,
    isCompletedToday,
    markDayCompleted,
  };
}
