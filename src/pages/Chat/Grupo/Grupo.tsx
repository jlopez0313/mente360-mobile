import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabList,
  IonGrid,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonPopover,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Grupo.module.scss";

import { IonFab, IonFabButton, IonIcon } from "@ionic/react";
import {
  arrowBack,
  ellipsisVertical,
  ellipsisVerticalOutline,
  search,
  shareSocialOutline,
} from "ionicons/icons";

import { Footer } from "@/components/Footer/Footer";
import { Comunidad as ComunidadComponent } from "@/components/Chat/Comunidad/Comunidad";
import { Chat as ChatComponent } from "@/components/Chat/Chat/Chat";
import { Grupo as GrupoComponent } from "@/components/Chat/Grupos/Grupo/Grupo";
import { Link, useHistory, useParams } from "react-router-dom";

import UIContext from "@/context/Context";
import { useContext, useEffect, useRef, useState } from "react";
import { find } from "@/services/grupos";
import { getData } from "@/services/realtime-db";
import Avatar from "@/assets/images/avatar.jpg";

const Grupo: React.FC = () => {
  const { id } = useParams();
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);

  const [grupo, setGrupo] = useState({ grupo: "", photo: "", users: [] });
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  const onGetGrupo = async (id: number) => {
    const data = await getData(`grupos/${id}`);
    const grupo = data.val();

    const users: any = grupo.users
      ? Object.keys(grupo.users).map((key) => ({ id: key, ...grupo.users[key] }))
      : [];

    setGrupo({ grupo: grupo.grupo, photo: grupo.photo, users: users });
  };

  const dismiss = () => {
    modal.current?.dismiss();
  };

  const goToDetalle = () => {
    history.replace("/grupo/info/" + id);
  };

  useEffect(() => {
    onGetGrupo(id);
  }, [id]);

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
            <img alt="" src={grupo.photo ? baseURL + grupo.photo : Avatar} />
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

        <GrupoComponent grupoID={id} />
      </IonContent>

      <IonPopover trigger="popover-button" dismissOnSelect={true}>
        <IonContent>
          <IonList lines="none">
            <IonItem button={true} detail={false} onClick={goToDetalle}>
              {grupo.users.length} Usuarios
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      <Footer />
    </IonPage>
  );
};

export default Grupo;
