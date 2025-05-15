import {
    IonContent,
    IonPage
} from "@ionic/react";

import styles from "./Welcome.module.scss";

import { Welcome as WelcomeComponent } from "@/components/Welcome/Welcome";


const Welcome: React.FC = () => {
    return (
        <IonPage>

            <IonContent className={`${styles["ion-content"]}`}>
                <div className={`ion-padding ${styles.content}`}>
                    <WelcomeComponent />
                </div>
            </IonContent>


        </IonPage >
    );
};

export default Welcome;
