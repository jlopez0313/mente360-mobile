import React from "react";
import styles from "./Chat.module.scss";
import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
} from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { getUser } from "@/helpers/onboarding";
import { writeData } from "@/services/realtime-db";
import Avatar from "@/assets/images/avatar.jpg";

export const Chat = () => {
  const history = useHistory();
  const { user } = getUser();

  const goToInterno = async (otroUser: any) => {
    const roomArray = [Number(user.id), Number(otroUser.id)];
    const roomID = roomArray.sort((a, b) => a - b).join("_");

    await writeData("rooms/" + roomID + "/users/" + user.id, {
      id: user.id,
      name: user.name,
      photo: user.photo || "",
      phone: user.phone || "",
    });
    await writeData("rooms/" + roomID + "/users/" + otroUser.id, {
      id: otroUser.id,
      name: otroUser.name,
      photo: otroUser.photo || "",
      phone: otroUser.phone || "",
    });

    await writeData("user_rooms/" + user.id + "/rooms/" + roomID, true);
    await writeData("user_rooms/" + otroUser.id + "/rooms/" + roomID, true);

    history.replace("/chat/" + roomID);
  };

  return (
    <div className={styles["ion-content"]}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        <IonItemGroup>
          <IonSearchbar
            className={`ion-no-padding ion-margin-bottom ${styles["searc"]}`}
            placeholder="Buscar"
            color="warning"
          ></IonSearchbar>

          <IonItem
            button={true}
            className={`ion-margin-bottom ${styles["contact"]}`}
            onClick={() => goToInterno({ id: "20", name: "Prueba" })}
          >
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt=""
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel className="ion-no-margin">
              <span className={styles["name"]}> {"contacto"} </span>
              <span className={styles["phone"]}> {"mensaje"} </span>
            </IonLabel>
          </IonItem>

          <IonItem
            button={true}
            className={`ion-margin-bottom ${styles["contact"]}`}
          >
            <IonAvatar aria-hidden="true" slot="start">
              <img
                alt=""
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonLabel className="ion-no-margin">
              <span className={styles["name"]}> {"GRUPO"} </span>
              <span className={styles["phone"]}> {"mensaje"} </span>
            </IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>
    </div>
  );
};
