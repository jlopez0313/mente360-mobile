import { getArrayData, getData } from "@/services/realtime-db";
import { IonItemGroup, IonList, IonSearchbar } from "@ionic/react";
import { useEffect, useState } from "react";

import { setRoom } from "@/store/slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Chat.module.scss";
import { Item } from "./Item";

export const Chat = () => {

  const { user } = useSelector( (state: any) => state.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

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

  const onSearchUser = (word: string) => {
    if (word) {
      const lista = users.filter((u: any) =>
        u.name.toLowerCase().includes(word.toLowerCase())
      );
      setFilteredUsers([...lista]);
    } else {
      setFilteredUsers([...users]);
    }
  };

  useEffect(() => {
    onGetRooms();
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {" "}
        <IonItemGroup>
          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["search"]}`}
            placeholder="Buscar"
            color="warning"
            onIonInput={(e: any) => onSearchUser(e.target.value)}
          ></IonSearchbar>

          {filteredUsers.map((usuario, idx) => {
            return usuario && <Item key={idx} usuario={usuario} />;
          })}
        </IonItemGroup>
      </IonList>
    </div>
  );
};
