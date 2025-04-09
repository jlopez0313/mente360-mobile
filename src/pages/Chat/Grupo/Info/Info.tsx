import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import styles from "./Info.module.scss";

import { IonIcon } from "@ionic/react";
import {
  arrowBack
} from "ionicons/icons";

import { Info as InfoComponent } from "@/components/Chat/Grupos/Grupo/Info/Info";
import { Footer } from "@/components/Footer/Footer";
import { Link, useHistory, useParams } from "react-router-dom";

import { getData } from "@/services/realtime-db";
import { useEffect, useRef, useState } from "react";

const Info: React.FC = () => {
  const { id } = useParams();

  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);

  const [grupo, setGrupo] = useState({ grupo: "", photo: "" });
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);

  const onGetGrupo = async (id: number) => {
    const data = await getData(`grupos/${id}`);
    const grupo = data.val();
    setGrupo({ grupo: grupo.grupo, photo: grupo.photo });
  };

  const dismiss = () => {
    modal.current?.dismiss();
  };

  const goToDetalle = () => {
    history.replace("");
  };

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace("/grupo/" + id);
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history, id]);

  useEffect(() => {
    onGetGrupo(id);
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to={"/grupo/" + id} replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-justify">
            Info. del Grupo
          </IonTitle>
          
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-no-padding ${styles["ion-content"]}`}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>

        <InfoComponent grupoID={id} />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Info;
