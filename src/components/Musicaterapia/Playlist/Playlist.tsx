import {
  IonList,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import styles from "../Musicaterapia.module.scss";

import { setListAudios, setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

import { useDB } from "@/context/Context";
import PlaylistDB from "@/database/playlist";
import { getUser } from "@/helpers/onboarding";
import { useNetwork } from "@/hooks/useNetwork";

export const Playlist = () => {
  const dispatch = useDispatch();

  const { sqlite } = useDB();
  const network = useNetwork();
  const { user } = getUser();

  const { listAudios, globalAudio } = useSelector((state: any) => state.audio);

  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();

  const [search, setSearch] = useState<any>("");
  const [playlist, setPlaylist] = useState<any>([]);
  const [filteredPlaylist, setFilteredPlaylist] = useState<any>([]);

  const oSetSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const onGetPlaylist = async () => {
    try {
      present({
        message: "Cargando...",
        duration: 200,
      });

      const playlistDB = new PlaylistDB(sqlite.db);
      await playlistDB.all(
        sqlite.performSQLAction,
        (lista: any) => {
          setPlaylist(lista);
          setFilteredPlaylist(lista);
        },
        {
          search: search,
          userID: user.id,
        }
      );
    } catch (error: any) {
      console.log(error);

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

  const onUpdateList = () => {
    if (!listAudios.length) {
      dispatch(setListAudios(playlist.map((clip: any) => clip.clip)));
    }
  };

  const onFilter = () => {
    const lista = playlist.filter(
      (item: any) =>
        item.clip?.titulo.toLowerCase().includes(search.toLowerCase()) ||
        item.clip?.categoria?.categoria
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredPlaylist([...lista]);
  };

  const onSetClips = (idx: number, item: any) => {
    let lista = [...playlist];


    if ( !item ) {
      lista = lista.slice(idx, 1);
    } else {
      lista[idx] = {...item}
    }

    console.log( idx, lista )

    setPlaylist(lista);
    setFilteredPlaylist(lista);
  }

  useEffect(() => {
    if (sqlite.initialized) {
      onGetPlaylist();
      dispatch(setShowGlobalAudio(true));
    }
  }, [sqlite.initialized]);

  useEffect(() => {
    onFilter();
  }, [search]);

  useEffect(() => {
    globalAudio && onUpdateList();
  }, [globalAudio]);

  return (
    <div className={styles["ion-content"]}>
      <div className={`ion-margin-bottom ${styles.chips}`}>
        <IonSearchbar
          className={`ion-no-padding ion-margin-bottom ${styles["search"]}`}
          placeholder="Buscar..."
          color="warning"
          onIonInput={(ev) => oSetSearch(ev)}
          value={search == "__empty__" ? "" : search}
        ></IonSearchbar>
      </div>

      <IonList className="ion-no-padding ion-margin-bottom" lines="none">
        {filteredPlaylist.map((item: any, idx: any) => {
          return (
            <Item
              key={idx}
              item={item}
              idx={idx}
              sqlite={sqlite}
              network={network}
              onSetClips={onSetClips}
            />
          );
        })}
      </IonList>
    </div>
  );
};
