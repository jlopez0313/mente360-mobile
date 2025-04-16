import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonPopover,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Grupo.module.scss";

import { IonIcon } from "@ionic/react";
import { arrowBack, ellipsisVerticalOutline } from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Link, useHistory, useParams } from "react-router-dom";

import Avatar from "@/assets/images/avatar.jpg";
import { getUser } from "@/helpers/onboarding";
import { readData, removeData, snapshotToArray, writeData } from "@/services/realtime-db";
import { onValue } from "firebase/database";
import { useEffect, useState } from "react";

import { Grupo as GrupoComponent } from "@/components/Chat/Grupos/Grupo/Grupo";

const Grupo: React.FC = () => {
  const { id } = useParams();
  const { user } = getUser();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();

  const [removed, setRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);

  const [grupo, setGrupo] = useState({ grupo: "", photo: "" });

  const onGetGrupo = async (id: number) => {
    onValue(readData(`grupos/${id}`), async (snapshot) => {
      const data = snapshot.val();

      setGrupo({
        ...data,
        users: snapshotToArray(data.users),
        messages: snapshotToArray(data.messages)
      });

      const users: any = data ? snapshotToArray(data.users) : [];

      const isWriting = users.find(
        (usario: any) => usario.writing && usario.id != user.id
      );
      setIsWriting(isWriting ?? false);

    });
  };

  const goToDetalle = () => {
    history.replace("/grupo/info/" + id);
  };

  const onEnter = async () => {
    await writeData(`grupos/${id}/users/${user.id}/exit_time`, null);
  };

  const onExit = async () => {
    await Promise.all([
      writeData(`grupos/${id}/users/${user.id}/writing`, false),
      writeData(
        `grupos/${id}/users/${user.id}/exit_time`,
        new Date().toISOString()
      ),
    ]);
  };

  const onExitGroup = async () => {
    await removeData(`users/${user.id}/grupos/${id}`);
    setRemoved(true);
  };

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/chat");
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    onGetGrupo(id);
  }, [id]);

  useEffect(() => {
    onEnter();

    return () => {
      onExit();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to="/chat" replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonAvatar
            aria-hidden="true"
            slot="start"
            className={styles["avatar"]}
          >
            {isLoading && (
              <IonSkeletonText
                animated
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                }}
              />
            )}
            <img
              alt=""
              src={grupo.photo ? baseURL + grupo.photo : Avatar}
              style={{ display: isLoading ? "none" : "block" }}
              onLoad={() => setIsLoading(false)}
            />
          </IonAvatar>

          <div className={styles["title-container"]}>
            <IonTitle className="title">{grupo.grupo}</IonTitle>{" "}
            {isWriting ? (
              <span className={styles["status"]}>Escribiendo...</span>
            ) : null}{" "}
          </div>

          <IonButtons slot="end">
            <IonButton id="popover-button">
              <IonIcon
                slot="icon-only"
                icon={ellipsisVerticalOutline}
              ></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-no-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>

        <GrupoComponent removed={removed} grupo={grupo} grupoID={id} />
      </IonContent>

      <IonPopover trigger="popover-button" dismissOnSelect={true}>
        <IonContent>
          <IonList lines="none">
            <IonItem button={true} detail={false} onClick={goToDetalle}>
              Añadir Miembros
            </IonItem>
            <IonItem button={true} detail={false} onClick={onExitGroup}>
              Salir del Grupo
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      <Footer />
    </IonPage>
  );
};

export default Grupo;
