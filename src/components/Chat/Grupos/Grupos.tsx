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

export const Grupos = () => {
  const history = useHistory();
  const { user } = getUser();

  const [grupos, setGrupos] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_BACK;

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
    const {
      data: { data },
    } = await getAll();
    setGrupos(data);
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
                className={`ion-margin-bottom ${styles["contact"]}`}
                onClick={() => goToGrupo(grupo.id)}
              >
                <IonAvatar aria-hidden="true" slot="start">
                  <img alt="" src={baseURL + grupo.photo} />
                </IonAvatar>
                <IonLabel className="ion-no-margin">
                  <span className={styles["name"]}> {grupo.grupo} </span>
                  <span className={styles["phone"]}> {"mensaje"} </span>
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
