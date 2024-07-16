import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { Toast } from "@/components/Toast/Toast";

import { Database, Storage } from '@ionic/storage';

export const Context = React.createContext<any>(undefined);

type Props = {
  children: any;
};

export const UIProvider = ({ children }: Props) => {

  const [db, setDb] = useState<Database | null>(null);
  
  const audioRef = useRef({
    currentTime: 0,
    duration: 0,
    pause: () => {},
    play: () => {},
    fastSeek: (time: number) => {},
  });

  const [tab, setTab] = useState<string>('calendario');
  const [isGobalPlaying, setIsGlobalPlaying] = useState<any>( false );
  const [globalAudio, setGlobalAudio] = useState<any>( null );
  const [listAudios, setListAudios] = useState<any>( [] );
  const [globalPos, setGlobalPos] = useState<any>( [] );
  const [showGlobalAudio, setShowGlobalAudio] = useState<boolean>( true );

  const initDb = async () => {
    const store = new Storage();
    const db = await store.create();
    setDb(db);
  }

  useEffect( ( ) => {
    initDb();
  }, []);

  const {
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
  } = useAudio(audioRef, () => {}, () => {} )

  const state = {
    db,
    audioRef,
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
    globalAudio,
    isGobalPlaying,
    listAudios,
    globalPos,
    showGlobalAudio,
    setShowGlobalAudio,
    setGlobalPos,
    setListAudios,
    setGlobalAudio,
    setIsGlobalPlaying,
    tab, setTab
  };

  return <Context.Provider value={state}> 
    {children}
    {
      globalAudio && showGlobalAudio && <Toast />
    }
  </Context.Provider>;
};

export default Context;
