import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Generos {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS generos;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS generos (
              key TEXT UNIQUE,
              valor TEXT
            );
        `);

      console.log(`Generos has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, generos: any) {
    try {
      performSQLAction(async () => {
        const placeholders = generos.map(() => "(?, ?)").join(", ");
        const values = generos.flatMap((cat: any) => [
          cat.key,
          cat.valor,
        ]);

        const query2 = `INSERT OR REPLACE INTO generos (key, valor) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error create generos", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM generos", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all generos", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM generos WHERE key=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find generos", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM generos;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove generos", error);
      throw error;
    }
  }
}
