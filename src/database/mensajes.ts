import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Mensajes {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS mensajes;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS mensajes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              mensaje TEXT,
              done INTEGER
            );
        `);

      console.log(`Mensajes has been created`);
    } catch (error) {
      console.error("error create mensajes", error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, mensajes: any) {
    try {
      performSQLAction(async () => {
        const placeholders = mensajes.map(() => "(?, ?, ?)").join(", ");
        const values = mensajes.flatMap((cat: any) => [
          cat.id,
          cat.mensaje,
          cat.done ? 1 : 0,
        ]);

        const query2 = `INSERT OR REPLACE INTO mensajes (id, mensaje, done) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error create mensajes", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM mensajes", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all mensajes", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM mensajes WHERE id=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find mensajes", error);
      throw error;
    }
  }

  async markAsDone(performSQLAction: any, callback: any, { id, done }: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "UPDATE mensajes SET done = ? WHERE id=?",
          [done, id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find mensajes", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM mensajes;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove mensajes", error);
      throw error;
    }
  }
}
