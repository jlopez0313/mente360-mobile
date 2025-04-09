import { Preferences } from "@capacitor/preferences";

export interface IKeys {
    SYNC_KEY: string;
    CLIP_PAGE_KEY: string;
    CRECIMIENTOS_PAGE_KEY: string;
    HOME_SYNC_KEY: string;
    DARK_MODE: string;
}

interface IPreferences {
    keys: IKeys,
    getPreference: (key: string) => Promise<string | null>
    setPreference: (key: string, value: string) => Promise<void>;
    removePreference: (key: string) => Promise<void>
}

export const usePreferences = (): IPreferences => {
  const keys: IKeys = {
    SYNC_KEY: "lastSyncDate",
    HOME_SYNC_KEY: "lastHomeSync",
    CLIP_PAGE_KEY: "lastClipPage",
    CRECIMIENTOS_PAGE_KEY: "lastCrecimientoPage",
    DARK_MODE: "darkMode",
  };

  const getPreference = async (key: string): Promise<string | null> => {
    const result = await Preferences.get({ key });
    return result.value;
  };

  const setPreference = async (key: string, value: string) => {
    await Preferences.set({ key, value });
  };

  const removePreference = async (key: string) => {
    await Preferences.remove({ key });
  };

  return {
    getPreference,
    setPreference,
    removePreference,
    keys,
  };
};
