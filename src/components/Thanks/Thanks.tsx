import successAnim from "@/assets/json/successful-animation.json";
import { IonButton, IonText } from "@ionic/react";
import Lottie from "lottie-react";
import { useHistory } from "react-router";
import styles from "./Thanks.module.scss";

export const Thanks: React.FC<any> = () => {
  const history = useHistory();

  const goToHome = () => {
    history.replace("/home");
  };
  return (
    <div className={`ion-padding ${styles["content"]}`}>
      <Lottie
        animationData={successAnim}
        loop={true}
        style={{ width: 240, height: 120 }}
      />
      <strong className={styles["mb-high"]}>
        ¡Gracias por unirte a {import.meta.env.VITE_NAME}!
      </strong>

      <IonText className={styles["mb-high"]}>
        Tu viaje de transformación personal comienza ahora.
      </IonText>

      <IonButton onClick={goToHome}>Empezar Ahora!</IonButton>
    </div>
  );
};
