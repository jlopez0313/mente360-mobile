import {
  IonList,
  IonSearchbar,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import styles from "../Musicaterapia.module.scss";

import { all } from "@/services/playlist";

import { useDispatch, useSelector } from "react-redux";
import {
  setListAudios,
  setShowGlobalAudio,
} from "@/store/slices/audioSlice";
import { Item } from "./Item";

export const Playlist = () => {
  const dispatch = useDispatch();
  const { listAudios, globalAudio } =
    useSelector((state: any) => state.audio);

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();
  const [search, setSearch] = useState<any>("");
  const [playlist, setPlaylist] = useState<any>([]);
  const [filteredPlaylist, setFilteredPlaylist] = useState<any>([]);

  const oSetSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const onGetPlaylist = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const {
        data: { data },
      } = await all();

      setPlaylist(data);
      setFilteredPlaylist(data);
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

  useEffect(() => {
    onGetPlaylist();
    dispatch(setShowGlobalAudio(true));
  }, []);

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
              playlist={playlist}
              setPlaylist={setPlaylist}
              setFilteredPlaylist={setFilteredPlaylist}
              onGetPlaylist={onGetPlaylist}
            />
          );
        })}
      </IonList>
    </div>
  );
};
