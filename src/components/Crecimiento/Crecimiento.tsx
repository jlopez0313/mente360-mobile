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

export const Crecimiento = () => {
  const [swiper, setSwiper] = useState( { activeIndex: 0, slideTo: (idx: number) => {}, slidePrev: () => {}, slideNext: () => {} })

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const user = getUser();

  const [nivelID, setNivelID] = useState<any>( null );  
  const [progress, setProgress] = useState(0);
  const [niveles, setNiveles] = useState<any[]>([]);
  const [crecimientos, setCrecimientos] = useState<any[]>([]);
  const [crecimiento, setCrecimiento] = useState<any>({});

  const onSetActiveIdx = ( ) => {
    if (crecimientos.length) {
      setProgress ( swiper.activeIndex + 1 )
      setCrecimiento( crecimientos[ swiper.activeIndex ] )
    } else {
      setProgress ( 0 )
      setCrecimiento( {} )
    }
  }

  const onGetNiveles = async () => {
    try {
      present({
        message: "Loading ...",
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

      setNivelID( user.user.niveles_id || 1 )
    }
  };

  const onGetCrecimientos = async (nivelesID: string) => {
    try {
      
      present({
        message: "Loading ...",
      });

      const nivel = niveles.find( (item: any) => item.id == nivelesID )

      swiper.slideTo(0);
      setNivelID( nivelesID )

      const { data } = await allCrecimientos(nivelesID);
      const lista = data.data.map( (item: any) => {
        return {...item, playing: false}
      })

      setCrecimientos(lista);

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
    if ( swiper.activeIndex + 1 == crecimientos.length ) {

      const nextNivelIdx = niveles.map(i => i.id).indexOf( nivelID ) + 1
      if ( niveles[ nextNivelIdx ]  ) {
        const _nivelID = niveles[ nextNivelIdx ].id
        setNivelID( _nivelID )

        const {
          data: { data },
        } = await update(
          {
            niveles_id: _nivelID,
          },
          user.user.id
        );
  
        await setUser({ ...user, user: data });
      }
    }

    swiper.slideNext();
  }

  const onGoBack = async () => {
    if ( swiper.activeIndex == 0 ) {
      const prevNivelIdx = niveles.map(i => i.id).indexOf( nivelID ) - 1

      if ( niveles[ prevNivelIdx ]  ) {
        const _nivelID = niveles[ prevNivelIdx ].id
        setNivelID( _nivelID )
      }
    }

    swiper.slidePrev();
  }

  const compareWithFn = (o1: any, o2: any) => {
    return o1 && o2 && o1 == o2;
  }

  useEffect(() => {
    onGetNiveles();
  }, []);

  useEffect(() => {
    if (nivelID) {
      setCrecimientos([]);
      onGetCrecimientos( nivelID )
    } 
  }, [nivelID]);

  useEffect(() => {
    onSetActiveIdx( )
  }, [crecimientos]);

  return (
    <div className={`ion-no-padding ${styles["ion-content"]}`}>
      <IonSelect
        label="Nivel"
        labelPlacement="floating"
        interface="popover"
        shape="round"
        value={nivelID}
        compareWith={compareWithFn}
        className={`ion-padding-end ion-padding-start ion-margin-bottom ${styles["nivel"]}`}
        onIonChange={(e) => setNivelID(e.target.value)}
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
          <span> { progress }/{crecimientos.length} </span>
        </div>
      </div>

      <Swiper
        allowTouchMove={false}
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={true}
        centeredSlidesBounds={true}
        className={styles["swiper"]}
        onSlideChange={(e) => onSetActiveIdx( )}
        onSwiper={(swiper) => setSwiper(swiper)}
      >
        {
          crecimientos.map( (item: any, idx: number) => {
            return (
              <SwiperSlide key={idx}>
                <Audio crecimiento={crecimiento} audio={ item } onGoBack={onGoBack} onGoNext={onGoNext} />
              </SwiperSlide>
            )
          })
        }
      </Swiper>
    </div>
  );
};
