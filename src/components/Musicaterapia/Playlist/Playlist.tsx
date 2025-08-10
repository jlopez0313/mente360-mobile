import { IonList, IonSearchbar } from "@ionic/react";
import { useEffect, useState } from "react";
import styles from "../Musicaterapia.module.scss";

import { setListAudios, setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Item } from "./Item";

import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { useLiveQuery } from "dexie-react-hooks";

export const Playlist = () => {
  const dispatch = useDispatch();

  const network = useNetwork();
  const { user } = useSelector((state: any) => state.user);

  const [search, setSearch] = useState<any>("");

  const playlist = useLiveQuery(
    () =>
      db.playlist
        .where("users_id")
        .equals(user.id)
        .toArray()
        .then((resultados) =>
          resultados.filter((c) =>
            c?.clip && c.clip.titulo.toLowerCase().includes(search.toLowerCase())
          )
        )
        .then((lista) => {
          const results = lista
            .filter((item) => item?.clip)
            .map((item: any) => {
              return item.clip;
            })
            .sort((a, b) => a?.titulo.localeCompare(b?.titulo));

          dispatch(setListAudios([...results]));

          return results;
        }),
    [search]
  );

  const oSetSearch = (e: any) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    dispatch(setShowGlobalAudio(true));
  }, []);

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
            return <Item key={idx} item={item} idx={idx} network={network} />;
        })}
      </IonList>
    </div>
  );
};
