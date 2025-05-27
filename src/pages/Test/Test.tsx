import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import { Test as TestComponent } from "@/components/Test/Test";
import { arrowBack } from "ionicons/icons";
import { Link, useHistory } from "react-router-dom";
import styles from "./Test.module.scss";

import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Test: React.FC = () => {
  const { user } = useSelector( (state: any) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const { route } = useSelector((state: any)=> state.route);

  useEffect(() => {

    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace( route );
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch( setShowGlobalAudio( false ) )
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles["ion-header"]}>
          <IonButtons slot="start">
            <Link to={route} replace={true}>
              <IonButton fill="clear" className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <div className={`ion-padding ${styles.title}`}>
            <IonTitle className="ion-text-center">
              {" "}
              Hola, <strong className={styles.name}> {user.name} </strong>{" "}
            </IonTitle>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <IonText className="ion-text-justify">
          Por favor, realiza el test de eneagrama para conocer tu Eneatipo
        </IonText>
        <TestComponent />
      </IonContent>
    </IonPage>
  );
};

export default Test;
