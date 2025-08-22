
import {
  IonProgressBar,
  IonSelect,
  IonSelectOption
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Audio } from "./Audio/Audio";
import styles from "./Crecimiento.module.scss";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import { nextCrecimiento } from "@/services/user";
import { resetStore } from "@/store/slices/audioSlice";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "./Card/Card";

import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import { setPodcast } from "@/store/slices/homeSlice";
import { setUser } from "@/store/slices/userSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";

export const Crecimiento = () => {
  const { id } = useParams<any>();
  const dispatch = useDispatch();

  const network = useNetwork();

  const [swiper, setSwiper] = useState({
    activeIndex: 0,
    slideTo: (idx: number) => {},
    slidePrev: () => {},
    slideNext: () => {},
  });

  const { user } = useSelector((state: any) => state.user);
  const { userEnabled, payment_status } = usePayment();

  const [activeIdx, setActiveIdx] = useState(0);
  const [nivelID, setNivelID] = useState<number>(1);
  const [progress, setProgress] = useState(0);

  const niveles = useLiveQuery(
    () =>
      db.niveles
        .orderBy("orden")
        .filter((n: any) => n?.canal?.id == id)
        .toArray(),
    [id]
  );

  const nivel = useLiveQuery(() => {
    if (!nivelID) return null;
    return db.niveles.where("id").equals(nivelID).first();
  }, [nivelID]);

  const canal = useLiveQuery(() => {
    if (!nivel?.canal?.id) return null;
    return db.canales.where("id").equals(nivel?.canal?.id).first();
  }, [nivel]);

  const crecimientos = useLiveQuery(
    () =>
      db.crecimientos
        .toArray()
        .then((lista) => {
          swiper.slideTo(0);
          return lista;
        })
        .then((resultados) => {
          return resultados
            .filter((r: any) => r.nivel?.id == Number(nivelID))
            .map((item: any) => {
              return { ...item, playing: false };
            });
        })
        .then((resultados) => {
          if (user.crecimientos_id) {
            const idx = resultados.findIndex(
              (x: any) => x.id == user.crecimientos_id
            );
            swiper.slideTo(idx);
          }

          return resultados;
        }),
    [nivelID]
  );

  const onSetNivel = async (level: any) => {
    setNivelID(level);

    if (level == 0) {
      const updatePromise = nextCrecimiento(
        {
          niveles_id: 1,
        },
        user.id
      );

      const setUserPromise = updatePromise.then(({ data }) => {
        return dispatch(setUser(data.data));
      });

      await Promise.all([updatePromise, setUserPromise]);
    }
  };

  const onSetActiveIdx = () => {
    // BackgroundMode.disable();
    // destroy();

    if (crecimientos?.length) {
      setActiveIdx(swiper.activeIndex + 1);
      setProgress((swiper.activeIndex + 1) / crecimientos.length);
    } else {
      setActiveIdx(0);
      setProgress(0);
    }
  };

  const onGoNext = async () => {
    if (swiper.activeIndex + 1 == crecimientos?.length) {
      const nextNivelIdx =
        (niveles?.map((i) => i.id).indexOf(nivelID) ?? -1) + 1;

      if (niveles && niveles[nextNivelIdx]) {
        if (
          niveles[nextNivelIdx].gratis === 0 &&
          (!userEnabled || payment_status == "free")
        ) {
          return;
        }

        const _nivelID = niveles[nextNivelIdx].id;
        setNivelID(_nivelID);

        const updatePromise = nextCrecimiento(
          {
            niveles_id: _nivelID,
          },
          user.id
        );

        const setUserPromise = updatePromise.then(({ data }) => {
          return dispatch(setUser(data.data));
        });

        await Promise.all([updatePromise, setUserPromise]);
      }
    } else {
      swiper.slideNext();
    }
  };

  const onGoBack = async () => {
    if (swiper.activeIndex == 0) {
      const prevNivelIdx =
        (niveles?.map((i) => i.id).indexOf(nivelID) ?? -1) - 1;

      if (niveles && niveles[prevNivelIdx]) {
        const _nivelID = niveles[prevNivelIdx].id;
        setNivelID(_nivelID);
      }
    }

    swiper.slidePrev();
  };

  const onSaveNext = async (idx: number) => {
    if (crecimientos && crecimientos[idx + 1]) {
      const updatePromise = nextCrecimiento(
        {
          crecimientos_id: crecimientos[idx + 1].id,
        },
        user.id
      );

      const setUserPromise = updatePromise.then(({ data }) => {
        return dispatch(setUser(data.data));
      });

      await Promise.all([updatePromise, setUserPromise]);
    }
    
    onGoNext();

    await dispatch(setPodcast({ done: 1 }));
  };

  const compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 && o1 == o2;
  };
  
  useEffect(() => {
    const onStartNivel = () => {
      if (!user.crecimientos) {
        const nivel = user.crecimientos.find( (c: any) => c.nivel?.canales_id == id);
        setNivelID(nivel ?? 7); // 7 es el nivel 0
      }
    }

    onStartNivel();
    dispatch(resetStore());
  }, []);

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
        {niveles?.map((item: any, idx: number) => {
          return (
            <IonSelectOption
              disabled={
                (!userEnabled || payment_status == "free") && item.gratis == 0
              }
              key={idx}
              value={item.id}
            >
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
            {progress * (crecimientos?.length ?? 0)}/{crecimientos?.length ?? 1}{" "}
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
        {crecimientos?.map((item: any, idx: number) => {
          return (
            <SwiperSlide key={idx}>
              {idx == swiper.activeIndex ? (
                <Audio
                  activeIndex={swiper.activeIndex}
                  audio={item}
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
