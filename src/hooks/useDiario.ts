import Diario from "@/database/diario";
import { db } from "@/hooks/useDexie";
import { getDiario, upsertDiario } from "@/services/diario";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const todayStr = () => new Date().toISOString().split("T")[0];

type DiarioPatch = Partial<
  Pick<
    Diario,
    | "texto_cierre_dia"
    | "categoria_noche_id"
    | "estado_emocional"
    | "audio_recomendado_id"
    | "audio_escuchado_id"
    | "feedback_manana"
  >
>;

/**
 * Diario Mente360. Fuente local: Dexie `diario`. En el montaje trae del
 * servidor (`GET /diario`) y reconcilia. Escritura optimista: se guarda local
 * de inmediato y se hace upsert en el backend (una entrada por usuario + fecha).
 */
export function useDiario() {
  const { user } = useSelector((state: any) => state.user);
  const userId: number | undefined = user?.id;

  const entries =
    useLiveQuery(async () => {
      if (!userId) return [] as Diario[];
      const rows = await db.diario.where("users_id").equals(userId).toArray();
      return rows.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    }, [userId]) ?? [];

  const todayEntry = entries.find((e) => e.fecha === todayStr()) ?? null;

  // Sync inicial desde el server
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getDiario();
        const list: any[] = data?.data ?? data ?? [];
        if (!cancelled && list.length) await db.diario.bulkPut(list);
      } catch {
        /* offline: nos quedamos con lo local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const upsertToday = useCallback(
    async (patch: DiarioPatch) => {
      if (!userId) return;
      const fecha = todayStr();

      const rowsForToday = () =>
        db.diario
          .where("users_id")
          .equals(userId)
          .and((e: any) => e.fecha === fecha)
          .toArray();

      // Escritura local optimista
      const existing = (await rowsForToday())[0];
      if (existing?.id != null) {
        await db.diario.update(existing.id, patch as any);
      } else {
        await db.diario.add({
          id: -Date.now(),
          users_id: userId,
          fecha,
          ...patch,
        } as any);
      }

      // Upsert en el backend y reconciliación
      try {
        const { data } = await upsertDiario({ fecha, ...patch });
        const saved = data?.data ?? data;
        if (saved?.id) {
          const stale = (await rowsForToday())
            .map((r) => r.id)
            .filter((id) => id !== saved.id);
          if (stale.length) await db.diario.bulkDelete(stale);
          await db.diario.put(saved);
        }
      } catch {
        /* offline: queda la versión local, el próximo sync la reconcilia */
      }
    },
    [userId]
  );

  return { entries, todayEntry, upsertToday };
}
