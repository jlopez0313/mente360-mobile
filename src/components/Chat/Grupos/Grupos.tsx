import React, { useEffect, useState } from "react";
import { IonButton, IonIcon, IonItemGroup, IonList } from "@ionic/react";
import { writeData, updateData } from "@/services/realtime-db";
import styles from "./Grupos.module.scss";
import { add } from "ionicons/icons";
import { Modal } from "../../Modal/Modal";
import { Add } from "./Add/Add";
import { create, getAll } from "@/services/grupos";
import { getUser } from "@/helpers/onboarding";
import { onValue } from "firebase/database";
import { readData, getData } from "@/services/realtime-db";

import { useDispatch } from "react-redux";
import { setGrupo } from "@/store/slices/notificationSlice";
import { Item } from "./Item";

export const Grupos = () => {
  const { user } = getUser();

  const dispatch = useDispatch();

  const [grupos, setGrupos] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [unreadList, setUnreadList] = useState<any>([]);

  const addDocument = async (grupo: any) => {
    try {
      const updates = {
        [grupo.id]: true,
      };

      await Promise.all([
        writeData("grupos/" + grupo.id + "/users/" + user.id, {
          name: user.name,
          id: user.id,
          phone: user.phone || "",
          photo: user.photo || "",
        }),

        writeData("grupos/" + grupo.id, {
          grupo: grupo.grupo,
          photo: grupo.photo,
          users: {
            [user.id]: {
              name: user.name,
              id: user.id,
              phone: user.phone || "",
              photo: user.photo || "",
            },
          },
        }),

        updateData(`user_rooms/${user.id}/grupos/`, updates),
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

  const onGetAll = async () => {
    // Escucha los datos de los grupos en tiempo real.
    onValue(readData(`user_rooms/${user.id}/grupos`), async (snapshot) => {
      const data = snapshot.val();

      const rooms = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];

      const tmpGrupos: any[] = [];
      const noLeidos: Record<string, number> = {};
      const mensajes: Record<string, any> = {};

      await Promise.all(
        rooms.map(async (room) => {
          const grupoData = await getData(`grupos/${room.id}`);
          const grupoVal = grupoData.val();

          if (grupoVal) {
            tmpGrupos.push({
              photo: grupoVal?.photo,
              grupo: grupoVal?.grupo,
              id: room.id,
            });

            onValue(readData(`grupos/${room.id}`), (snapshot) => {
              const data2 = snapshot.val();

              const listaMensajes = data2
                ? Object.keys(data2.messages || {}).map((key) => ({
                    id: key,
                    ...data2.messages[key],
                  }))
                : [];

              if (data2?.users?.[user.id]?.exit_time) {
                const targetDate = new Date(data2.users[user.id]?.exit_time);

                const unreads = listaMensajes.filter((message) => {
                  const messageDate = new Date(`${message.date}`);
                  return messageDate > targetDate && message.user.id != user.id;
                });

                noLeidos[room.id] = unreads.length || 0;
              }

              const lastMsg = listaMensajes.pop();
              if (lastMsg) {
                mensajes[room.id] = { ...lastMsg };
              }

              setUnreadList(Object.values(noLeidos));
              setMessages(Object.values(mensajes));
            });
          }
        })
      );

      setGrupos(tmpGrupos);
    });
  };

  const onCheckUnreads = () => {
    const noUnreads = unreadList.every((x) => x === 0);
    if (noUnreads) {
      dispatch(setGrupo(false));
    }
  };

  useEffect(() => {
    onGetAll();
  }, []);

  useEffect(() => {
    onCheckUnreads();
  }, [unreadList]);

  return (
    <div className={styles["ion-content"]}>
      <IonButton id="add" className="ion-margin-bottom" expand="block">
        <IonIcon icon={add} slot="start" />
        Nuevo Grupo Mente Maestra
      </IonButton>

      <IonList className="ion-no-padding" lines="none">
        <IonItemGroup>
          {grupos.map((grupo: any, idx: number) => {
            return (
              <Item
                key={idx}
                idx={idx}
                grupo={grupo}
                messages={messages}
                unreadList={unreadList}
              />
            );
          })}
        </IonItemGroup>
      </IonList>

      <Modal
        trigger="add"
        hideButtons={false}
        onConfirm={(data) => onAddGrupo(data)}
        title="Nuevo Grupo Mente Maestra"
      >
        <Add />
      </Modal>
    </div>
  );
};
