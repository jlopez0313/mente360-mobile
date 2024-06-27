import styles from "../Musicaterapia.module.scss";
import {
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import {
  pauseCircle,
  playCircle,
  shareSocialOutline,
  star,
  starOutline,
} from "ionicons/icons";

import { all as allCategorias } from "@/services/categorias";
import { all as allClips, byCategory } from "@/services/clips";
import { add, trash } from "@/services/playlist";

import { getUser } from "@/helpers/onboarding";
import { useContext, useEffect, useState } from "react";
import UIContext from "@/context/Context";

export const Clips = () => {

  const {
    globalAudio,
    isPlaying,
    onPause,
    onPlay,
    setGlobalAudio,
    listAudios,
    setListAudios,
    globalPos,
    setGlobalPos,
    setShowGlobalAudio
  }: any = useContext(UIContext);

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const { user } = getUser();

  const [categorias, setCategorias] = useState<any>([]);
  const [categoria, setCategoria] = useState('All');
  const [clips, setClips] = useState<any>([]);

  const hasThisUser = (usuarios_clips: any[]) => {
    const hasUserClip = usuarios_clips.find( item => item.users_id == user?.id )
    return hasUserClip
  }

  const onGetCategorias = async () => {
    try {
      present({
        message: "Loading ...",
      });

      const { data } = await allCategorias();
      setCategorias(data.data);
      onGetClips('0');

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

  const onGetClips = async (categoriasID: string, fn = allClips) => {
    try {
      present({
        message: "Loading ...",
      });

      if (categoriasID == '0') {
        setCategoria('All')
      } else {
        setCategoria( categorias.find( (item: any) => item.id == categoriasID )?.categoria )
      }

      const { data } = await fn(categoriasID);
      setClips(data.data);
      setListAudios(data.data);
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

  const onTrash = async (idx: number, usuarios_clips: any) => {
    try {
      present({
        message: "Loading ...",
      });

      const userClip = hasThisUser(usuarios_clips);

      await trash( userClip?.id );
      clips[idx].usuarios_clips = clips[idx].usuarios_clips.filter( (item: any) => item.id != userClip?.id )
      setClips( [ ...clips ] )
      // onGetClips();

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

  const onAdd = async (idx: number, id: any) => {
    try {
      present({
        message: "Loading ...",
      });

      const data = {
        clips_id: id,
        users_id: user.id
      }

      await add( data );
      clips[idx].usuarios_clips.push({
        users_id: user.id,
        clips_id: id
      })
      
      setClips( [...clips ] )
      // onGetPlaylist();

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

  const onPlayClicked = (idx: number, audio: any) => {
    if (!globalAudio || audio != globalAudio) {
      setGlobalAudio( audio )
      setGlobalPos( idx )
    } 
      onPlay()
  }

  useEffect(() => {
    onGetCategorias();

    setShowGlobalAudio( true )
  }, []);

  useEffect( () => {
    onPlay()
  }, [globalAudio])

  return (
    <div className={styles["ion-content"]}>
      <div className={`ion-margin-bottom ${styles.chips}`}>
        <IonChip onClick={() => onGetClips('0')} className={ categoria == 'All' ? styles.checked : ''}> All </IonChip>
        {
          categorias.map( (item: any, idx: any) => {
            return <IonChip key={idx} onClick={() => onGetClips(item.id, byCategory)} className={ categoria == item.categoria ? styles.checked : ''}> { item.categoria } </IonChip>
          })
        }
      </div>

      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {
          clips.map( (item: any, idx: any) => {
            return (
              <IonItem key={idx} button={true} className="ion-margin-bottom">
                <IonLabel class="ion-text-left"> {item.titulo} </IonLabel>
                {
                  globalAudio?.id == item.id && isPlaying ?
                  <IonIcon aria-hidden="true" slot="end" icon={pauseCircle} onClick={onPause} /> : 
                  <IonIcon aria-hidden="true" slot="end" icon={playCircle} onClick={() => onPlayClicked( idx, item )} />
                }
                
                {
                  hasThisUser( item.usuarios_clips ) ?
                  <IonIcon aria-hidden="true" slot="end" icon={star} onClick={() => onTrash(idx, item.usuarios_clips)} /> : 
                  <IonIcon aria-hidden="true" slot="end" icon={starOutline} onClick={() => onAdd(idx, item.id)}  />
                }
              </IonItem>
            )
          })
        }
      </IonList>
    </div>
  );
};
