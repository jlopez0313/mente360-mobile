import { useContext, useEffect, useState } from "react";
import UIContext from "@/context/Context";

export const useAudio: any = (audioRef: any, onConfirm: any = () => {}) => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration( formatTime(audioRef.current.duration) );
    }
  };

  const onTimeUpdate = () => {
    const current = audioRef.current?.currentTime || 0;
    setCurrentTime(formatTime(current));
    setProgress((current / (audioRef.current?.duration || 1)) * 100);
  };

  const onStart = () => {
    if ( audioRef.current ) {
      audioRef.current.currentTime = 0;
    }
    onPause();
  };

  const onEnd = async () => {
    if ( audioRef.current ) {
      audioRef.current.currentTime = audioRef.current.duration;
    }
    setIsPlaying(false);

    onPause();
    onConfirm();
  };

  const onPause = async () => {
    audioRef.current?.pause();
    setIsPlaying(false);

  };

  const onPlay = async () => {
    try {
      audioRef.current?.play()
      .catch((error: any) => {
        console.log("Chrome cannot play sound without user interaction first");
        onStart();
      });
    } catch (error: any) {
      console.error( error )
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
