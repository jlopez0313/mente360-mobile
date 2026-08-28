import Diario, { FeedbackManana } from "@/database/diario";
import { db } from "@/hooks/useDexie";
import { getDiario, upsertDiario } from "@/services/diario";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

const toDateStr = (d: Date) => d.toISOString().split("T")[0];
const todayStr = () => toDateStr(new Date());
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateStr(d);
};

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
  const yesterdayEntry = entries.find((e) => e.fecha === yesterdayStr()) ?? null;

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

  const upsert = useCallback(
    async (fecha: string, patch: DiarioPatch) => {
      if (!userId) return;

      const rowsFor = () =>
        db.diario
          .where("users_id")
          .equals(userId)
          .and((e: any) => e.fecha === fecha)
          .toArray();

      // Escritura local optimista
      const existing = (await rowsFor())[0];
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
          const stale = (await rowsFor())
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

  const upsertToday = useCallback(
    (patch: DiarioPatch) => upsert(todayStr(), patch),
    [upsert]
  );

  const setYesterdayFeedback = useCallback(
    (value: FeedbackManana) => upsert(yesterdayStr(), { feedback_manana: value }),
    [upsert]
  );

  return { entries, todayEntry, yesterdayEntry, upsertToday, setYesterdayFeedback };
}
