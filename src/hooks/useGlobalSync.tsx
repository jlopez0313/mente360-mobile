import { all as getAllCanales } from "@/services/canales";
import { all as getAllCategorias } from "@/services/categorias";
import {
  all as getAllClips,
  trashed as getTrashedClips,
  json as jsonClips,
} from "@/services/clips";
import { all as getAllComunidades } from "@/services/comunidades";
import { all as getAllConstants } from "@/services/constants";
import {
  all as getAllCrecimientos,
  json as jsonCrecimientos,
} from "@/services/crecimientos";
import { all as getAllNiveles } from "@/services/niveles";
import { all as getAllPlaylist } from "@/services/playlist";
import { all as getAllProgramas } from "@/services/programas";

import { useContext, useState } from "react";

import { NetworkContext } from "@/context/NetworkContext";
import { db } from "@/hooks/useDexie";
import { usePreferences } from "@/hooks/usePreferences";
import { useSelector } from "react-redux";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initSync = "2024-01-01T00:00:00Z";

/**
 * Sincroniza una tabla simple: fetch incremental por fecha y bulkPut en Dexie.
 */
async function syncSimpleTable(
  fetchFn: (from: string) => Promise<{ data: { data: any[] } }>,
  bulkPutFn: (items: any[]) => Promise<unknown>,
  fromDate: string
) {
  const { data: { data } } = await fetchFn(fromDate);
  if (!data.length) return;
  await bulkPutFn(data);
}

