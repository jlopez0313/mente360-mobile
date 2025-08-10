import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Clips {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS clips;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS clips (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              categorias_id INTEGER, 
              titulo TEXT,
              imagen TEXT,
              audio TEXT,
              downloaded INTEGER DEFAULT 0,
              imagen_local TEXT DEFAULT '',
              audio_local TEXT DEFAULT ''
            );
        `);

      console.log(`Clips has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, clips: any) {
    try {
      performSQLAction(async () => {
        const placeholders = clips.map(() => "(?, ?, ?, ?, ?)").join(", ");
        const values = clips.flatMap((clip: any) => [
          clip.id,
          clip.categoria?.id ?? 0,
          clip.titulo,
          clip.imagen,
          clip.audio,
        ]);

        const query2 = `INSERT INTO clips (id, categorias_id, titulo, imagen, audio)
        VALUES ${placeholders}
        ON CONFLICT(id) DO UPDATE SET 
          categorias_id = excluded.categorias_id,
          titulo = excluded.titulo,
          imagen = excluded.imagen,
          audio = excluded.audio
        ;
        `;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error creating clips", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any, { search, limit, userID }: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          `SELECT clips.*, categorias.categoria,
            (SELECT COUNT(*) FROM likes where clips.id = likes.clips_id) as all_likes,
            (SELECT id FROM likes where clips.id = likes.clips_id AND likes.users_id = ${userID}) as my_like,
            (SELECT id FROM playlist where clips.id = playlist.clips_id AND playlist.users_id = ${userID}) as in_my_playlist
          FROM clips
          INNER JOIN categorias ON categorias.id = clips.categorias_id
          WHERE titulo LIKE ? ORDER BY titulo LIMIT ? OFFSET ?`,
          [`%${search}%`, 10, (limit - 1) * 10]
        );

        callback(result?.values);
      });
    } catch (error) {
      console.log("error all clips", error);
      throw error;
    }
  }

  async find(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT clips.*, categorias.categoria FROM clips INNER JOIN categorias ON categorias.id = clips.categorias_id WHERE clips.id=? ORDER BY titulo",
          [id]
        );
        callback(result?.values ? result?.values[0] : []);
      });
    } catch (error) {
      console.log("error find clips", error);
      throw error;
    }
  }

  async byCategory(
    performSQLAction: any,
    callback: any,
    { search, categoria, userID }: any
  ) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          `SELECT clips.*, categorias.categoria, 
            (SELECT COUNT(*) FROM likes where clips.id = likes.clips_id) as all_likes,
            (SELECT id FROM likes where clips.id = likes.clips_id AND likes.users_id = ${userID}) as my_like,
            (SELECT id FROM playlist where clips.id = playlist.clips_id AND playlist.users_id = ${userID}) as in_my_playlist
          FROM clips
          INNER JOIN categorias ON categorias.id = clips.categorias_id
          WHERE categorias_id=? AND titulo LIKE ? ORDER BY titulo
          `,
          [categoria, `%${search}%`]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error byCategory clips", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        await this.db?.query(`DELETE FROM clips;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove clips", error);
      throw error;
    }
  }

  async delete(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM clips WHERE id=?;`, [id]);
        callback();
      });
    } catch (error) {
      console.log("error delete likes", error);
      throw error;
    }
  }

  async download(
    performSQLAction: any,
    callback: any,
    { id, imagen, audio }: any
  ) {
    try {
      performSQLAction(async () => {
        await this.db?.query(
          `UPDATE clips SET imagen_local=?, audio_local=?, downloaded=? WHERE id=?;`,
          [imagen, audio, 1, id]
        );
        callback();
      });
    } catch (error) {
      console.log("error download clips", error);
      throw error;
    }
  }

  async unload(performSQLAction: any, callback: any, { id }: any) {
    try {
      performSQLAction(async () => {
        await this.db?.query(
          `UPDATE clips SET imagen_local=?, audio_local=?, downloaded=? WHERE id=?;`,
          ["", "", 0, id]
        );
        callback();
      });
    } catch (error) {
      console.log("error unload clips", error);
      throw error;
    }
  }
}
