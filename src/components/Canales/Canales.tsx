import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import {
  IonAvatar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonList,
  IonText,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useHistory, useParams } from "react-router";
import styles from "./Canales.module.scss";

export const Canales = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { id } = useParams<any>();
  const history = useHistory();
  const network = useNetwork();

  const canales = useLiveQuery(() =>
    db.canales.filter((c) => c.lider?.id == id).toArray()
  );

  const comunidad = useLiveQuery(() =>
    db.comunidades.filter((c) => c.lider?.id == id).first()
  );

  const goToCrecimiento = (canalId: number) => {
    history.replace(`/crecimiento/${canalId}`);
  };

  return (
    <div className={styles["ion-content"]}>
      <h2 className="ion-text-center"> {} </h2>
      <IonCard>
        <img
          alt={comunidad?.comunidad}
          src={network.status ? baseURL + comunidad?.imagen : AudioNoWifi}
        />
        <IonCardHeader>
          <IonCardTitle> {comunidad?.comunidad} </IonCardTitle>
          <IonCardSubtitle> {comunidad?.lider?.name} </IonCardSubtitle>
        </IonCardHeader>
      </IonCard>
      <IonList className="ion-padding">
        {canales?.map((canal: any, idx: number) => {
          return (
            <IonItem key={idx} onClick={() => goToCrecimiento(canal.id)}>
              <IonAvatar slot="start">
                <img
                  alt={canal.canal}
                  src={network.status ? baseURL + canal.imagen : AudioNoWifi}
                />
              </IonAvatar>
              <IonText> {canal.canal} </IonText>
            </IonItem>
          );
        })}
      </IonList>
    </div>
  );
};
