import { getPreference, KEYS, setPreference } from "@/helpers/preferences";
import { db } from "@/hooks/useDexie";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// Cada cuántos días recordamos, si ya hay una principal válida, cuál es.
const CONFIRM_EVERY_DAYS = 7;

const today = () => new Date().toISOString().slice(0, 10);

const daysSince = (iso?: string | null) => {
  if (!iso) return Infinity;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Infinity;
  return (Date.now() - then) / 86_400_000;
};

/**
 * Recordatorios de comunidad principal, al entrar al Home:
 *
 *  - Sin principal válida (no elegida, o apunta a una comunidad que ya no
 *    tiene suscrita) y con comunidades suscritas -> le recuerda que debe
 *    escogerla. Si solo tiene una, la fija sola.
 *  - Con principal válida -> cada CONFIRM_EVERY_DAYS días le recuerda cuál es.
 *
 * Corre una sola vez por montaje del Home y no hace nada durante el onboarding
 * (usuario sin eneatipo) ni si el usuario no tiene comunidades suscritas.
 */
export const usePrincipalReminder = () => {
  const { user } = useSelector((state: any) => state.user);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (!user?.id || !user?.eneatipo) return;
    ran.current = true;

    const run = async () => {
      const subIds: number[] = (user.suscripciones ?? [])
        .map((s: any) => Number(s?.id))
        .filter((id: number) => Number.isFinite(id) && id > 0);

      // Sin comunidades suscritas no hay nada que elegir.
      if (subIds.length === 0) return;

      const comunidades = await db.comunidades.where("id").anyOf(subIds).toArray();
      const nombre = (id: number) =>
        comunidades.find((c: any) => c.id === id)?.comunidad ?? "tu comunidad";

      const stored = Number(localStorage.getItem("principal"));
      const isValid = Number.isFinite(stored) && stored > 0 && subIds.includes(stored);

      if (!isValid) {
        // Principal ausente o apuntando a una comunidad ya no suscrita.
        localStorage.removeItem("principal");

        // Una sola opción: la fijamos sin fricción.
        if (subIds.length === 1) {
          localStorage.setItem("principal", String(subIds[0]));
          toast.success(`Tu comunidad principal es ${nombre(subIds[0])}`);
          return;
        }

        // Varias: se lo recordamos una vez al día hasta que la escoja.
        const last = await getPreference(KEYS.PRINCIPAL_REMINDER_KEY);
        if (last === today()) return;
        await setPreference(KEYS.PRINCIPAL_REMINDER_KEY, today());

        toast.info(
          "Elige tu comunidad principal en Configuración para personalizar tus tareas y contenido",
        );
        return;
      }

      // Ya hay una principal válida: recordatorio cada N días de cuál es.
      const last = await getPreference(KEYS.PRINCIPAL_CONFIRM_KEY);
      if (daysSince(last) < CONFIRM_EVERY_DAYS) return;
      await setPreference(KEYS.PRINCIPAL_CONFIRM_KEY, new Date().toISOString());

      toast.info(`Tu comunidad principal es ${nombre(stored)}. Cámbiala en Configuración si quieres`);
    };

    run().catch((e) => console.log("usePrincipalReminder", e));
  }, [user?.id, user?.eneatipo]);
};
