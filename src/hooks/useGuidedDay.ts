import { db } from "@/hooks/useDexie";
import { useMusicPreferences } from "@/hooks/useMusicPreferences";
import { useCallback, useEffect, useState } from "react";

const GUIDED_DAY_DATE_KEY = "mente360_guided_day_date";
const GUIDED_DAY_STATE_KEY = "mente360_guided_day_state";

export interface GuidedDayState {
  completedSteps: number[]; // 1: Mensaje, 2: Audio, 3: Música
  currentStep: number; // 1, 2, 3 o 4 (completado)
  selectedClipId?: number;
  isCompleted: boolean;
}

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function useGuidedDay() {
  const {
    preferences,
    hasPreferences: hasMusicPreferences,
    savePreferences: saveMusicPreferences,
  } = useMusicPreferences();

  const [state, setState] = useState<GuidedDayState>(() => {
    const today = getTodayStr();
    const savedDate = localStorage.getItem(GUIDED_DAY_DATE_KEY);
    if (savedDate === today) {
      try {
        const saved = localStorage.getItem(GUIDED_DAY_STATE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      completedSteps: [],
      currentStep: 1,
      isCompleted: false,
    };
  });

  // Sync with local storage and Dexie on mount / date change
  useEffect(() => {
    const today = getTodayStr();
    const savedDate = localStorage.getItem(GUIDED_DAY_DATE_KEY);

    if (savedDate !== today) {
      const freshState: GuidedDayState = {
        completedSteps: [],
        currentStep: 1,
        isCompleted: false,
      };
      localStorage.setItem(GUIDED_DAY_DATE_KEY, today);
      localStorage.setItem(GUIDED_DAY_STATE_KEY, JSON.stringify(freshState));
      setState(freshState);

      // Also persist to Dexie
      db.dia_guiado
        .where("date")
        .equals(today)
        .first()
        .then((record) => {
          if (!record) {
            db.dia_guiado.add({
              date: today,
              completedSteps: [],
              isCompleted: false,
            });
          }
        });
    }
  }, []);

  const saveState = useCallback((newState: Partial<GuidedDayState>) => {
    setState((prev) => {
      const updated = { ...prev, ...newState };
      const today = getTodayStr();
      localStorage.setItem(GUIDED_DAY_DATE_KEY, today);
      localStorage.setItem(GUIDED_DAY_STATE_KEY, JSON.stringify(updated));

      // Persist in Dexie
      db.dia_guiado
        .where("date")
        .equals(today)
        .first()
        .then((record) => {
          if (record && record.id) {
            db.dia_guiado.update(record.id, {
              completedSteps: updated.completedSteps,
              isCompleted: updated.isCompleted,
              musicClipId: updated.selectedClipId,
            });
          } else {
            db.dia_guiado.add({
              date: today,
              completedSteps: updated.completedSteps,
              isCompleted: updated.isCompleted,
              musicClipId: updated.selectedClipId,
            });
          }
        });

      return updated;
    });
  }, []);

  const completeStep = useCallback((stepNumber: number) => {
    setState((prev) => {
      const newCompleted = Array.from(
        new Set([...prev.completedSteps, stepNumber]),
      );
      const isAllDone = [1, 2, 3].every((s) => newCompleted.includes(s));
      const nextStep = isAllDone ? 4 : Math.min(stepNumber + 1, 3);

      const updated: GuidedDayState = {
        ...prev,
        completedSteps: newCompleted,
        currentStep: nextStep,
        isCompleted: isAllDone,
      };

      const today = getTodayStr();
      localStorage.setItem(GUIDED_DAY_DATE_KEY, today);
      localStorage.setItem(GUIDED_DAY_STATE_KEY, JSON.stringify(updated));

      // Dexie update
      db.dia_guiado
        .where("date")
        .equals(today)
        .first()
        .then((record) => {
          if (record?.id) {
            db.dia_guiado.update(record.id, {
              completedSteps: newCompleted,
              isCompleted: isAllDone,
            });
          }
        });

      return updated;
    });
  }, []);

  return {
    state,
    completedSteps: state.completedSteps,
    currentStep: state.currentStep,
    isCompleted: state.isCompleted,
    selectedClipId: state.selectedClipId,
    hasMusicPreferences,
    preferences,
    completeStep,
    saveState,
    saveMusicPreferences,
  };
}
