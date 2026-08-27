import { baseApi } from "./api";

export const getAllCategoriasNoche = async (from = ""): Promise<any> => {
  const { get } = await baseApi();
  return get(`/categorias_noche?last_sync=${from}`, {
    "Content-type": "application/json",
  });
};

export const getAllAudiosNoche = async (
  categoriaId = "",
  from = "",
): Promise<any> => {
  const { get } = await baseApi();
  let url = `/audios_noche?last_sync=${from}`;
  if (categoriaId) {
    url += `&categoria_id=${categoriaId}`;
  }
  return get(url, { "Content-type": "application/json" });
};
