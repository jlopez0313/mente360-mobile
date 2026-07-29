import { Preferences } from '@capacitor/preferences';

/**
 * Claves de preferencias de la aplicación.
 * Módulo utilitario puro — no es un hook de React.
 */
export const KEYS = {
  SYNC_KEY: 'lastSyncDate',
  HOME_SYNC_KEY: 'lastHomeSync',
  CLIP_PAGE_KEY: 'lastClipPage',
  CRECIMIENTOS_PAGE_KEY: 'lastCrecimientoPage',
  DARK_MODE: 'darkMode',
  TOKEN: 'token',
  EPAYCO_PENDING_REF: 'epaycoPendingRef',
} as const;

export type PreferenceKey = (typeof KEYS)[keyof typeof KEYS];

export const getPreference = async (key: string): Promise<string | null> => {
  const result = await Preferences.get({ key });
  return result.value;
};

export const setPreference = async (key: string, value: string): Promise<void> => {
  await Preferences.set({ key, value });
};

export const removePreference = async (key: string): Promise<void> => {
  await Preferences.remove({ key });
};
