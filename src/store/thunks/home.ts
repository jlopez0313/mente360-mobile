import { DB, localDB } from "@/helpers/localStore";
import { db } from "@/hooks/useDexie";
import { getHome } from "@/services/home";
import { setAdmin, setPodcast } from "@/store/slices/homeSlice";

export const getHomeThunk = (): any => {
  return async (dispatch: any) => {
    const { data } = await getHome({});

    await db.audios.clear();
    await db.audios.add({
      ...data.audio,
    });

    await db.mensajes.clear();
    await db.mensajes.add({
      ...data.mensaje,
    });

    await db.tareas.clear();
    await db.tareas.add({
      ...data.tarea,
    });

    const podcast = { done: false };

    const localHome = localDB(DB.HOME);
    localHome.set({ admin: { ...data.admin }, podcast, showSuccess: false });

    dispatch(setPodcast(podcast));
    dispatch(setAdmin(data.admin));
  };
};
