import { db } from "@/hooks/useDexie";
import { all as fetchLikes, dislike, like } from "@/services/likes";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const LOCAL_KEY = "mente360_noche_favoritos";

function readLocal(): number[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(ids: number[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify([...new Set(ids)]));
}

/**
 * Favoritos de audios de noche.
 * Fuente local: db.likes (registros con audios_noche_id) + un set en localStorage
 * como respaldo offline. Al alternar se persiste local de inmediato (optimista) y
 * se intenta registrar/borrar en el backend (/likes). Un sync desde el server
 * reconcilia db.likes en el montaje.
 */
export function useNightFavorites() {
  const { user } = useSelector((state: any) => state.user);

  const dbFavIds = useLiveQuery(async () => {
    if (!user?.id) return [] as number[];
    const rows = await db.likes
      .where("users_id")
      .equals(user.id)
      .filter((l: any) => l.audios_noche_id != null)
      .toArray();
    return rows.map((r: any) => r.audios_noche_id as number);
  }, [user?.id]);

  const favoriteIds = [...new Set([...(dbFavIds ?? []), ...readLocal()])];

  const isFavorite = useCallback(
    (audioId?: number) => (audioId ? favoriteIds.includes(audioId) : false),
    [favoriteIds]
  );

  // Reconciliar con el server una vez
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await fetchLikes();
        const list: any[] = data?.data ?? data ?? [];
        const nightLikes = list.filter((l) => l?.audios_noche_id);
        if (!cancelled && nightLikes.length) {
          await db.likes.bulkPut(
            nightLikes.map((l) => ({
              id: l.id,
              users_id: l.users_id,
              audios_noche_id: l.audios_noche_id,
            }))
          );
          writeLocal(nightLikes.map((l) => l.audios_noche_id));
        }
      } catch {
        /* offline: nos quedamos con lo local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const toggleFavorite = useCallback(
    async (audioId?: number) => {
      if (!audioId || !user?.id) return;

      const existing = await db.likes
        .where("users_id")
        .equals(user.id)
        .filter((l: any) => l.audios_noche_id === audioId)
        .first();

      if (existing) {
        // quitar
        await db.likes.where("id").equals(existing.id).delete();
        writeLocal(readLocal().filter((x) => x !== audioId));
        try {
          await dislike(existing.id);
        } catch {
          /* se reintenta en el próximo sync */
        }
      } else {
        // agregar (optimista con id temporal negativo hasta confirmar)
        const tempId = -Date.now();
        await db.likes.add({
          id: tempId,
          users_id: user.id,
          audios_noche_id: audioId,
        } as any);
        writeLocal([...readLocal(), audioId]);
        try {
          const {
            data: { data: added },
          } = await like({ audios_noche_id: audioId, users_id: user.id });
          if (added?.id) {
            await db.likes.where("id").equals(tempId).delete();
            await db.likes.put({
              id: added.id,
              users_id: user.id,
              audios_noche_id: audioId,
            } as any);
          }
        } catch {
          /* offline: queda el registro temporal, el sync lo corrige */
        }
      }
    },
    [user?.id]
  );

  return { favoriteIds, isFavorite, toggleFavorite };
}
