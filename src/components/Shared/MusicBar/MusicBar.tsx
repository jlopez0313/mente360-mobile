import styles from "./MusicBar.module.scss";
const MusicBar = ({ className = '', paused = false}) => {
  return (
      <div className={`${ styles["animate-container"]} ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div
            className={`${!paused  ? styles["animate-pulse"] : styles["animate-paused"] }`}
            key={i}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${0.7+ i * 0.1}s`,
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
              transformOrigin: "bottom",
            }}
          ></div>
        ))}
    </div>
  );
};

export default MusicBar;
