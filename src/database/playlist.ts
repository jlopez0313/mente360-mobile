export default class Playlist {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async drop() {
    try {
      await this.db?.execute(`DROP TABLE IF EXISTS playlist;`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async init() {
    try {
      await this.db?.execute(`
              CREATE TABLE IF NOT EXISTS playlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                clips_id INTEGER, 
                users_id INTEGER
              );
          `);

      console.log(`playlist has been created`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(performSQLAction: any, callback: any, clips: any) {
    try {
      performSQLAction(async () => {
        const placeholders = clips.map(() => "(?, ?, ?)").join(", ");
        const values = clips.flatMap((clip: any) => [
          clip.id,
          clip.clip?.id ?? 0,
          clip.user?.id ?? 0,
        ]);

        const query2 = `INSERT OR REPLACE INTO playlist (id, clips_id, users_id) VALUES ${placeholders};`;

        await this.db?.query(query2, values);
        callback();
      });
    } catch (error) {
      console.log("error creating playlist", error);
      throw error;
    }
  }

  async all(performSQLAction: any, callback: any, { userID, search }: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          `SELECT playlist.id as in_my_playlist, clips.*, categorias.categoria,
              (SELECT COUNT(*) FROM likes where clips.id = likes.clips_id) as all_likes,
              (SELECT id FROM likes where clips.id = likes.clips_id) as my_like
            FROM playlist
            INNER JOIN clips ON playlist.clips_id = clips.id
            INNER JOIN categorias ON categorias.id = clips.categorias_id
            WHERE users_id = ? AND titulo LIKE ?`,
          [userID, `%${search}%`]
        );

        callback(result?.values);
      });
    } catch (error) {
      console.log("error all playlist", error);
      throw error;
    }
  }

  async find(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const result = await this.db?.query(
          "SELECT * FROM playlist WHERE id=?",
          [id]
        );
        callback(result.values[0]);
      });
    } catch (error) {
      console.log("error find playlist", error);
      throw error;
    }
  }

  async remove(performSQLAction: any, callback: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM playlist;`, []);
        callback();
      });
    } catch (error) {
      console.log("error remove playlist", error);
      throw error;
    }
  }

  async delete(performSQLAction: any, callback: any, id: any) {
    try {
      performSQLAction(async () => {
        const query = await this.db?.query(`DELETE FROM playlist WHERE id=?;`, [id]);
        callback();
      });
    } catch (error) {
      console.log("error delete playlist", error);
      throw error;
    }
  }
}
