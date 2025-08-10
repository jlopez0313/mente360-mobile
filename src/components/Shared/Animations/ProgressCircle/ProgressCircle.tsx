import downloadingAnim from "@/assets/json/downloading.json";
import Lottie from "lottie-react";
import React from "react";
import styles from './ProgressCircle.module.scss';

interface AudioProgressCircleProps {
  
}

const AudioProgressCircle: React.FC<AudioProgressCircleProps> = () => {

  return (
    <div className={styles["progress"]}>
      <Lottie
        animationData={downloadingAnim}
        loop={true}
        style={{ width: 35, height: 35 }}
      />
    </div>
  );
};

export default AudioProgressCircle;
