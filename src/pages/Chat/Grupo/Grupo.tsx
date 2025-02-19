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
import { Grupo as GrupoComponent } from "@/components/Chat/Grupos/Grupo/Grupo";
import { Link, useHistory, useParams } from "react-router-dom";

import { useEffect, useRef, useState } from "react";
import { getData, writeData, removeData } from "@/services/realtime-db";
import { getUser } from "@/helpers/onboarding";
import Avatar from "@/assets/images/avatar.jpg";

const Grupo: React.FC = () => {
  const { id } = useParams();
  const { user } = getUser();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);

  const [removed, setRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [grupo, setGrupo] = useState({ grupo: "", photo: "", users: [] });
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

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

  const dismiss = () => {
    modal.current?.dismiss();
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
    await removeData(`user_rooms/${user.id}/grupos/${id}`);
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

          <IonTitle className="ion-no-padding ion-padding-end ion-text-justify ion-padding-start">
            {" "}
            {grupo.grupo}{" "}
          </IonTitle>

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
