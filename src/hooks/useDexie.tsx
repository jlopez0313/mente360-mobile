import Audios from "@/database/audios";
import Canales from "@/database/canales";
import Categorias from "@/database/categorias";
import Clips from "@/database/clips";
import Comunidades from "@/database/comunidades";
import Crecimientos from "@/database/crecimientos";
import Eneatipos from "@/database/eneatipos";
import Enlaces from "@/database/enlaces";
import Generos from "@/database/generos";
import Likes from "@/database/likes";
import Mensajes from "@/database/mensajes";
import Niveles from "@/database/niveles";
import Planes from "@/database/planes";
import Playlist from "@/database/playlist";
import Tareas from "@/database/tareas";
import User from "@/database/user";
import UsuariosClips from "@/database/usuarios_clips";

import AudiosNoche from "@/database/audios_noche";
import CategoriasNoche from "@/database/categorias_noche";
import DiaGuiadoProgreso from "@/database/dia_guiado";
import Diario from "@/database/diario";
import NocheSecuencia from "@/database/noche_secuencia";
import Notificaciones from "@/database/notificaciones";
import Programas from "@/database/programas";
import Dexie, { Table } from "dexie";

export class Mente360DB extends Dexie {
  notificaciones!: Table<Notificaciones, string>;
  audios!: Table<Audios, number>;
  canales!: Table<Canales, number>;
  categorias!: Table<Categorias, number>;
  clips!: Table<Clips, number>;
  comunidades!: Table<Comunidades, number>;
  crecimientos!: Table<Crecimientos, number>;
  enlaces!: Table<Enlaces, number>;
  eneatipos!: Table<Eneatipos, number>;
  generos!: Table<Generos, number>;
  likes!: Table<Likes, number>;
  mensajes!: Table<Mensajes, number>;
  niveles!: Table<Niveles, number>;
  planes!: Table<Planes, number>;
  playlist!: Table<Playlist, number>;
  programas!: Table<Programas, number>;
  tareas!: Table<Tareas, number>;
  usuarios_clips!: Table<UsuariosClips, number>;
  user!: Table<User, number>;
  dia_guiado!: Table<DiaGuiadoProgreso, number>;
  noche_secuencia!: Table<NocheSecuencia, number>;
  categorias_noche!: Table<CategoriasNoche, number>;
  audios_noche!: Table<AudiosNoche, number>;
  diario!: Table<Diario, number>;

  constructor() {
    super("Mente360DB");
    this.version(1).stores({
      audios: "++id",
      canales: "++id",
      categorias: "++id,categoria",
      clips: "++id,titulo",
      comunidades: "++id",
      crecimientos: "++id",
      enlaces: "++id,&key",
      eneatipos: "++id,&key",
      generos: "++id,&key",
      likes: "++id,users_id,clips_id",
      mensajes: "++id",
      niveles: "++id,canales_id,orden",
      planes: "++id,&key",
      playlist: "++id,users_id",
      programas: "++id",
      tareas: "++id",
      usuarios_clips: "++id,users_id,clips_id",
      user: "++id,name,email",
    });

    this.version(4).stores({
      notificaciones: "id, user_id, isRead, isDeleted, created_at",
    });

    this.version(5).stores({
      dia_guiado: "++id,date",
      noche_secuencia: "++id,date,dayIndex",
      categorias_noche: "++id,nombre",
      audios_noche: "++id,categorias_noche_id,titulo",
    });

    this.version(6).stores({
      diario: "++id,users_id,fecha",
    });
  }
}

export const db = new Mente360DB();
