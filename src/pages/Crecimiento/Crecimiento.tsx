import Avatar from "@/assets/images/avatar.jpg";
import { Crecimiento as CrecimientoComponent } from "@/components/Crecimiento/Crecimiento";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./Crecimiento.module.scss";

import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { Link, useHistory, useParams } from "react-router-dom";

import { destroy } from "@/helpers/musicControls";
import { db } from "@/hooks/useDexie";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Crecimiento: React.FC = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { id } = useParams<any>();
  const dispatch = useDispatch();
  const history = useHistory();

  const canal = useLiveQuery(() =>
    db.canales.where("id").equals(Number(id)).first()
  );

  const goToLider = () => {
    if (canal?.comunidad?.lider?.id)
      history.replace(`/lider/${canal.comunidad?.lider?.id}/${canal.id}`);
  };

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace(`/comunidades/${canal?.comunidad?.id}/canales`);
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch(setShowGlobalAudio(true));

    return () => {
      destroy();
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to={`/comunidades/${canal?.comunidad?.id}/canales`} replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle class="ion-no-padding ion-padding-end ion-text-left">
            {" "}
            <IonItem lines="none" className={`${styles["canal"]}`}>
              <div className={styles["info"]}>
                <IonText className={styles["canal"]}> {canal?.canal} </IonText>
                <IonText className={styles["lider"]}>
                  {" "}
                  {canal?.comunidad?.lider?.name}{" "}
                </IonText>
              </div>
              <IonAvatar slot="end" onClick={goToLider}>
                <img alt=""  src={canal?.comunidad?.lider?.photo ? baseURL + canal?.comunidad?.lider?.photo : Avatar} />
              </IonAvatar>
            </IonItem>{" "}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        <CrecimientoComponent />
      </IonContent>

    </IonPage>
  );
};

export default Crecimiento;
