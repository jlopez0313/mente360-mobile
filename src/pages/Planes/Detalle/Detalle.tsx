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

import styles from "./Detalle.module.scss";

import { Detalle as DetalleComponent } from "@/components/Payment/Detalle/Detalle";
import { arrowBack } from "ionicons/icons";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";


const Detalle: React.FC = () => {
    const history = useHistory();

    useEffect(() => {
        const handleBackButton = (ev: Event) => {
            ev.preventDefault();
            ev.stopPropagation();
            history.replace("/planes");
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
                        <Link to="/planes" replace={true}>
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
                    <DetalleComponent />
                </div>
            </IonContent>


        </IonPage >
    );
};

export default Detalle;
