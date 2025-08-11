import Audios from "@/database/audios";
import Categorias from "@/database/categorias";
import Clips from "@/database/clips";
import Crecimientos from "@/database/crecimientos";
import Eneatipos from "@/database/eneatipos";
import Generos from "@/database/generos";
import Likes from "@/database/likes";
import Mensajes from "@/database/mensajes";
import Niveles from "@/database/niveles";
import Playlist from "@/database/playlist";
import Tareas from "@/database/tareas";
import User from "@/database/user";
import UsuariosClips from "@/database/usuarios_clips";

import Dexie, { Table } from "dexie";

export class Mente360DB extends Dexie {
  audios!: Table<Audios, number>;
  categorias!: Table<Categorias, number>;
  clips!: Table<Clips, number>;
  crecimientos!: Table<Crecimientos, number>;
  eneatipos!: Table<Eneatipos, number>;
  generos!: Table<Generos, number>;
  likes!: Table<Likes, number>;
  mensajes!: Table<Mensajes, number>;
  niveles!: Table<Niveles, number>;
  playlist!: Table<Playlist, number>;
  tareas!: Table<Tareas, number>;
  usuarios_clips!: Table<UsuariosClips, number>;
  user!: Table<User, number>;

  constructor() {
    super("Mente360DB");
    this.version(1).stores({
      audios: "++id",
      categorias: "++id",
      clips: "++id,titulo",
      crecimientos: "++id",
      eneatipos: "++id",
      generos: "++id",
      likes: "++id,users_id,clips_id",
      mensajes: "++id",
      niveles: "++id,orden",
      playlist: "++id,users_id",
      tareas: "++id",
      usuarios_clips: "++id,users_id,clips_id",
      user: "++id,name,email",
    });
  }
}

export const db = new Mente360DB();
