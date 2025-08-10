import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { useEffect, useState } from "react";
import { SQLiteDBConnection } from "react-sqlite-hook";


import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";

let globalSQLite: SQLiteConnection | null = null;
let globalDB: SQLiteDBConnection | null = null;

export const useSqliteDB = () => {
  const [initialized, setInitialized] = useState<boolean>(false);

  const initializeDB = async (): Promise<SQLiteDBConnection> => {
    try {
      if (!globalSQLite) {
        globalSQLite = new SQLiteConnection(CapacitorSQLite);
      }

      if (Capacitor.getPlatform() === "web") {
        await globalSQLite.initWebStore();
      }

      const dbName = import.meta.env.VITE_DB_NAME;
      // const ret = await globalSQLite.checkConnectionsConsistency();
      const isConn = (await globalSQLite.isConnection(dbName, false)).result;

      if (
        // ret.result &&
        isConn
      ) {
        try {
          globalDB = await globalSQLite.retrieveConnection(dbName, false);
          if ((await globalDB.isDBOpen()).result === false) {
            console.log("DB is opening on line 50");
            await globalDB.open();
          }
        } catch (err) {
          console.warn(
            "Error al recuperar conexión existente, recreando...",
            err
          );
          await globalSQLite.closeConnection(dbName, false);
          globalDB = await globalSQLite.createConnection(
            dbName,
            false,
            "no-encryption",
            1,
            false
          );
          console.log("DB is opening on line 69");
          await globalDB.open();
        }
      } else {
        globalDB = await globalSQLite.createConnection(
          dbName,
          false,
          "no-encryption",
          1,
          false
        );

        console.log("DB is opening on line 80");
        await globalDB.open();
      }

      return globalDB;
    } catch (error) {
      console.log("error initialize DB", error);
      throw error;
    }
  };

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | null) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      if (globalDB && !(await globalDB.isDBOpen()).result) {
        console.log("DB is opening");
        await globalDB.open();
        console.log("DB has been opened");
      }

      globalDB && (await action(globalDB));
    } catch (error) {
      console.error("Error en performSQLAction:", error);
      alert((error as Error).message);
      throw error;
    } finally {
      try {
        cleanup && (await cleanup());
      } catch (error) {
        console.error("Error en cleanup:", error);
        throw error;
      }
    }
  };

  const initializeTables = async (db: SQLiteDBConnection | null) => {
    try {
      /*
      const user = new User(db);
      const clips = new Clips(db);
      const categorias = new Categorias(db);
      const usuariosClips = new UsuariosClips(db);
      const likes = new Likes(db);
      const niveles = new Niveles(db);
      const crecimientos = new Crecimientos(db);
      const playlist = new Playlist(db);
      const eneatipos = new Eneatipos(db);
      const generos = new Generos(db);
      const audios = new Audios(db);
      const mensajes = new Mensajes(db);
      const tareas = new Tareas(db);

      await user.init();
      await clips.init();
      await categorias.init();
      await usuariosClips.init();
      await likes.init();
      await niveles.init();
      await crecimientos.init();
      await playlist.init();
      await eneatipos.init();
      await generos.init();
      await audios.init();
      await mensajes.init();
      await tareas.init();
*/
      console.log("tables has been initialized");
    } catch (error) {
      console.log(`Error ${error} creating Tables`);
      throw error;
    }
  };

  const makeBackup = async () => {
    try {
      const dbFileName = `${import.meta.env.VITE_DB_NAME}SQLite.db`;
      const sourcePath = `../databases/${dbFileName}`;
      const targetPath = `Download/${dbFileName}`;

      try {
        await Filesystem.deleteFile({
          path: targetPath,
          directory: Directory.ExternalStorage,
        });
        console.log("Archivo anterior eliminado.");
      } catch {
        console.log("No se encontró archivo previo, continuando...");
      }

      await Filesystem.copy({
        from: sourcePath,
        directory: Directory.Data,
        to: targetPath,
        toDirectory: Directory.ExternalStorage,
      });

      console.log("Base de datos copiada correctamente en Descargas.");
    } catch (error) {
      console.error("Error copiando la base de datos:", error);
      throw error;
    }
  };

  const exportJson = async () => {
    try {
      if (!globalDB || !(await globalDB.isDBOpen()).result) {
        throw new Error("La base de datos no está abierta");
      }

      await requestPermissions();
      const dbExport = await globalDB.exportToJson("full");

      if (dbExport?.export?.database) {
        console.log(
          "Contenido exportado:",
          JSON.stringify(dbExport.export, null, 2)
        );

        const targetPath = "db_backup.json";

        try {
          await Filesystem.deleteFile({
            path: targetPath,
            directory: Directory.Data,
          });
          console.log("Archivo anterior eliminado.");
        } catch {
          console.log("No se encontró archivo previo, continuando...");
        }

        await Filesystem.writeFile({
          path: targetPath,
          data: JSON.stringify(dbExport.export, null, 2),
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });

        await Filesystem.copy({
          from: targetPath,
          directory: Directory.Data,
          to: 'Download/' + targetPath,
          toDirectory: Directory.Documents,
        });

        console.log("Base de datos exportada con éxito");
      } else {
        console.error("No se pudo exportar la base de datos");
      }
    } catch (error) {
      console.error("Error exportando la base de datos:", error);
      throw error;
    }
  };

  const requestPermissions = async () => {
    const info = await Device.getInfo();

    if (info.platform === "android") {
      const permResult = await Filesystem.requestPermissions();
      console.log("Permisos solicitados:", permResult);
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        const dbInstance = await initializeDB();
        await initializeTables(dbInstance);
        setInitialized(true);
      } catch (error) {
        console.error("Error inicializando la base de datos:", error);
      }
    };

    setup();

    return () => {
      const closeDB = async () => {
        /*if (globalDB && (await globalDB.isDBOpen()).result) {
          await globalDB.close();
          console.log("Base de datos cerrada correctamente");
        }*/
      };
      closeDB();
    };
  }, []);

  return {
    db: globalDB,
    initialized,
    performSQLAction,
    makeBackup,
    exportJson,
  };
};
