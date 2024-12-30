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

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";

import { getUser, setUser } from "@/helpers/onboarding";
import { all as allNiveles } from "@/services/niveles";
import { all as allCrecimientos } from "@/services/crecimientos";
import { update } from "@/services/user";

import { BackgroundMode } from "@anuradev/capacitor-background-mode";
import { Card } from "./Card/Card";

import { useDispatch, useSelector } from "react-redux";
import { setGlobalAudio, setIsGlobalPlaying, updateCurrentTime, resetStore } from "@/store/slices/audioSlice";

export const Crecimiento = () => {
  const dispatch = useDispatch()

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
      });

      const { data } = await allNiveles();
      setNiveles(data.data);
    } catch (error: any) {
      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();

      setNivelID(user.user.crecimiento?.niveles_id || 0);
    }
  };

  const onGetCrecimientos = async (nivelesID: string) => {
    try {
      present({
        message: "Cargando ...",
      });

      const nivel = niveles.find((item: any) => item.id == nivelesID);

      swiper.slideTo(0);
      setNivelID(nivelesID);

      const { data } = await allCrecimientos(nivelesID);
      const lista: any[] = data.data.map((item: any) => {
        return { ...item, playing: false };
      });

      setCrecimientos(lista);

      if (user.user.crecimientos_id) {
        const idx = lista.findIndex(
          (x: any) => x.id == user.user.crecimientos_id
        );
        swiper.slideTo(idx);
      }
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
    }

    swiper.slideNext();
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
    dispatch(resetStore());
    onGetNiveles();
    return () => {
      // BackgroundMode.disable();
      // destroy();
    };
  }, []);

  useEffect(() => {
    if (nivelID) {
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
        shape="round"
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
                  onGoBack={onGoBack}
                  onGoNext={onGoNext}
                  onSaveNext={(e) => onSaveNext(e)}
                />
              ) : (
                <Card audio={item} />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
