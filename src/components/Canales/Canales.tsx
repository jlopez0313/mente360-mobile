import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { getYoutubeVideoId } from "@/helpers/Video";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonList
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";
import styles from "./Canales.module.scss";
import { Item } from "./Item";

export const Canales = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const { id } = useParams<any>();
  const network = useNetwork();

  const comunidad = useLiveQuery(() =>
    db.comunidades.filter((c) => c.id == id).first()
  );

  const canales = useLiveQuery(
    () => db.canales.filter((c) => c.comunidad?.id == comunidad?.id).toArray(),
    [comunidad]
  );


  return (
    <div className={styles["ion-content"]}>
      <IonCard>
        <IonCardHeader>
          <div className={styles["card-header"]}>
            <IonAvatar>
              <img
                alt={comunidad?.comunidad}
                src={network.status ? baseURL + comunidad?.imagen : AudioNoWifi}
              />
            </IonAvatar>
            <div className={styles["card-info"]}>
              <IonCardTitle> {comunidad?.comunidad} </IonCardTitle>
              <IonCardSubtitle> {comunidad?.lider?.name} </IonCardSubtitle>
            </div>
          </div>
          <div
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeVideoId(
                comunidad?.video
              )}`}
              title="YouTube video player"
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <p> {comunidad?.descripcion} </p>
        </IonCardContent>
      </IonCard>
      <IonList className="ion-padding" lines="none">
        {canales?.map((canal: any, idx: number) => {
          return (
            <Item key={idx} canal={canal} />
          );
        })}
      </IonList>
    </div>
  );
};
