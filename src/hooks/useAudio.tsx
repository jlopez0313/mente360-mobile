import { useContext, useEffect, useState } from "react";
import UIContext from "@/context/Context";
// import { create, handleControlsEvent, destroy } from "@/helpers/musicControls";

export const useAudio: any = (audioRef: any, onConfirm: any = () => {}) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      const minutes = Math.floor(audioRef.current.duration / 60);
      const seconds = Math.floor(audioRef.current.duration - minutes * 60);
      const duration =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

      setDuration(duration);
    }
  };

  const onTimeUpdate = () => {
    const minutes = Math.floor(audioRef.current?.currentTime / 60);
    const seconds = Math.floor(audioRef.current?.currentTime - minutes * 60);
    const currentTime =
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    setCurrentTime(currentTime);

    setProgress(
      (audioRef.current?.currentTime / audioRef.current.duration) * 100
    );
  };

  const onStart = () => {
    if ( audioRef.current ) {
      audioRef.current.currentTime = 0;
    }
    onPause();
  };

  const onEnd = () => {
    if ( audioRef.current ) {
      audioRef.current.currentTime = audioRef.current.duration;
    }
    setIsPlaying(false);
    onPause();
    onConfirm();
  };

  const onPause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const onPlay = () => {
    try {
      audioRef.current?.play().catch((error: any) => {
        console.log("Chrome cannot play sound without user interaction first");
        onStart();
      });
    } catch (error: any) {
      console.log("Chrome cannot play sound without user interaction first");
      onStart();
    }

    setIsPlaying(true);
  };

  const onLoad = (time: any) => {
    if ( audioRef.current ) {
      audioRef.current.currentTime = (audioRef.current.duration * time) / 100;
    }
    onPlay();
  };

  useEffect( ()=> {
    // destroy();
    // create();
  }, [])

  return {
    baseURL,
    progress,
    duration,
    currentTime,
    isPlaying,
    onLoadedMetadata,
    onTimeUpdate,
    onStart,
    onEnd,
    onPause,
    onPlay,
    onLoad,
  };
};
