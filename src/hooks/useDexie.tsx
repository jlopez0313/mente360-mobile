import Audios from "@/database/audios";
import Categorias from "@/database/categorias";
import Clips from "@/database/clips";
import Crecimientos from "@/database/crecimientos";
import Eneatipos from "@/database/eneatipos";
import Generos from "@/database/generos";
import Mensajes from "@/database/mensajes";
import Niveles from "@/database/niveles";
import Playlist from "@/database/playlist";
import Tareas from "@/database/tareas";

import Dexie, { Table } from "dexie";

export class Mente360DB extends Dexie {
  audios!: Table<Audios, number>;
  categorias!: Table<Categorias, number>;
  clips!: Table<Clips, number>;
  crecimientos!: Table<Crecimientos, number>;
  eneatipos!: Table<Eneatipos, number>;
  generos!: Table<Generos, number>;
  mensajes!: Table<Mensajes, number>;
  niveles!: Table<Niveles, number>;
  playlist!: Table<Playlist, number>;
  tareas!: Table<Tareas, number>;

  constructor() {
    super("Mente360DB");
    this.version(1).stores({
      audios: "++id",
      categorias: "++id",
      clips: "++id,titulo",
      crecimientos: "++id",
      eneatipos: "++id",
      generos: "++id",
      mensajes: "++id",
      niveles: "++id,orden",
      playlist: "++id,users_id",
      tareas: "++id",
    });
  }
}

export const db = new Mente360DB();
