import User from "./user";

export default interface Canales {
  id: number;
  lider: User;
  colaboradores: User[];
  canal: string;
}
