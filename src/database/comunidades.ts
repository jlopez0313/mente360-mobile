import User from "./user";

export default interface Comunidades {
  id: number;
  comunidad: string;
  imagen?: string;
  descripcion: string;
  lider: User;
}
