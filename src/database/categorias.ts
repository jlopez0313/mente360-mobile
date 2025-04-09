import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Categorias {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS categorias;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS categorias (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              categoria TEXT
            );
        `);

      console.log(`Categorias has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, categorias: any) {
    try {
      performSQLAction(async () => {
        const placeholders = categorias.map(() => "(?, ?)").join(", ");
        const values = categorias.flatMap((cat: any) => [
          cat.id,
          cat.categoria,
        ]);

        const query2 = `INSERT OR REPLACE INTO categorias (id, categoria) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error create categorias", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM categorias", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all categorias", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM categorias WHERE id=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find categorias", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM categorias;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove categorias", error);
      throw error;
    }
  }
}
