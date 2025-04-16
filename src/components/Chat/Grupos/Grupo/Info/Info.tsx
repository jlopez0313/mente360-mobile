import { Modal } from "@/components/Shared/Modal/Modal";
import { getData, readData, snapshotToArray } from "@/services/realtime-db";
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

import { onValue } from "firebase/database";
import { Item } from "./Item";

export const Info = ({ grupoID }) => {
  const [users, setUsers] = useState<any>([]);

  const onGetGrupo = async (id: number) => {
    onValue(readData(`grupos/${id}/users/`), async (snapshot) => {
      const users = snapshotToArray(snapshot.val());

      const listaUsuarios: any = [];

      setUsers([]);

      await Promise.all(
        users.map(async (user: any, idx: number) => {
          const data = await getData(`users/${user.id}`);
          const userData = data.val();

          listaUsuarios.push(userData);
        })
      );

      setUsers([...listaUsuarios]);
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
            <IonLabel>{users.length} Miembros</IonLabel>
          </IonItemDivider>

          {users.map((user: any, idx: number) => {
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
        onWillDismiss={() => {}}
        onConfirm={() => {}}
      >
        <Add grupoID={grupoID} users={users} />
      </Modal>
    </div>
  );
};
