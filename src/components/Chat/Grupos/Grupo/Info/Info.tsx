import { Modal } from "@/components/Shared/Modal/Modal";
import { getData } from "@/services/realtime-db";
import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonItemDivider,
    IonItemGroup,
    IonLabel,
    IonList,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Add } from "../Add/Add";
import styles from "./Info.module.scss";

import { Item } from "./Item";

export const Info = ({ grupoID }) => {
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
            return <Item key={idx} user={user} />;
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
        onWillDismiss={() => {
          onGetGrupo(grupoID);
        }}
      >
        <Add grupoID={grupoID} users={grupo.users} />
      </Modal>
    </div>
  );
};
