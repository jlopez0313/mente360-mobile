import { Modal } from "@/components/Shared/Modal/Modal";
import { create } from "@/services/grupos";
import {
  getArrayData,
  getData,
  readData,
  updateData,
  writeData,
} from "@/services/realtime-db";
import { IonButton, IonIcon, IonItemGroup, IonList } from "@ionic/react";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Add } from "./Add/Add";
import styles from "./Grupos.module.scss";

import { setGrupo } from "@/store/slices/notificationSlice";
import { onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

export const Grupos = () => {
  const { user } = useSelector( (state: any) => state.user);

  const dispatch = useDispatch();

  const [grupos, setGrupos] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [unreadList, setUnreadList] = useState<any>([]);

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

  const onCheckStatus = () => {
    onValue(readData(`users/${user.id}/grupos`), async (snapshot) => {
      onGetAll();
    });
  };

  const onGetAll = async () => {
    const grupos = await getArrayData(`users/${user.id}/grupos`);

    const lista: any = [];

    await Promise.all(
      grupos.map(async (grupo: any, idx: number) => {
        const data = await getData(`grupos/${grupo.id}`);
        const grupoData = data.val();

        lista[idx] = grupoData;
      })
    );

    setGrupos(lista);
  };

  const onCheckUnreads = () => {
    const noUnreads = unreadList.every((x) => x === 0);
    if (noUnreads) {
      dispatch(setGrupo(false));
    }
  };

  useEffect(() => {
    onCheckStatus();
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
            return <Item key={idx} grupo={grupo} />;
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
