import { useContext, useEffect, useState } from "react";
import UIContext from "@/context/Context";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentTime } from "@/store/slices/audioSlice";
import { Share } from "@capacitor/share";

export const useAudio: any = ( audio: any, onConfirm: any = () => {}) => {

  const dispatch = useDispatch();
  const { baseURL, audioRef, myCurrentTime } = useSelector( (state: any) => state.audio )

  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [duration, setDuration] = useState("0");
  const [real_duration, setRealDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);

  const onShareLink = async (id: any) => {
    await Share.share({
      title: "¡Tienes que escuchar esto en Mente360!",
      text: "Este audio en Mente360 está transformando mi día. Escuchalo también. ¡Se que te va a encantar!",
      url: baseURL + "audios/" + btoa(id),
      dialogTitle: "Invita a tus amigos a escuchar este audio y descubrir Mente360.",
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const onLoadedMetadata = () => {
    if (audio.current) {
      onUpdateBuffer();
      setRealDuration( audio.current.duration );
      setDuration( formatTime(audio.current.duration) );
    }
  };

  const onUpdateBuffer = () => {
    
    if (audio.current?.buffered?.length > 0) {
      const bufferedEnd = audio.current.buffered.end(audio.current.buffered.length - 1);
      const duration = audio.current.duration;
    
      setBuffer(duration > 0 ? bufferedEnd / duration : 0);
    }
  };

  const onTimeUpdate = () => {

    dispatch( updateCurrentTime( audio.current?.currentTime ) )
    
    const current = audio.current?.currentTime || 0;
    setCurrentTime(formatTime(current));
    setProgress((current / (audio.current?.duration || 1)) * 100);

    // console.log('updating time', current, audio.current)

  };

  const onStart = () => {
    if ( audio.current ) {
      audio.current.currentTime = 0;
    }
    onPause();
  };

  const onEnd = async () => {
    if ( audio.current ) {
      audio.current.currentTime = audio.current.duration;
    }
    setIsPlaying(false);

    onPause();
    onConfirm();
  };

  const onPause = async () => {
    audio.current?.pause();
    setIsPlaying(false);
  };

  const onPlay = async () => {
    try {
      if ( myCurrentTime && audio.current) {

        audio.current.currentTime = myCurrentTime
      }
      audio.current?.play()
      .catch((error: any) => {
        console.log("Chrome cannot play sound without user interaction first");
        onStart();
      });
    } catch (error: any) {
      console.error( error )
      
      console.log("Error Chrome cannot play sound without user interaction first");
      onStart();
    }

    setIsPlaying(true);
  };

  const onLoad = async (time: any) => {
    if ( audio.current ) {
      audio.current.currentTime = (audio.current.duration * time) / 100;
      onTimeUpdate();
    }

  };

  return {
    baseURL,
    progress,
    buffer,
    duration,
    real_duration,
    currentTime,
    isPlaying,
    onShareLink,
    onLoadedMetadata,
    onUpdateBuffer,
    onTimeUpdate,
    onStart,
    onEnd,
    onPause,
    onPlay,
    onLoad,
  };
};
