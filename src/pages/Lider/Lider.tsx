import Avatar from "@/assets/images/avatar.jpg";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { Footer } from "@/components/Footer/Footer";
import { Lider as LiderComponent } from "@/components/Lider/Lider";
import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import styles from "./Lider.module.scss";

const Lider: React.FC = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const { canal } = useParams<any>();

  const objCanal = useLiveQuery(
    () => db.canales.where("id").equals(Number(canal)).first(),
    [canal]
  );

  useEffect(() => {
    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace(`/crecimiento/${canal}`);
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to={`/crecimiento/${canal}`} replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center">
            <IonItem lines="none" className={`${styles["canal"]}`}>
              <div className={styles["info"]}>
                <IonText className={styles["lider"]}>
                  {" "}
                  {objCanal?.lider?.name}{" "}
                </IonText>
              </div>
              <IonAvatar slot="end">
                <img
                  alt=""
                  src={
                    objCanal?.lider?.photo ? baseURL + objCanal?.lider?.photo : Avatar
                  }
                />
              </IonAvatar>
            </IonItem>{" "}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={styles["ion-content"]}>
        <LiderComponent />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Lider;
