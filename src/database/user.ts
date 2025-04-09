import { SQLiteDBConnection } from "react-sqlite-hook";

export default class User {
  private db: SQLiteDBConnection | null;

  constructor(db: SQLiteDBConnection | null) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS users;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user TEXT
            );
        `);

      console.log(`Users has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, user: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(
          `INSERT OR REPLACE INTO users (id, user) values (?,?);`,
          [Date.now(), user]
        );
        callback();
      });
    } catch (error) {
      console.log("error create usuarios", error);
      throw error;
    }
  }

  async find(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query("SELECT * FROM users", []);
        callback(result?.values);
      });
    } catch (error) {
      console.log("error find usuarios", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM users;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove usuarios", error);
      throw error;
    }
  }
}
