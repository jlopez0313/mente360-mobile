import { IonButton, IonText, useIonLoading } from "@ionic/react";

import { useNetwork } from "@/hooks/useNetwork";
import { trial } from "@/services/user";
import { setUser } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Buttons.module.scss";

export const Buttons = () => {
  const { user } = useSelector((state: any) => state.user);

  const history = useHistory();
  const network = useNetwork();
  const dispatch = useDispatch();
  const [present, dismiss] = useIonLoading();

  const goToDetalle = async () => {
    history.replace("/planes/detalle");
  };

  const onStartFreeTrial = async () => {
    try {
      await present({
        message: "Cargando...",
        duration: 3000,
      });

      const {
        data: { data: user },
      } = await trial();
      dispatch(setUser({ ...user }));

      dismiss();
      history.replace('/thanks')
    } catch (error) {
      console.log("Error onStartFreeTrial", error);
    }
  };
  return (
    <div className={`${styles["content"]}`}>
      <IonButton
        className={`ion-margin-bottom ${styles["all-planes"]}`}
        onClick={goToDetalle}
      >
        Ver todos los planes
      </IonButton>

      {user.fecha_vencimiento ? null : (
        <>
          <IonText className="ion-text-center ion-margin-bottom">
            O también puedes
          </IonText>

          <IonButton disabled={!network.status} onClick={onStartFreeTrial}>
            Comenzar tu prueba gratuita por 15 días
          </IonButton>
        </>
      )}
    </div>
  );
};
