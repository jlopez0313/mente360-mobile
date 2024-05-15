import { IonInput, IonProgressBar, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useState } from "react";
import { Audio } from "./Audio/Audio";
import styles from "./Crecimiento.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export const Crecimiento = () => {
  const [progress, setProgress] = useState(0.5);

  return (
    <div className={`ion-no-padding ${styles["ion-content"]}`}>
      <IonSelect
        label="Fruit"
        labelPlacement="floating"
        interface="popover"
        shape="round"
        className={`ion-margin-bottom ${styles["nivel"]}`}
      >
        <IonSelectOption value='A'> Hello World </IonSelectOption>

      </IonSelect>

      <div className={`ion-margin-bottom ${styles["slider"]}`}>
        <IonProgressBar
          className={styles["ion-progress-bar"]}
          value={progress}
        ></IonProgressBar>
        <div className={`${styles.time}`}>
          <span> 2/5 </span>
        </div>
      </div>

      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={true}
        centeredSlidesBounds={true}
        className={styles["swiper"]}
        // onSlideChange={() => console.log("slide change")}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <Audio />
        </SwiperSlide>
        <SwiperSlide>
          <Audio />
        </SwiperSlide>
        <SwiperSlide>
          <Audio />
        </SwiperSlide>
        <SwiperSlide>
          <Audio />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
