import Canales from "./canales";

export default interface Niveles {
  id: number;
  canal: Canales;
  nivel: string;
  gratis: number;
  orden: number;
}