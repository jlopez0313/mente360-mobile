import { getArrayData, getData } from "@/services/realtime-db";
import { useEffect, useState } from "react";

import { setRoom } from "@/store/slices/notificationSlice";
import { MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Chat = () => {

  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const onGetRooms = async () => {
      dispatch(setRoom(false));

      const rooms = await getArrayData(`users/${user.id}/rooms`);

      const usuarios: any = [];

      await Promise.all(
        rooms.map(async (room: any, idx: number) => {
          const userInRoom = room.id
            .split("_")
            .find((id: number) => id != user.id);

          const data = await getData(`users/${userInRoom}`);
          const userData = data.val();

          usuarios[idx] = userData;
        })
      );

      setUsers(usuarios);
      setFilteredUsers(usuarios);
    };

    onGetRooms();
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
