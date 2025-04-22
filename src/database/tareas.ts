import { SQLiteDBConnection } from "react-sqlite-hook";

export default class Tareas {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS tareas;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS tareas (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              isNew TEXT,
              tarea TEXT,
              done INTEGER
            );
        `);

      console.log(`Tareas has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, tareas: any) {
    try {
      performSQLAction(async () => {
        const placeholders = tareas.map(() => "(?, ?, ?, ?)").join(", ");
        const values = tareas.flatMap((cat: any) => [
          cat.id,
          cat.isNew,
          cat.tarea,
          cat.done ? 1 : 0,
        ]);

        const query2 = `INSERT OR REPLACE INTO tareas (id, isNew, tarea, done) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.error("error create tareas", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM tareas", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all tareas", error);
      throw error;
    }
  }

  async find(performSQLAction: any, id: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM tareas WHERE id=?",
          [id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find tareas", error);
      throw error;
    }
  }

  async markAsDone(performSQLAction: any, callback: any, {id, done}: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "UPDATE tareas SET done = ? WHERE id=?",
          [done, id]
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find tareas", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM tareas;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove tareas", error);
      throw error;
    }
  }
}
