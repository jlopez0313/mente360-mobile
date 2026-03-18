import { queryTo, readData, snapshotToArray } from "@/services/realtime-db";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { setRoom } from "@/store/slices/notificationSlice";
import { setTab } from "@/store/slices/chatSlice";
import { onValue } from "firebase/database";
import { MessageCircle, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Lista = () => {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const listenersRef = useRef<any>({});
  const usersRef = useRef<Record<string, any>>({});

  const [users, setUsers] = useState<any[]>([]);
  const filteredUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aDate = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
      const bDate = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
      return bDate - aDate;
    });
  }, [users]);

  useEffect(() => {
    let unsubRooms: any;

    const onGetRooms = async () => {
      dispatch(setRoom(false));

      unsubRooms = onValue(readData(`users/${user.id}/rooms`), (snapshot) => {
        const rooms = snapshotToArray(snapshot.val());
        rooms.forEach((room: any) => {
          const userInRoom = room.id
            .split("_")
            .find((id: any) => id != user.id);

          if (listenersRef.current[userInRoom]) return;

          const roomID = [Number(user.id), Number(userInRoom)]
            .sort((a, b) => a - b)
            .join("_");

          const updateUserData = (newData: any) => {
            const current = usersRef.current[userInRoom] || { id: userInRoom };
            const updated = { ...current, ...newData };
            usersRef.current[userInRoom] = updated;

            setUsers((prev) => {
              const exists = prev.find((u) => u.id == userInRoom);
              if (exists) {
                return prev.map((u) => (u.id == userInRoom ? updated : u));
              }
              // Only add to list if we have basic user data (not just the last message date)
              if (updated.name) {
                return [...prev, updated];
              }
              return prev;
            });
          };

          const unsubUser = onValue(
            readData(`users/${userInRoom}`),
            (snapshot) => {
              const userData = snapshot.val();
              if (userData) {
                updateUserData(userData);
              }
            }
          );

          const unsubLastMsg = onValue(
            queryTo(`rooms/${roomID}/messages`, { limit: 1, direction: "last" }),
            (snap) => {
              const msgs = snapshotToArray(snap.val());
              if (msgs.length > 0) {
                const lastMsg = msgs[0];
                updateUserData({ lastMessageDate: lastMsg.date });
              }
            }
          );

          listenersRef.current[userInRoom] = () => {
            unsubUser();
            unsubLastMsg();
          };
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

  const content = filteredUsers.length === 0 ? (
    <div className="text-center py-12">
      <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
      <p className="text-muted-foreground">No hay chats</p>
    </div>
  ) : (
    filteredUsers.map((usuario: any) => (
      <Item key={usuario.id} usuario={usuario} />
    ))
  );

  return (
    <>
      {content}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => dispatch(setTab("community"))}
          className="w-14 h-14 !rounded-full shadow-2xl gradient-primary text-primary-foreground !p-0 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <UserPlus className="w-7 h-7" />
        </Button>
      </div>
    </>
  );
};
