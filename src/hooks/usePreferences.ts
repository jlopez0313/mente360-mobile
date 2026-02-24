import { getPreference, KEYS, removePreference, setPreference, type PreferenceKey } from '@/helpers/preferences';

export { KEYS };
export type { PreferenceKey };

export interface IKeys {
  SYNC_KEY: string;
  CLIP_PAGE_KEY: string;
  CRECIMIENTOS_PAGE_KEY: string;
  HOME_SYNC_KEY: string;
  DARK_MODE: string;
  TOKEN: string;
}

interface IPreferences {
  keys: IKeys;
  getPreference: (key: string) => Promise<string | null>;
  setPreference: (key: string, value: string) => Promise<void>;
  removePreference: (key: string) => Promise<void>;
}

/**
 * Hook de preferencias para uso dentro de componentes y hooks de React.
 * Para uso fuera de componentes (servicios, etc.), importar directamente
 * desde '@/helpers/preferences'.
 */
export const usePreferences = (): IPreferences => {
  return {
    keys: KEYS,
    getPreference,
    setPreference,
    removePreference,
  };
};