export const useGlobalSync = () => {
  const { getPreference, setPreference, keys } = usePreferences();
  const { status } = useContext(NetworkContext);
  const { user } = useSelector((state: any) => state.user);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Constantes
  const syncConstants = async () => {
    try {
      const { data } = await getAllConstants();

      await db.enlaces.clear();
      await db.enlaces.bulkPut(data.enlaces);

      await db.generos.clear();
      await db.generos.bulkPut(data.generos);

      await db.eneatipos.clear();
      await db.eneatipos.bulkPut(data.eneatipos);

      await db.planes.clear();
      await db.planes.bulkPut(data.planes);
    } catch (error) {
      console.error("Error syncConstants:", error);
    }
  };

  // Niveles
  const syncNiveles = async () => {
    try {
      const lastSync = await getPreference(keys.SYNC_KEY);
      await syncSimpleTable(getAllNiveles, (data) => db.niveles.bulkPut(data), lastSync ?? initSync);
    } catch (error) {
      console.error("Error syncNiveles:", error);
    }
  };

  // Comunidades
  const syncComunidades = async () => {
    try {
      const lastSync = await getPreference(keys.SYNC_KEY);
      await syncSimpleTable(getAllComunidades, (data) => db.comunidades.bulkPut(data), lastSync ?? initSync);
    } catch (error) {
      console.error("Error syncComunidades:", error);
    }
  };

  // Canales
  const syncCanales = async () => {
    try {
      const lastSync = await getPreference(keys.SYNC_KEY);
      await syncSimpleTable(getAllCanales, (data) => db.canales.bulkPut(data), lastSync ?? initSync);
    } catch (error) {
      console.error("Error syncCanales:", error);
    }
  };

  // Programas
  const syncProgramas = async () => {
    try {
      const lastSync = await getPreference(keys.SYNC_KEY);
      await syncSimpleTable(getAllProgramas, (data) => db.programas.bulkPut(data), lastSync ?? initSync);
    } catch (error) {
      console.error("Error syncProgramas:", error);
    }
  };

  // Crecimientos
  const syncCrecimientos = async () => {

    const lastSync = await getPreference(keys.SYNC_KEY);
    const fromDate = lastSync ?? undefined;

    let page = parseInt(
      (await getPreference(keys.CRECIMIENTOS_PAGE_KEY)) ?? "1"
    );
    let hasMore = true;

    const MAX_CONCURRENT_REQUESTS = 3;
    const batchSize = 5;
    let batchBuffer: any = {
      crecimientos: [],
    };

    while (hasMore) {
      const requests = [];

      if (!fromDate) {
        requests.push(jsonCrecimientos());
        hasMore = false;
      } else {
        for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
          const currentPage = page + i;
          requests.push(getAllCrecimientos(currentPage, fromDate));
        }
      }

      try {
        const responses = await Promise.all(requests);
        let totalData = 0;

        for (const res of responses) {
          const data = res.data?.data ?? res.data ?? [];

          if (!data.length) {
            if (batchBuffer.crecimientos.length > 0) {
              await processBatch(batchBuffer);
              batchBuffer = { crecimientos: [] };
            }

            hasMore = false;
            break;
          }

          totalData += data.length;
          batchBuffer.crecimientos.push(...data);

          if (batchBuffer.crecimientos.length >= 20 * batchSize) {
            await processBatch(batchBuffer);
            batchBuffer = { crecimientos: [] };
          }
        }

        if (totalData === 0) {
          hasMore = false;
        }

        page += MAX_CONCURRENT_REQUESTS;
        await setPreference(keys.CRECIMIENTOS_PAGE_KEY, page.toString());
        await delay(500);
      } catch (err: any) {
        console.error(err);
        throw new Error(`Too many requests en syncCrecimientos.`);
      }
    }
  };

  // Categorías
  const syncCategorias = async () => {
    try {
      const lastSync = await getPreference(keys.SYNC_KEY);
      await syncSimpleTable(getAllCategorias, (data) => db.categorias.bulkPut(data), lastSync ?? initSync);
    } catch (error) {
      console.error("Error syncCategorias:", error);
    }
  };

  // Playlist
  const syncPlaylist = async () => {
    try {
      const lastSync = await getPreference(keys.SYNC_KEY);
      const fromDate = lastSync ?? initSync;

      const {
        data: { data },
      } = await getAllPlaylist(fromDate);

      if (!data.length) {
        return;
      }

      await db.playlist
        .where({
          users_id: user?.id,
        })
        .delete();

      await db.playlist.bulkPut(
        data.map((item: any) => {
          return { id: item.id, clip: item.clip, users_id: item.user?.id };
        })
      );
    } catch (error) {
      console.error("Error syncPlaylist:", error);
    }
  };

  // Clips de Musicaterapia
  const syncClips = async () => {
    let page = parseInt((await getPreference(keys.CLIP_PAGE_KEY)) ?? "1");
    let hasMore = true;

    const lastSync = await getPreference(keys.SYNC_KEY);
    const fromDate = lastSync ?? undefined;

    const MAX_CONCURRENT_REQUESTS = 3;
    const batchSize = 5;
    let batchBuffer: any = {
      clips: [],
      usuarios_clips: [],
      likes: [],
    };

    while (hasMore) {
      const requests = [];

      if (!fromDate) {
        requests.push(jsonClips());
        hasMore = false;
      } else {
        for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
          const currentPage = page + i;
          requests.push(getAllClips("0", currentPage, "", fromDate));
        }
      }

      try {
        const responses = await Promise.all(requests);
        let totalData = 0;

        for (const res of responses) {
          const data = res.data?.data ?? res.data ?? [];

          if (!data.length) {
            if (batchBuffer.clips.length > 0) {
              await processBatch(batchBuffer);
              batchBuffer = { clips: [], usuarios_clips: [], likes: [] };
            }

            hasMore = false;
            break;
          }

          totalData += data.length;

          batchBuffer.clips.push(...data);

          for (const clip of data) {
            if (clip.usuarios_clips?.length) {
              batchBuffer.usuarios_clips.push(...clip.usuarios_clips);
            }
            if (clip.likes?.length) {
              batchBuffer.likes.push(...clip.likes);
            }
          }

          if (batchBuffer.clips.length >= 20 * batchSize) {
            await processBatch(batchBuffer);
            batchBuffer = { clips: [], usuarios_clips: [], likes: [] };
          }
        }

        if (totalData === 0) {
          hasMore = false;
        }

        page += MAX_CONCURRENT_REQUESTS;
        await setPreference(keys.CLIP_PAGE_KEY, page.toString());
        await delay(500);
      } catch (err: any) {
        console.error(err);
        throw new Error(`Too many requests en syncClips.`);
      }
    }
  };

  // Batch Load
  async function processBatch(batch: any) {
    if (batch.clips?.length) await db.clips.bulkPut(batch.clips);

    if (batch.crecimientos?.length)
      await db.crecimientos.bulkPut(batch.crecimientos);

    if (batch.usuarios_clips?.length)
      await db.usuarios_clips.bulkPut(batch.usuarios_clips);

    if (batch.likes?.length) await db.likes.bulkPut(batch.likes);
  }

  // Clips Eliminados
  const syncClipsTrashed = async () => {

    const lastSync = await getPreference(keys.SYNC_KEY);
    const fromDate = lastSync ?? initSync;

    try {
      const {
        data: { data },
      } = await getTrashedClips(fromDate);

      if (!data.length) {
        return;
      }

      for (const clip of data) {
        await db.clips.delete(clip.id);
      }
    } catch (err: any) {
      console.error(err);
      throw new Error(`Too many requests en syncClipsTrashed.`);
    }
  };

  // Sync Database
  const syncAll = async () => {
    if (status) {
      try {
        setLoading(true);
        setMensaje("Descargando información...");

        await Promise.all([
          syncConstants(),
          syncNiveles(),
          syncComunidades(),
          syncCanales(),
          syncCategorias(),
          syncPlaylist(),
          syncProgramas(),
        ]);

        await delay(2000);

        setMensaje("Descargando Podcasts...");
        await syncCrecimientos();

        setMensaje("Descargando Clips...");
        await syncClips();
        await syncClipsTrashed();

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        await setPreference(keys.SYNC_KEY, now.toISOString());
        await setPreference(keys.CRECIMIENTOS_PAGE_KEY, "1");
        await setPreference(keys.CLIP_PAGE_KEY, "1");

        console.log("Sincronización completa.");

        setSuccess(true);
        setError(false);
        setLoading(false);
        setMensaje("¡Información actualizada!");

        await delay(5000);
        setSuccess(false);
      } catch (error) {
        console.error(error);

        setSuccess(false);
        setError(true);
        setLoading(false);

        setMensaje("Estamos preparando todo para ti… vuelve aquí pronto.");
        await delay(5000);

        setError(false);
      }
    } else {
      console.warn("Sin conexión a internet. No se puede sincronizar.");
      return;
    }
  };

  return {
    loading,
    success,
    error,
    mensaje,
    syncAll,
  };
};
