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

  import {Test as TestComponent} from "@/components/Test/Test";
  import styles from "./Test.module.scss";
import { Link } from "react-router-dom";
import { arrowBack } from "ionicons/icons";
  
  const Test: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar className={styles['ion-header']}>
            <IonButtons slot="start">
              <Link to='/home'>
                <IonButton fill="clear"  className={styles.backButton}>
                  <IonIcon slot="start" icon={arrowBack} />
                </IonButton>
              </Link>
            </IonButtons>

            <div className={`ion-padding ${styles.title}`}>

                <IonTitle className="ion-text-center"> Hola, <strong className={styles.name}> Leonardo </strong> </IonTitle>
                <IonText className="ion-text-center">
                    Por favor, realiza el test de eneagrama para conocer tu Eneatipo
                </IonText>
            </div>

          </IonToolbar>
        </IonHeader>
  
        <IonContent fullscreen className={`ion-padding ${styles['ion-content']}`}>
          <TestComponent />
        </IonContent>
      </IonPage>
    );
  };
  
  export default Test;
  