import AudiosNoche from "./audios_noche";
import CategoriasNoche from "./categorias_noche";

export type FeedbackManana = "igual" | "algo_mejor" | "mucho_mejor";

/** Entrada del Diario Mente360 (una por usuario + fecha). */
export default interface Diario {
  id: number;
  users_id: number;
  fecha: string; // YYYY-MM-DD
  texto_cierre_dia?: string | null;
  categoria_noche_id?: number | null;
  estado_emocional?: string | null;
  audio_recomendado_id?: number | null;
  audio_escuchado_id?: number | null;
  feedback_manana?: FeedbackManana | null;
  categoria_noche?: CategoriasNoche | null;
  audio_recomendado?: AudiosNoche | null;
  audio_escuchado?: AudiosNoche | null;
  created_at?: string;
  updated_at?: string;
}
