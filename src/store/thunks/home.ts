import { DB, localDB } from "@/helpers/localStore";
import { db } from "@/hooks/useDexie";
import { getHome } from "@/services/home";
import { setAdmin, setCadenaDelBien, setPodcast, setTarjetaDestacada } from "@/store/slices/homeSlice";

export const getHomeThunk = (): any => {
  return async (dispatch: any) => {
    const { data } = await getHome({
      comunidad: localStorage.getItem("principal") ?? "1"
    });

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
    const cadenaDelBien = data.cadena_del_bien ?? {};
    const tarjetaDestacada = data.tarjeta_destacada ?? {};

    const localHome = localDB(DB.HOME);
    localHome.set({
      admin: { ...data.admin },
      podcast,
      cadenaDelBien,
      tarjetaDestacada,
      showSuccess: false,
    });

    dispatch(setPodcast(podcast));
    dispatch(setAdmin(data.admin));
    dispatch(setCadenaDelBien(cadenaDelBien));
    dispatch(setTarjetaDestacada(tarjetaDestacada));
  };
};
