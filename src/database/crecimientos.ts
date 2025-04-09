export default class Crecimientos {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS crecimientos;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS crecimientos (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              niveles_id INTEGER, 
              titulo TEXT,
              imagen TEXT,
              audio TEXT,
              downloaded INTEGER DEFAULT 0,
              imagen_local TEXT DEFAULT '',
              audio_local TEXT DEFAULT ''
            );
        `);

      console.log(`crecimientos has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, crecimientos: any) {
    try {
      performSQLAction(async () => {
        const placeholders = crecimientos
          .map(() => "(?, ?, ?, ?, ?)")
          .join(", ");
        const values = crecimientos.flatMap((clip: any) => [
          clip.id,
          clip.nivel?.id ?? 0,
          clip.titulo,
          clip.imagen,
          clip.audio,
        ]);

        const query2 = `INSERT INTO crecimientos (id, niveles_id, titulo, imagen, audio)
        VALUES ${placeholders}
        ON CONFLICT(id) DO UPDATE SET 
          niveles_id = excluded.niveles_id,
          titulo = excluded.titulo,
          imagen = excluded.imagen,
          audio = excluded.audio;
        ;`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error creating crecimientos", error);
      throw error;
    }
  }

  async all(
    performSQLAction: any,
    callback: any,
    {}: any
  ) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT crecimientos.*, niveles.nivel FROM crecimientos INNER JOIN niveles ON niveles.id = crecimientos.niveles_id",
          []
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all crecimientos", error);
      throw error;
    }
  }

  async find(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT crecimientos.*, niveles.nivel FROM crecimientos INNER JOIN niveles ON niveles.id = crecimientos.niveles_id WHERE crecimientos.id=?",
          [id]
        );
        callback(result.values[0]);
      });
    } catch (error) {
      console.log("error find crecimientos", error);
      throw error;
    }
  }

  async byNivel(
    performSQLAction: any,
    callback: any,
    { nivel }: any
  ) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT crecimientos.*, niveles.nivel  FROM crecimientos INNER JOIN niveles ON niveles.id = crecimientos.niveles_id WHERE niveles_id=?",
          [nivel]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error byCategory crecimientos", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM crecimientos;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove crecimientos", error);
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
        const query = await this.db?.query(
          `UPDATE crecimientos SET imagen_local=?, audio_local=?, downloaded=? WHERE id=?;`,
          [imagen, audio, 1, id]
        );
        callback();
      });
    } catch (error) {
      console.log("error download crecimientos", error);
      throw error;
    }
  }

  async unload(performSQLAction: any, callback: any, { id }: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(
          `UPDATE crecimientos SET imagen_local=?, audio_local=?, downloaded=? WHERE id=?;`,
          ["", "", 0, id]
        );
        callback();
      });
    } catch (error) {
      console.log("error unload crecimientos", error);
      throw error;
    }
  }
}
