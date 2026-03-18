import { create } from "@/services/grupos";
import {
  readData,
  snapshotToArray,
  updateData,
  writeData,
} from "@/services/realtime-db";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { setGrupo } from "@/store/slices/notificationSlice";
import { onValue } from "firebase/database";
import { Plus, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CrearGrupoModal } from "./CrearGrupoModal";
import { Item } from "./Item";

export const Lista = () => {
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const [grupos, setGrupos] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGrupos = useMemo(() => {
    return [...grupos].sort((a, b) => {
      const aDate = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
      const bDate = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
      return bDate - aDate;
    });
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

              const messagesArray = grupoData.messages ? snapshotToArray(grupoData.messages) : [];
              const lastMessageDate = messagesArray.length > 0 
                ? messagesArray[messagesArray.length - 1].date 
                : null;

              const processedGrupo = { ...grupoData, lastMessageDate };

              if (gruposRef.current[grupoData.id]) {
                gruposRef.current[grupoData.id] = {
                  ...gruposRef.current[grupoData.id],
                  ...processedGrupo,
                };

                setGrupos((prev) =>
                  prev.map((u) =>
                    u.id === grupoData.id ? { ...u, ...processedGrupo } : u
                  )
                );

                return;
              }

              gruposRef.current[grupoData.id] = processedGrupo;

              setGrupos((prev: any) => [...prev, processedGrupo]);
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

  return (
    <>
      {filteredGrupos.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No hay grupos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGrupos.map((group: any) => (
            <Item key={group.id} grupo={group} />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 !rounded-full shadow-2xl gradient-primary text-primary-foreground !p-0 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="w-7 h-7" />
        </Button>
      </div>

      <CrearGrupoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddGrupo={onAddGrupo}
      />
    </>
  );
};
