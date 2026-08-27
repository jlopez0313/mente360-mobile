import { baseApi } from "./api";

export const getDiario = async (from = ""): Promise<any> => {
  const { get } = await baseApi();
  return get(`/diario?last_sync=${from}`, { "Content-type": "application/json" });
};

/** Crea o actualiza la entrada del día (una por usuario + fecha). */
export const upsertDiario = async (payload: Record<string, any>): Promise<any> => {
  const { post } = await baseApi();
  return post("/diario", payload, { "Content-type": "application/json" });
};
