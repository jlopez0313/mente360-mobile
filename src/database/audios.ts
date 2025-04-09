import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Audios {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS audios;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS audios (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              titulo TEXT,
              imagen TEXT,
              audio TEXT,
              done INTEGER
            );
        `);

      console.log(`Audios has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, audios: any) {
    try {
      performSQLAction(async () => {
        const placeholders = audios.map(() => "(?, ?, ?, ?, ?)").join(", ");
        const values = audios.flatMap((cat: any) => [
          cat.id,
          cat.titulo,
          cat.imagen,
          cat.audio,
          cat.done ? 1 : 0,
        ]);

        const query2 = `INSERT OR REPLACE INTO audios (id, titulo, imagen, audio, done) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.error("error create audios", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM audios", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all audios", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM audios WHERE id=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find audios", error);
      throw error;
    }
  }

  async markAsDone(performSQLAction: any, callback: any, {id, done}: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "UPDATE audios SET done = ? WHERE id=?",
          [done, id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find audios", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM audios;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove audios", error);
      throw error;
    }
  }
}
