import { create } from "@/services/grupos";
import {
  readData,
  snapshotToArray,
  updateData,
  writeData,
} from "@/services/realtime-db";
import { useEffect, useMemo, useRef, useState } from "react";

import { setGrupo } from "@/store/slices/notificationSlice";
import { onValue } from "firebase/database";
import { Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Lista = () => {
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const [grupos, setGrupos] = useState<any>([]);

  const filteredGrupos = useMemo(() => {
    return grupos;
  }, [grupos]);

  const listenersRef = useRef<any>({});
  const gruposRef = useRef<Record<string, any>>({});

  const addDocument = async (grupo: any) => {
    try {
      const updates = {
        [grupo.id]: true,
      };

      delete grupo.usuario;

      await Promise.all([
        writeData("grupos/" + grupo.id, grupo),
        writeData("grupos/" + grupo.id + "/users/" + user.id, {
          writing: false,
        }),
        updateData(`users/${user.id}/grupos/`, updates),
      ]);
    } catch (error) {
      console.error("Error al añadir el grupo:", error);
    }
  };

  const onAddGrupo = async (grupo: any) => {
    try {
      const {
        data: { data },
      } = await create(grupo);

      addDocument(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let unsubRooms: any;

    const onGetAll = async () => {
      dispatch(setGrupo(false));

      unsubRooms = onValue(readData(`users/${user.id}/grupos`), (snapshot) => {
        const rooms = snapshotToArray(snapshot.val());
        rooms.forEach((room: any) => {
          if (listenersRef.current[room.id]) return;

          const unsubUser = onValue(
            readData(`grupos/${room.id}`),
            (snapshot) => {
              const grupoData = snapshot.val();
              if (!grupoData) return;

              if (gruposRef.current[grupoData.id]) {
                gruposRef.current[grupoData.id] = {
                  ...gruposRef.current[grupoData.id],
                  ...grupoData,
                };

                setGrupos((prev) =>
                  prev.map((u) =>
                    u.id === grupoData.id ? { ...u, ...grupoData } : u
                  )
                );

                return;
              }

              gruposRef.current[grupoData.id] = grupoData;

              setGrupos((prev: any) => [...prev, grupoData]);
            }
          );

          listenersRef.current[room.id] = unsubUser;
        });
      });
    };

    onGetAll();

    return () => {
      unsubRooms();
      Object.values(listenersRef.current).forEach((unsub: any) => unsub());
      listenersRef.current = {};
      gruposRef.current = {};
    };
  }, []);

  return filteredGrupos.length === 0 ? (
    <div className="text-center py-12">
      <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-muted-foreground">No hay grupos</p>
    </div>
  ) : (
    filteredGrupos.map((group: any, index: number) => (
      <Item key={index} grupo={group} />
    ))
  );
};
