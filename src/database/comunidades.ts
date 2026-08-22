import User from "./user";

export default interface Comunidades {
  id: number;
  comunidad: string;
  imagen?: string;
  video?: string;
  descripcion: string;
  lider: User;
  suscritos: User[];
  es_principal?: boolean;
}
