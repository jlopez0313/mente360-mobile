import { db } from "@/hooks/useDexie";
import { semana } from "@/services/notificaciones";
import { update } from "../slices/notificationSlice";

export const getNotifications = () => {
  return async (dispatch: any, getState: any) => {
    try {
      const state = getState();
      const user = state.user?.user;

      if (!user?.id) return; // Validación de seguridad

      const { data: resp } = await semana();
      const apiNotifications: any[] = resp?.data || [];

      // Obtener todas las notificaciones locales guardadas usando el id
      const localNotifications = await db.notificaciones.where({ user_id: user.id }).toArray();
      const localMap = new Map(localNotifications.map((n: any) => [n.id, n]));

      // Preparar sincronización local con el backend, preservando flag
      const toPut = apiNotifications.map(apiN => {
        const localN = localMap.get(apiN.id);
        return {
          ...apiN,
          user_id: user.id,
          isRead: localN ? localN.isRead : false,
          isDeleted: localN ? localN.isDeleted : false
        };
      });

      // Insertar/actualizar localmente
      if (toPut.length > 0) {
        await db.notificaciones.bulkPut(toPut);
      }

      // Todavía informamos a Redux para no romper otras partes, pero el componente principal leerá de Dexie
      dispatch(update({ notificaciones: toPut.filter(n => !n.isDeleted) }));
    } catch (e) {
      console.error("Error sincronizando notificaciones", e);
    }
  };
};
