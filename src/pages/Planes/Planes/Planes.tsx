import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";

import styles from "./Planes.module.scss";

import { Planes as PlanesComponent } from "@/components/Payment/Planes/Planes";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";


const Planes: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        const handleBackButton = (ev: Event) => {
            ev.preventDefault();
            ev.stopPropagation();
            history.replace("/perfil");
        };

        document.addEventListener("ionBackButton", handleBackButton);

        return () => {
            document.removeEventListener("ionBackButton", handleBackButton);
        };
    }, [history]);

    return (
        <IonPage>

            <IonHeader className={styles["ion-header"]}>
                <IonToolbar className={styles["ion-toolbar"]}>
                    <IonButtons slot="start">
                        <Link to="/perfil" replace={true}>
                            <IonButton fill="clear" className={styles.backButton}>
                                <IonIcon slot="start" icon={arrowBack} />
                            </IonButton>
                        </Link>
                    </IonButtons>

                    <IonTitle className="ion-no-padding ion-padding-end ion-text-center"> Planes </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className={`${styles["ion-content"]}`}>
                <div className={`ion-padding ${styles.content}`}>
                    <PlanesComponent />
                </div>
            </IonContent>


        </IonPage >
    );
};

export default Planes;
