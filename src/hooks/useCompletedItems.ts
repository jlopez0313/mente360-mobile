import { useState, useEffect, useCallback } from "react";

type CompletedItems = {
  nightAudio: boolean;
  sosEmotional: boolean;
  dailyMessage: boolean;
  weeklyTask: boolean;
};

const STORAGE_KEY = "mente360_completed_items";
const DATE_KEY = "mente360_completed_date";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function useCompletedItems() {
  const [completed, setCompleted] = useState<CompletedItems>({
    nightAudio: false,
    sosEmotional: false,
    dailyMessage: false,
    weeklyTask: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const storedDate = localStorage.getItem(DATE_KEY);
    const today = getTodayKey();

    // Reset daily items if it's a new day
    if (storedDate !== today) {
      const freshState: CompletedItems = {
        nightAudio: false,
        sosEmotional: false,
        dailyMessage: false,
        weeklyTask: false, // Weekly task persists across days
      };
      
      // Keep weekly task status if within same week
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          freshState.weeklyTask = parsed.weeklyTask || false;
        } catch {
          // Ignore parse errors
        }
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
      localStorage.setItem(DATE_KEY, today);
      setCompleted(freshState);
    } else {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCompleted(JSON.parse(stored));
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const markComplete = useCallback((item: keyof CompletedItems) => {
    setCompleted((prev) => {
      const updated = { ...prev, [item]: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleComplete = useCallback((item: keyof CompletedItems) => {
    setCompleted((prev) => {
      const updated = { ...prev, [item]: !prev[item] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { completed, markComplete, toggleComplete };
}
