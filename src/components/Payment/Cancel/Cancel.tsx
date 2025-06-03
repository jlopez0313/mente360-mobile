import Sad from "@/assets/images/sad.png";
import { diferenciaRealEnDias } from "@/helpers/Fechas";
import { usePayment } from "@/hooks/usePayment";
import { IonButton, IonImg } from "@ionic/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Cancel.module.scss";

export const Cancel = ({ onClose, onConfirm }: any) => {
  const { payment_status } = usePayment();
  const { user } = useSelector((state: any) => state.user);

  const [diasLeft, setDiasLeft] = useState(0);

  useEffect(() => {
    const onGetDiasVence = () => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const fechaVence = new Date(user.fecha_vencimiento);
      const diasHastaVence = diferenciaRealEnDias(now, fechaVence);

      setDiasLeft(diasHastaVence);
    };

    onGetDiasVence();
  }, []);

  return (
    <>
      <div className={`${styles["img-content"]}`}>
        <IonImg src={Sad} style={{ height: "100px" }} />
      </div>
      <div className="ion-padding-start ion-padding-end ion-text-left">
        Aún te quedan <strong> {diasLeft} días { payment_status == 'trial' ? 'gratuitos' : '' } </strong> para disfrutar de todos los
        beneficios de mente360 sin costo.
        <br />
        <ul>
          <li>Audios personalizados para tu mente y emociones.</li>
          <li>Tareas prácticas según tu personalidad.</li>
          <li>Música de bienestar y frases adaptadas</li>
        </ul>
        Nuestro Objetivo es apoyarte en tu transformación. ¿Quieres pensarlo un
        poco mas?
        <br />
      </div>

      <div className="ion-padding">
        <IonButton
          expand="block"
          className="ion-margin-bottom"
          onClick={onClose}
        >
          {" "}
          Quiero Seguir Disfrutando{" "}
        </IonButton>
        <IonButton
            className={styles['cancel-btn']}
          expand="block"
          color="danger"
          onClick={onConfirm}
        >
          {" "}
          Cancelar mi suscripción{" "}
        </IonButton>
      </div>
    </>
  );
};
