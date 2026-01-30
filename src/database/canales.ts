import Comunidades from "./comunidades";
import User from "./user";

export default interface Canales {
  id: number;
  lider: User;
  comunidades_id?: number;
  comunidad: Comunidades;
  colaboradores: User[];
  canal: string;
  imagen?: string;
  descripcion: string;
}
