import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
} from "@ionic/react";
import { writeData, updateData } from "@/services/realtime-db";
import styles from "./Grupos.module.scss";
import { add } from "ionicons/icons";
import { Modal } from "../../Modal/Modal";
import { Add } from "./Add/Add";
import { create, getAll } from "@/services/grupos";
import { useHistory } from "react-router";
import { getUser } from "@/helpers/onboarding";
import { onValue } from "firebase/database";
import { readData, getData } from "@/services/realtime-db";

export const Grupos = () => {
  const history = useHistory();
  const { user } = getUser();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [grupos, setGrupos] = useState([]);
  const [messages, setMessages] = useState([]);

  const addDocument = (grupo: any) => {
    const updates = {};
    updates[`user_rooms/${user.id}/grupos/${grupo.id}`] = true;
    updateData(updates);

    writeData("grupos/" + grupo.id + "/users/" + user.id, {
      name: user.name,
      id: user.id,
      phone: user.phone || "",
      photo: user.photo || "",
    });
    writeData("grupos/" + grupo.id, { grupo: grupo.grupo, photo: grupo.photo });
  };

  const onAddGrupo = async (grupo: any) => {
    try {
      const {
        data: { data },
      } = await create(grupo);
      addDocument(data);
      onGetAll();
    } catch (e) {
      console.error(e);
    }
  };

  const onGetAll = async () => {
    onValue(readData(`user_rooms/${user.id}/grupos`), (snapshot) => {
      const data = snapshot.val();

      const rooms: any = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];

      rooms.forEach(async (room, idx) => {
        const data = await getData(`grupos/${room.id}`);
        const val = data.val();

        const grupo = {
          photo: val.photo,
          grupo: val.grupo,
          id: room.id,
        };
        setGrupos((grupos) => [...grupos, grupo]);

        onValue(readData(`grupos/${room.id}/messages`), (snapshot) => {
          const data2 = snapshot.val();

          const listaMensajes: any = data2
            ? Object.keys(data2).map((key) => ({
                id: key,
                ...data2[key],
              }))
            : [];

          const lastMsg = listaMensajes.slice(-1);

          const mensajes = [...messages];
          mensajes[idx] = lastMsg[0];

          setMessages(mensajes);
        });
      });
    });
  };

  const goToGrupo = (id: number) => {
    const updates = {};
    updates[`user_rooms/${user.id}/grupos/${id}`] = true;
    updateData(updates);

    history.replace(`/grupo/${id}`);
  };

  useEffect(() => {
    onGetAll();
  }, []);

  return (
    <div className={styles["ion-content"]}>
      <IonButton
        id="add"
        className="ion-margin-bottom"
        shape="round"
        expand="block"
      >
        <IonIcon icon={add} slot="start" />
        Nuevo Grupo Mente Maestra
      </IonButton>

      <IonList className="ion-no-padding" lines="none">
        <IonItemGroup>
          {grupos.map((grupo: any, idx: number) => {
            return (
              <IonItem
                key={idx}
                button={true}
                className={`${styles["grupo"]}`}
                onClick={() => goToGrupo(grupo.id)}
              >
                <IonAvatar aria-hidden="true" slot="start">
                  <img alt="" src={baseURL + grupo.photo} />
                </IonAvatar>
                <IonLabel className="ion-no-margin">
                  <span className={styles["name"]}> {grupo.grupo} </span>
                  <span className={styles["phone"]}>
                    {messages[idx] && (
                      <>
                        {messages[idx]?.user?.id == user.id
                          ? "tu"
                          : messages[idx]?.user?.name}
                        : {messages[idx]?.mensaje}{" "}
                      </>
                    )}{" "}
                  </span>
                </IonLabel>
              </IonItem>
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
