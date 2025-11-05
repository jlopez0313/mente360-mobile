import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { useNetwork } from "@/hooks/useNetwork";
import { IonAvatar, IonIcon, IonItem } from "@ionic/react";
import { chevronForward } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router";
import styles from "./Canales.module.scss";

export const Item = ({ canal }: any) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [expandido, setExpandido] = useState(false);

  const history = useHistory();
  const network = useNetwork();

  const goToCrecimiento = (canalId: number) => {
    history.replace(`/crecimiento/${canalId}`);
  };

  return (
    <IonItem>
      <IonAvatar slot="start">
        <img
          alt={canal.canal}
          src={network.status ? baseURL + canal.imagen : AudioNoWifi}
        />
      </IonAvatar>
      <div className={styles["content"]}>
        <p className={styles["titulo"]}> {canal.canal} </p>
        <p
          className={`${styles["texto"]} ${
            expandido ? styles["expandido"] : ""
          }`}
        >
          {" "}
          {canal.descripcion}{" "}
        </p>
        
        <button
          className={`ion-margin-bottom ${styles["btn-leer"]}`}
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Leer menos" : "Leer más"}
        </button>
      </div>

      <IonIcon slot="end" icon={chevronForward} onClick={() => goToCrecimiento(canal.id)} />
    </IonItem>
  );
};
