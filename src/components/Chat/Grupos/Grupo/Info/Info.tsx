import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonCol,
  IonFab,
  IonFabButton,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonRow,
  IonText,
} from "@ionic/react";
import { addData, readData } from "@/services/realtime-db";
import styles from "./Info.module.scss";
import { add, addOutline, send, sendOutline } from "ionicons/icons";
import { Modal } from "@/components/Modal/Modal";
import { Add } from "../Add/Add";
import { create, getAll } from "@/services/grupos";
import { useHistory } from "react-router";
import { onValue } from "firebase/database";
import { getUser } from "@/helpers/onboarding";
import { getData } from "@/services/realtime-db";

import Avatar from "@/assets/images/avatar.jpg";

export const Info = ({ grupoID }) => {
  const { user } = getUser();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [grupo, setGrupo] = useState({ grupo: "", photo: "", users: [] });

  const onGetGrupo = async (id: number) => {
    const data = await getData(`grupos/${id}`);
    const grupo = data.val();

    const users: any = grupo.users
      ? Object.keys(grupo.users).map((key) => ({
          id: key,
          ...grupo.users[key],
        }))
      : [];

    setGrupo({ grupo: grupo.grupo, photo: grupo.photo, users: users });
  };

  const onSendMessage = () => {
    const message = {
      user: { id: user.id, photo: user.photo, name: user.name },
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mensaje,
    };
    addData("grupos/" + grupoID + "/messages", message).then(() => {
      setMensaje("");
    });
  };

  useEffect(() => {
    onGetGrupo(grupoID);
  }, [grupoID]);

  return (
    <div className={`${styles["ion-content"]}`}>
      <IonList className={`ion-padding ${styles["chat"]}`} lines="none">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>{grupo.users.length} Miembros</IonLabel>
          </IonItemDivider>

          {grupo.users.map((user: any, idx: number) => {
            return (
              <IonItem key={idx} button={true} className={`ion-margin-bottom ${styles["message"]}`}>
                <IonAvatar aria-hidden="true" slot="start">
                  <img
                    alt=""
                    src={user.photo ? baseURL + user.photo : Avatar}
                  />
                </IonAvatar>

                <IonLabel className="ion-no-margin">
                  <span className={styles["name"]}> {user.name} </span>
                  <span className={styles["phone"]}> {user.phone} </span>
                </IonLabel>
                
              </IonItem>
            );
          })}
        </IonItemGroup>
      </IonList>

      <IonFab vertical="bottom" horizontal="end">
        <IonFabButton id="modal-add">
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>

      <Modal
        trigger="modal-add"
        title="Agregar Miembro"
        hideButtons={true}
      >
        <Add users={grupo.users} />
      </Modal>
    </div>
  );
};
