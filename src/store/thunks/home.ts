import { DB, localDB } from "@/helpers/localStore";
import { getHome } from "@/services/home";
import {
  setAdmin,
  setAudio,
  setMensaje,
  setPodcast,
  setTarea,
} from "@/store/slices/homeSlice";

export const getHomeThunk = (
  sqlite: any,
  audiosDB: any,
  mensajesDB: any,
  tareasDB: any
): any => {
  return async (dispatch: any) => {
    const { data } = await getHome({});

    await audiosDB.remove(sqlite.performSQLAction, () => {});
    await audiosDB.create(sqlite.performSQLAction, () => {}, [data.audio]);

    await mensajesDB.remove(sqlite.performSQLAction, () => {});
    await mensajesDB.create(sqlite.performSQLAction, () => {}, [data.mensaje]);

    await tareasDB.remove(sqlite.performSQLAction, () => {});
    await tareasDB.create(sqlite.performSQLAction, () => {}, [data.tarea]);

    dispatch(setAudio(data.audio));
    dispatch(setMensaje(data.mensaje));
    dispatch(setTarea(data.tarea));

    const podcast = { done: false };

    const localHome = localDB(DB.HOME);
    localHome.set({ admin: { ...data.admin }, podcast, showSuccess: false });

    dispatch(setPodcast(podcast));
    dispatch(setAdmin(data.admin));
  };
};
