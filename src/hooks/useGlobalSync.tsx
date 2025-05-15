import { all as getAllCategorias } from "@/services/categorias";
import { all as getAllClips, trashed as getTrashedClips } from "@/services/clips";
import { all as getAllConstants } from "@/services/constants";
import { all as getAllCrecimientos } from "@/services/crecimientos";
import { all as getAllNiveles } from "@/services/niveles";
import { all as getAllPlaylist } from "@/services/playlist";

import { useState } from "react";
import { useNetwork } from "./useNetwork";

import CategoriasDB from "@/database/categorias";
import EneatiposDB from "@/database/eneatipos";
import GenerosDB from "@/database/generos";

import ClipsDB from "@/database/clips";
import CrecimientosDB from "@/database/crecimientos";
import LikesDB from "@/database/likes";
import NivelesDB from "@/database/niveles";
import PlaylistDB from "@/database/playlist";
import ClipsUsuariosDB from "@/database/usuarios_clips";

import { useDB } from "@/context/Context";
import { usePreferences } from "@/hooks/usePreferences";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initSync = "2024-01-01T00:00:00Z";

export const useGlobalSync = () => {
  const { getPreference, setPreference, keys } = usePreferences();

  const network = useNetwork();
  const { sqlite } = useDB();
  
  const [ loading, setLoading ] = useState( false );
  const [ success, setSuccess ] = useState( false );
  const [ mensaje, setMensaje ] = useState( '' );

  const syncConstants = async () => {
    try {
      console.log("start syncConstants");

      const generosDB = new GenerosDB(sqlite.db);
      const eneatiposDB = new EneatiposDB(sqlite.db);

      const { data } = await getAllConstants();
      await generosDB.create(sqlite.performSQLAction, () => {}, data.generos);

      await eneatiposDB.create(
        sqlite.performSQLAction,
        () => {},
        data.eneatipos
      );

      console.log("syncConstants completa.");
    } catch (error) {
      console.error("Error syncConstants:", error);
    }
  };

  const syncNiveles = async () => {
    try {
      console.log("start syncNiveles");

      const lastSync = await getPreference(keys.SYNC_KEY);
      const fromDate = lastSync ?? initSync;

      const nivelesDB = new NivelesDB(sqlite.db);

      const {
        data: { data },
      } = await getAllNiveles(fromDate);

      if (!data.length) {
        return;
      }

      await nivelesDB.create(sqlite.performSQLAction, () => {}, data);

      console.log("syncNiveles completa.");
    } catch (error) {
      console.error("Error syncNiveles:", error);
    }
  };

  const syncCrecimientos = async () => {
    console.log("start syncCrecimientos");

    const lastSync = await getPreference(keys.SYNC_KEY);
    const fromDate = lastSync ?? initSync;

    let page = parseInt(
      (await getPreference(keys.CRECIMIENTOS_PAGE_KEY)) ?? "1"
    );
    let hasMore = true;

    const crecimientosDB = new CrecimientosDB(sqlite.db);

    while (hasMore) {
      try {
        const {
          data: { data },
        } = await getAllCrecimientos(page, fromDate);

        if (!data.length) {
          hasMore = false;
          break;
        }

        await crecimientosDB.create(sqlite.performSQLAction, () => {}, data);

        page++;
        await setPreference(keys.CRECIMIENTOS_PAGE_KEY, page.toString());

        await delay(500);
      } catch (err: any) {
        console.log( err );
        throw new Error(`Too many requests en syncCrecimientos.`)
      }
    }

    console.log("syncCrecimientos completa.");
  };

  const syncCategorias = async () => {
    try {
      console.log("start syncCategorias");

      const lastSync = await getPreference(keys.SYNC_KEY);
      const fromDate = lastSync ?? initSync;

      const categoriasDB = new CategoriasDB(sqlite.db);

      const {
        data: { data },
      } = await getAllCategorias(fromDate);

      if (!data.length) {
        return;
      }

      await categoriasDB.create(sqlite.performSQLAction, () => {}, data);

      console.log("syncCategorias completa.");
    } catch (error) {
      console.error("Error syncCategorias:", error);
    }
  };

  const syncPlaylist = async () => {
    try {
      console.log("start syncPlaylist");

      const lastSync = await getPreference(keys.SYNC_KEY);
      const fromDate = lastSync ?? initSync;

      const playlistDB = new PlaylistDB(sqlite.db);

      const {
        data: { data },
      } = await getAllPlaylist(fromDate);

      if (!data.length) {
        return;
      }

      await playlistDB.create(sqlite.performSQLAction, () => {}, data);

      console.log("syncPlaylist completa.");
    } catch (error) {
      console.error("Error syncPlaylist:", error);
    }
  };

  const syncClips = async () => {
    console.log("start syncClips");

    let page = parseInt((await getPreference(keys.CLIP_PAGE_KEY)) ?? "1");
    let hasMore = true;

    const lastSync = await getPreference(keys.SYNC_KEY);
    const fromDate = lastSync ?? initSync;

    const clipsDB = new ClipsDB(sqlite.db);
    const ucDB = new ClipsUsuariosDB(sqlite.db);
    const likesDB = new LikesDB(sqlite.db);

    while (hasMore) {
      try {
        const {
          data: { data },
        } = await getAllClips("0", page, "", fromDate);

        if (!data.length) {
          hasMore = false;
          break;
        }

        await clipsDB.create(sqlite.performSQLAction, () => {}, data);

        for (const clip of data) {
          if (clip.usuarios_clips?.length) {
            await ucDB.create(
              sqlite.performSQLAction,
              () => {},
              clip.usuarios_clips
            );
          }
          if (clip.likes?.length) {
            await likesDB.create(sqlite.performSQLAction, () => {}, clip.likes);
          }
        }

        page++;
        await setPreference(keys.CLIP_PAGE_KEY, page.toString());
        await delay(500);
        
      } catch (err: any) {
        console.log( err );
        throw new Error(`Too many requests en syncClips.`)
      }
    }

    console.log("syncClips completa.");
  };

  const syncClipsTrashed = async () => {
    console.log("start syncClipsTrashed");

    const lastSync = await getPreference(keys.SYNC_KEY);
    const fromDate = lastSync ?? initSync;

    const clipsDB = new ClipsDB(sqlite.db);

    try {
      const {
        data: { data },
      } = await getTrashedClips(fromDate);

      if (!data.length) {
        return;
      }

      for (const clip of data) {
        await clipsDB.delete(sqlite.performSQLAction, () => {}, clip.id);
      }
      
    } catch (err: any) {
      console.log( err );
      throw new Error(`Too many requests en syncClipsTrashed.`)
    }

    console.log("syncClipsTrashed completa.");
  };

  const syncAll = async () => {
    if (network.status) {
      try {

        setLoading( true );
        setMensaje('Descargando información...')

        console.log("start syncAll");

        await Promise.all([
          syncConstants(),
          syncNiveles(),
          syncCategorias(),
          syncPlaylist(),
        ]);

        await delay(2000);
        
        setMensaje('Descargando Podcasts...')
        await syncCrecimientos();

        setMensaje('Descargando Clips...')
        await syncClips();
        await syncClipsTrashed();

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        await setPreference(keys.SYNC_KEY, now.toISOString());
        await setPreference(keys.CRECIMIENTOS_PAGE_KEY, "1");
        await setPreference(keys.CLIP_PAGE_KEY, "1");

        console.log("Sincronización completa.");
        
        setSuccess( true );
        setLoading( false );
        setMensaje('¡Información actualizada!')
        
      } catch (error) {
        console.error(error);
        
        setLoading( false );
        setSuccess( false );
        setMensaje('¡Vaya! Intenta luego.')
      }


    } else {
      console.warn("Sin conexión a internet. No se puede sincronizar.");
      return;
    }
  };

  return {
    loading,
    success,
    mensaje,
    syncAll
  }

};
