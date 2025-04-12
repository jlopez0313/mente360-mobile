import {
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Audio } from "./Audio/Audio";
import styles from "./Crecimiento.module.scss";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { getUser, setUser } from "@/helpers/onboarding";
import { update } from "@/services/user";
import { resetStore } from "@/store/slices/audioSlice";
import { useDispatch } from "react-redux";
import { Card } from "./Card/Card";

import { useDB } from "@/context/Context";
import CrecimientosDB from "@/database/crecimientos";
import NivelesDB from "@/database/niveles";
import { useNetwork } from "@/hooks/useNetwork";

export const Crecimiento = () => {
  const dispatch = useDispatch();

  const { sqlite } = useDB();
  const network = useNetwork();

  const [swiper, setSwiper] = useState({
    activeIndex: 0,
    slideTo: (idx: number) => {},
    slidePrev: () => {},
    slideNext: () => {},
  });

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const user = getUser();

  const [activeIdx, setActiveIdx] = useState(0);
  const [nivelID, setNivelID] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [niveles, setNiveles] = useState<any[]>([]);
  const [crecimientos, setCrecimientos] = useState<any[]>([]);
  const [crecimiento, setCrecimiento] = useState<any>({});

  const onSetNivel = async (level: any) => {
    setNivelID(level);

    if (level == 0) {
      const updatePromise = update(
        {
          niveles_id: 1,
        },
        user.user.id
      );

      const setUserPromise = updatePromise.then(({ data }) => {
        return setUser({ ...user, user: data.data });
      });

      await Promise.all([updatePromise, setUserPromise]);
    }
  };

  const onSetActiveIdx = () => {
    // BackgroundMode.disable();
    // destroy();

    if (crecimientos.length) {
      setActiveIdx(swiper.activeIndex + 1);
      setProgress((swiper.activeIndex + 1) / crecimientos.length);
      setCrecimiento(crecimientos[swiper.activeIndex]);
    } else {
      setActiveIdx(0);
      setProgress(0);
      setCrecimiento({});
    }
  };

  const onGetNiveles = async () => {
    try {
      present({
        message: "Cargando ...",
        duration: 200,
      });

      const nivelesDB = new NivelesDB(sqlite.db);
      await nivelesDB.all(sqlite.performSQLAction, (data: any) => {
        setNiveles(data);
      });
    } catch (error: any) {
      console.log(error);

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      setNivelID(user.user.crecimiento?.niveles_id ?? 7); // 7 es el nivel 0
      dismiss();
    }
  };

  const onGetCrecimientos = async (nivelesID: string) => {
    try {
      present({
        message: "Cargando ...",
        duration: 200,
      });

      swiper.slideTo(0);
      setNivelID(nivelesID);

      const crecimientosDB = new CrecimientosDB(sqlite.db);
      await crecimientosDB.byNivel(
        sqlite.performSQLAction,
        (data: any) => {
          const lista: any[] = data.map((item: any) => {
            return { ...item, playing: false };
          });

          setCrecimientos(lista);

          if (user.user.crecimientos_id) {
            const idx = lista.findIndex(
              (x: any) => x.id == user.user.crecimientos_id
            );
            swiper.slideTo(idx);
          }
        },
        {
          nivel: nivelesID,
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

  const onGoNext = async () => {
    if (swiper.activeIndex + 1 == crecimientos.length) {
      const nextNivelIdx = niveles.map((i) => i.id).indexOf(nivelID) + 1;
      if (niveles[nextNivelIdx]) {
        const _nivelID = niveles[nextNivelIdx].id;
        setNivelID(_nivelID);

        const updatePromise = update(
          {
            niveles_id: _nivelID,
          },
          user.user.id
        );

        const setUserPromise = updatePromise.then(({ data }) => {
          return setUser({ ...user, user: data.data });
        });

        await Promise.all([updatePromise, setUserPromise]);
      }
    } else {
      swiper.slideNext();
    }
  };

  const onGoBack = async () => {
    if (swiper.activeIndex == 0) {
      const prevNivelIdx = niveles.map((i) => i.id).indexOf(nivelID) - 1;

      if (niveles[prevNivelIdx]) {
        const _nivelID = niveles[prevNivelIdx].id;
        setNivelID(_nivelID);
      }
    }

    swiper.slidePrev();
  };

  const onSaveNext = async (idx: number) => {
    if (crecimientos[idx + 1]) {
      const updatePromise = update(
        {
          crecimientos_id: crecimientos[idx + 1].id,
        },
        user.user.id
      );

      const setUserPromise = updatePromise.then(({ data }) => {
        return setUser({ ...user, user: data.data });
      });

      await Promise.all([updatePromise, setUserPromise]);
    }
    onGoNext();
  };

  const compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 && o1 == o2;
  };

  useEffect(() => {
    if (sqlite.initialized) {
      onGetNiveles();
      dispatch(resetStore());
    }
  }, [sqlite.initialized]);

  useEffect(() => {
    if (nivelID !== null && nivelID !== undefined) {
      setCrecimientos([]);
      onGetCrecimientos(nivelID);
    }
  }, [nivelID]);

  useEffect(() => {
    onSetActiveIdx();
  }, [crecimientos]);

  return (
    <div className={`ion-no-padding ${styles["ion-content"]}`}>
      <IonSelect
        placeholder="Nivel"
        labelPlacement="stacked"
        interface="popover"
        value={nivelID}
        compareWith={compareWithFn}
        className={`ion-margin-bottom ${styles["nivel"]}`}
        onIonChange={(e) => onSetNivel(e.target.value)}
      >
        {niveles.map((item: any, idx: number) => {
          return (
            <IonSelectOption key={idx} value={item.id}>
              {" "}
              {item.nivel}{" "}
            </IonSelectOption>
          );
        })}
      </IonSelect>

      <div className={`ion-margin-bottom ${styles["slider"]}`}>
        <IonProgressBar
          className={styles["ion-progress-bar"]}
          value={progress}
        ></IonProgressBar>
        <div className={`${styles.time}`}>
          <span>
            {" "}
            {progress * crecimientos.length}/{crecimientos.length}{" "}
          </span>
        </div>
      </div>

      <Swiper
        initialSlide={activeIdx}
        allowTouchMove={false}
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={true}
        centeredSlidesBounds={true}
        className={styles["swiper"]}
        onSlideChange={(e) => onSetActiveIdx()}
        onSwiper={(swiper) => setSwiper(swiper)}
      >
        {crecimientos.map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              {idx == swiper.activeIndex ? (
                <Audio
                  activeIndex={swiper.activeIndex}
                  audio={item}
                  sqlite={sqlite}
                  network={network}
                  onGoBack={onGoBack}
                  onGoNext={onGoNext}
                  onSaveNext={(e) => onSaveNext(e)}
                />
              ) : (
                <Card network={network} audio={item} />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
