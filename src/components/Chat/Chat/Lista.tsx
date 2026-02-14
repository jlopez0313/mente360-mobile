import { readData, snapshotToArray } from "@/services/realtime-db";
import { useEffect, useMemo, useRef, useState } from "react";

import { setRoom } from "@/store/slices/notificationSlice";
import { onValue } from "firebase/database";
import { MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Lista = () => {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const listenersRef = useRef<any>({});
  const usersRef = useRef<Record<string, any>>({});

  const [users, setUsers] = useState<any[]>([]);
  const filteredUsers = useMemo(() => {
    return users;
  }, [users]);

  useEffect(() => {
    let unsubRooms: any;

    const onGetRooms = async () => {
      dispatch(setRoom(false));

      unsubRooms = onValue(readData(`users/${user.id}/rooms`), (snapshot) => {
        const rooms = snapshotToArray(snapshot.val());
        rooms.forEach((room: any, idx: number) => {
          const userInRoom = room.id
            .split("_")
            .find((id: number) => id != user.id);

          if (listenersRef.current[userInRoom]) return;

          const unsubUser = onValue(
            readData(`users/${userInRoom}`),
            (snapshot) => {
              const userData = snapshot.val();
              if (!userData) return;

              if (usersRef.current[userData.id]) {
                usersRef.current[userData.id] = {
                  ...usersRef.current[userData.id],
                  ...userData,
                };

                setUsers((prev) =>
                  prev.map((u) =>
                    u.id === userData.id ? { ...u, ...userData } : u
                  )
                );

                return;
              }

              usersRef.current[userData.id] = userData;

              setUsers((prev) => [...prev, userData]);
            }
          );

          listenersRef.current[userInRoom] = unsubUser;
        });
      });
    };

    onGetRooms();

    return () => {
      unsubRooms();
      Object.values(listenersRef.current).forEach((unsub: any) => unsub());
      listenersRef.current = {};
      usersRef.current = {};
    };
  }, []);

  return filteredUsers.length === 0 ? (
    <div className="text-center py-12">
      <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-muted-foreground">No hay chats</p>
    </div>
  ) : (
    filteredUsers.map((usuario: any) => (
      <Item key={usuario.id} usuario={usuario} />
    ))
  );
};
