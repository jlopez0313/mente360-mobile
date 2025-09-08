import Comunidades from "./comunidades";
import User from "./user";

export default interface Canales {
  id: number;
  lider: User;
  comunidad: Comunidades;
  colaboradores: User[];
  canal: string;
}
