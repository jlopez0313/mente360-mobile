import { IonList, IonSearchbar } from "@ionic/react";
import { useEffect, useState } from "react";
import styles from "../Musicaterapia.module.scss";

import { setListAudios, setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

import { useDB } from "@/context/Context";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { useLiveQuery } from "dexie-react-hooks";

export const Playlist = () => {
  const dispatch = useDispatch();

  const { sqlite } = useDB();
  const network = useNetwork();
  const { user } = useSelector((state: any) => state.user);

  const { listAudios, globalAudio } = useSelector((state: any) => state.audio);

  const [search, setSearch] = useState<any>("");

  const playlist = useLiveQuery(
    () =>
      db.playlist
        .where("users_id")
        .equals(user.id)
        .toArray()
        .then((lista) =>
          lista.map((item: any) => {
            return item.clip;
          })
        ),
    [search]
  );

  const oSetSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const onUpdateList = () => {
    if (!listAudios.length) {
      dispatch(setListAudios(playlist?.map((clip: any) => clip.clip)));
    }
  };

  const onSetClips = (idx: number, item: any) => {
    let lista = [...(playlist ?? [])];

    if (!item) {
      lista = lista.slice(idx, 1);
    } else {
      lista[idx] = { ...item };
    }

    console.log(idx, lista);
    // setFilteredPlaylist(lista);
  };

  useEffect(() => {
    if (sqlite.initialized) {
      dispatch(setShowGlobalAudio(true));
    }
  }, [sqlite.initialized]);

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
        {playlist?.map((item: any, idx: any) => {
          if (item)
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
