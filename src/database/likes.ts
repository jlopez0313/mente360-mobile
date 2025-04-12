export default class Likes {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS likes;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS likes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              clips_id INTEGER, 
              users_id INTEGER
            );
        `);

      console.log(`likes has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, clips: any) {
    try {
      performSQLAction(async () => {
        const placeholders = clips
          .map(() => "(?, ?, ?)")
          .join(", ");
        const values = clips.flatMap((clip: any) => [
          clip.id,
          clip.clips_id,
          clip.users_id,
        ]);

        const query2 = `INSERT OR REPLACE INTO likes (id, clips_id, users_id) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error creating likes", error);
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
          "SELECT * FROM likes",
          []
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all likes", error);
      throw error;
    }
  }

  async find(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM likes WHERE id=?",
          [id]
        );
        callback(result.values[0]);
      });
    } catch (error) {
      console.log("error find likes", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM likes;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove likes", error);
      throw error;
    }
  }

  async delete(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM likes WHERE id=?;`, [id]);
        callback();
      });
    } catch (error) {
      console.log("error delete likes", error);
      throw error;
    }
  }
}
