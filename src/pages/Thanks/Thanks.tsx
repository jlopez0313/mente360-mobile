import { Thanks as ThanksComponent } from "@/components/Thanks/Thanks";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from './Thanks.module.scss';
const Thanks = () => {
    const history = useHistory();

    useEffect(() => {
      const handleBackButton = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        history.replace("/home");
      };
  
      document.addEventListener("ionBackButton", handleBackButton);
  
      return () => {
        document.removeEventListener("ionBackButton", handleBackButton);
      };
    }, [history]);

  return (
    <IonPage>
        <IonHeader>
        <IonToolbar className={styles['ion-header']}>
          <IonButtons slot="start">
            <Link to='/home' replace={true}>
              <IonButton fill="clear"  className={styles.backButton}>
                <IonIcon slot="start" icon={arrowBack} />
              </IonButton>
            </Link>
          </IonButtons>

          <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Gracias! </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={`${styles['ion-content']}`}>

        <ThanksComponent />

      </IonContent>
    </IonPage>
  );
};

export default Thanks;
