import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { Test as TestComponent } from "@/components/Test/Test";
import styles from "./Test.module.scss";
import { Link, useHistory } from "react-router-dom";
import { arrowBack } from "ionicons/icons";

import UIContext from "@/context/Context";
import { useContext, useEffect } from "react";
import { getUser } from "@/helpers/onboarding";
import { useDispatch, useSelector } from "react-redux";
import { setShowGlobalAudio } from "@/store/slices/audioSlice";

const Test: React.FC = () => {
  const { user } = getUser();
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
            <IonText className="ion-text-center">
              Por favor, realiza el test de eneagrama para conocer tu Eneatipo
            </IonText>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`ion-padding ${styles["ion-content"]}`}>
        <TestComponent />
      </IonContent>
    </IonPage>
  );
};

export default Test;
