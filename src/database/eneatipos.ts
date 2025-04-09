import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Eneatipos {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS eneatipos;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS eneatipos (
              key TEXT UNIQUE,
              valor TEXT,
              descripcion TEXT
            );
        `);

      console.log(`Eneatipos has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, eneatipos: any) {
    try {
      performSQLAction(async () => {
        const placeholders = eneatipos.map(() => "(?, ?, ?)").join(", ");
        const values = eneatipos.flatMap((cat: any) => [
          cat.key,
          cat.valor,
          cat.descripcion,
        ]);

        const query2 = `INSERT OR REPLACE INTO eneatipos (key, valor, descripcion) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error create eneatipos", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM eneatipos", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all eneatipos", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM eneatipos WHERE key=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find eneatipos", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM eneatipos;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove eneatipos", error);
      throw error;
    }
  }
}
