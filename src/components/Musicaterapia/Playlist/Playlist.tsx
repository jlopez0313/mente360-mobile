import { IonAvatar, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonNote, useIonAlert, useIonLoading } from "@ionic/react";
import { playCircle, shareSocialOutline, trashOutline } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import styles from '../Musicaterapia.module.scss';

import { all, trash } from "@/services/playlist";
import UIContext from "@/context/Context";

export const Playlist = () => {

  const {
    setGlobalAudio,
    listAudios,
    setListAudios,
    globalPos,
    setGlobalPos,
    setShowGlobalAudio
  }: any = useContext(UIContext);

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const [playlist, setPlaylist] = useState([]);

  const onGetPlaylist = async () => {
    try {
      present({
        message: "Loading ...",
      });

      const { data: { data } } = await all();

      setPlaylist(data);
      setListAudios( data )

    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const onTrash = async (id: any) => {
    try {
      present({
        message: "Loading ...",
      });

      await trash( id );
      onGetPlaylist();

    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  }

  const onPlay = (idx: number, item: any) => {
    setGlobalPos( idx );
    setGlobalAudio( item )
  }

  useEffect(() => {
    onGetPlaylist();

    setShowGlobalAudio( true )
  }, []);

  return (
    <div className={styles['ion-content']}>
      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {
          playlist.map( (item: any, idx: any) => {
            return (
              <IonItem key={idx} button={true} className="ion-margin-bottom">
                <IonIcon aria-hidden="true" slot='start' icon={playCircle}  onClick={() => onPlay( idx, item )} />
                <IonLabel class="ion-text-left"> {item.clip.titulo} </IonLabel>
                <IonIcon aria-hidden="true" slot='end' icon={trashOutline} onClick={() => onTrash(item.id)} />
              </IonItem>
            )
          })
        }
      </IonList>
    </div>
  );
};
