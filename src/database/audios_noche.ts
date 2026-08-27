import CategoriasNoche from "./categorias_noche";

export default interface AudiosNoche {
  id: number;
  categorias_noche_id: number;
  categoria?: CategoriasNoche;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  audio: string;
  duracion?: string;
  orden?: number;
  created_at?: string;
  updated_at?: string;
}
