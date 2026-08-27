import { update } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const STORAGE_KEY = "mente360_music_preferences";

/** Preferencias de música/géneros del usuario (IDs de categoría o nombres). */
export type MusicPreference = number | string;

function readLocal(): MusicPreference[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Fuente única para leer/guardar las preferencias de música.
 * Se usa desde "Mi día guiado" y desde la sección de Perfil/Configuración.
 * Al guardar persiste en localStorage y, si hay sesión, en la API (y Redux).
 */
export function useMusicPreferences() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const preferences: MusicPreference[] = user?.music_preferences ?? readLocal();
  const hasPreferences = Array.isArray(preferences) && preferences.length > 0;

  const savePreferences = useCallback(
    async (genres: MusicPreference[]) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(genres));

      if (user?.id) {
        try {
          const { data } = await update(
            { music_preferences: genres },
            user.id
          );
          if (data?.data) {
            dispatch(setUser(data.data));
          }
        } catch (e) {
          console.error("Error saving music preferences:", e);
        }
      }
    },
    [user, dispatch]
  );

  return { preferences, hasPreferences, savePreferences };
}
