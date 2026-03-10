import Comunidades from "./comunidades";

export default interface Programas {
  id: number;
  comunidad_id?: number;
  comunidad: Comunidades;
  programa: string;
  descripcion: string;
  link: string;
}
