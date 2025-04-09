export default class Clips {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS usuarios_clips;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
            CREATE TABLE IF NOT EXISTS usuarios_clips (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              clips_id INTEGER, 
              users_id INTEGER
            );
        `);

      console.log(`usuarios_clips has been created`);
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

        const query2 = `INSERT OR REPLACE INTO usuarios_clips (id, clips_id, users_id) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error creating usuarios_clips", error);
      throw error;
    }
  }

  async all(
    performSQLAction: any,
    callback: any,
    { search, limit, categoria }: any
  ) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * usuarios_clips",
          []
        );
        callback(result?.values);
      });
    } catch (error) {
      console.log("error all usuarios_clips", error);
      throw error;
    }
  }

  async find(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM usuarios_clips WHERE id=?",
          [id]
        );
        callback(result.values[0]);
      });
    } catch (error) {
      console.log("error find usuarios_clips", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM usuarios_clips;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove usuarios_clips", error);
      throw error;
    }
  }
}
