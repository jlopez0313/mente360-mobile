import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Niveles {
    private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS niveles;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS niveles (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nivel TEXT,
              gratis INTEGER
            );
        `);

      console.log(`niveles has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, niveles: any) {
    try {
      performSQLAction(async () => {
        const placeholders = niveles.map(() => "(?, ?, ?)").join(", ");
        const values = niveles.flatMap((nivel: any) => [
          nivel.id,
          nivel.nivel,
          nivel.gratis,
        ]);

        const query2 = `INSERT OR REPLACE INTO niveles (id, nivel, gratis) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error create niveles", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM niveles", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all niveles", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM niveles WHERE id=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find niveles", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM niveles;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove niveles", error);
      throw error;
    }
  }
}
