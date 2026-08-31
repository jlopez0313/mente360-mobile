import Clips from "@/database/clips";
import Playlist from "@/database/playlist";
import { toggle, updateElapsed } from "@/helpers/musicControls";
import { add, trash } from "@/services/playlist";
import { selectBaseURL, selectIsGlobalPlaying, selectMyCurrentTime, setIsGlobalPlaying, updateCurrentTime } from "@/store/slices/audioSlice";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "./useDexie";

export const useAudio: any = (audio: any, onConfirm: any = () => { }, options: { isGlobalControllable?: boolean, needsProgress?: boolean } = { isGlobalControllable: true, needsProgress: true }) => {
  const { isGlobalControllable = true, needsProgress = true } = options;
  const lastDispatchTime = useRef(0);
  const pendingPlay = useRef(false);
  const lastSrc = useRef<string | null>(null);
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();
  const baseURL = useSelector(selectBaseURL);
  const myCurrentTime = useSelector(selectMyCurrentTime);

  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [duration, setDuration] = useState("0");
  const [real_duration, setRealDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);

  const createAudioFolder = async () => {
    try {
      // Intentamos leer la carpeta
      await Filesystem.readdir({
        path: "audio",
        directory: Directory.Data,
      });
      console.log("La carpeta 'audio' ya existe.");
    } catch (error: any) {
      if (error.message.includes("does not exist")) {
        try {
          await Filesystem.mkdir({
            path: "audio",
            directory: Directory.Data,
            recursive: true,
          });
        } catch (error: any) {
          if (error.message !== "Directory already exists") {
            console.error("Error al crear la carpeta:", error);
          }
        }
      } else {
        console.error("Error al verificar la carpeta:", error);
      }
    }
  };

  const deleteAudio = async (filePath: string) => {
    try {
      await Filesystem.deleteFile({
        path: filePath,
        directory: Directory.Data,
      });
      console.log("Archivo eliminado correctamente");
    } catch (error) {
      console.error("Error eliminando archivo:", filePath, ": ", error);
      throw new Error("Error....");
    }
  };

  const downloadAudio = async (
    audioUrl: string,
    fileName: string,
    onProgress?: (progress: number) => void
  ) => {
    try {
      await createAudioFolder();

      const response = await fetch(audioUrl);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No se pudo leer el audio");

      const contentLength = Number(response.headers.get("Content-Length")) || 1;
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;

        if (onProgress) {
          onProgress(Math.floor((receivedLength / contentLength) * 100));
        }
      }

      let fullArray = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        fullArray.set(chunk, position);
        position += chunk.length;
      }

      const ext = audioUrl.split(".").pop();
      const blob = new Blob([fullArray], { type: `audio/${ext}` });
      const base64Data = await convertBlobToBase64(blob);

      await Filesystem.writeFile({
        path: `audio/${fileName}.${ext}`,
        data: base64Data,
        directory: Directory.Data,
      });

      return `audio/${fileName}.${ext}`;
    } catch (error) {
      console.error("Error al descargar el audio:", error);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(blob);
    });



  const getDownloadedAudio = async (filePath: string) => {
    try {
      const uri = await Filesystem.getUri({
        path: filePath,
        directory: Directory.Data,
      });

      return Capacitor.convertFileSrc(uri.uri);
    } catch (error) {
      console.error("Error al obtener el audio descargado:", error);
      return "";
    }
  };

  const onShareLink = async (id: any) => {
    await Share.share({
      title: `¡Tienes que escuchar esto en ${import.meta.env.VITE_NAME}!`,
      text: "Esta canción está transformando mi día. Escúchalo también. ¡Se que te va a encantar!",
      url: baseURL + "audios/" + btoa(id),
      dialogTitle: `Invita a tus amigos a escuchar esta canción y descubrir ${import.meta.env.VITE_NAME
        }.`,
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const onLoadedMetadata = () => {
    if (audio.current) {
      onUpdateBuffer();
      setRealDuration(audio.current.duration);
      setDuration(formatTime(audio.current.duration));

      if (pendingPlay.current) {
        pendingPlay.current = false;
        onPlay();
      }
    }
  };

  const onUpdateBuffer = () => {
    if (audio.current?.buffered?.length > 0) {
      const bufferedEnd = audio.current.buffered.end(
        audio.current.buffered.length - 1
      );
      const duration = audio.current.duration;

      const newBuffer = duration > 0 ? bufferedEnd / duration : 0;
      setBuffer(newBuffer);

      if (isGlobalControllable) {
        window.dispatchEvent(new CustomEvent('globalAudioState', {
          detail: { type: 'buffer', buffer: newBuffer }
        }));
      }
    }
  };

  const onTimeUpdate = () => {
    if (!audio.current) return;

    if (isGlobalControllable) {
      // Throttle Redux updates to prevent UI thread starvation (every 2 seconds)
      const now = Date.now();
      if (now - lastDispatchTime.current > 2000) {
        dispatch(updateCurrentTime(audio.current.currentTime));
        lastDispatchTime.current = now;
      }
    }

    const current = audio.current.currentTime || 0;
    const computedProgress = (current / (audio.current.duration || 1)) * 100;

    setCurrentTime(formatTime(current));
    setProgress(computedProgress);

    // Note: updateElapsed should only be called on play/pause/seek.
    // Calling it here on every timeupdate floods the Capacitor bridge and freezes the app in the background!
    // Native MediaSession automatically interpolates time for us.

    if (isGlobalControllable) {
      window.dispatchEvent(new CustomEvent('globalAudioState', {
        detail: {
          type: 'time',
          progress: computedProgress,
          currentTime: formatTime(current),
          duration: formatTime(audio.current.duration || 0),
          real_duration: audio.current.duration || 0
        }
      }));
    }
  };

  const onStart = () => {
    if (audio.current) {
      audio.current.currentTime = 0;
    }
    onPause();
  };

  const onEnd = async () => {
    // Pausamos el <audio> directamente SIN despachar setIsGlobalPlaying(false).
    // Si soltamos ese flip aquí (en el flush del evento onEnded) y luego
    // handleNextPrev lo vuelve a poner true en otro commit, el auto-avance
    // dispara un onPlay() en paralelo al load() del cambio de fuente y el
    // play() se aborta -> salta de pista pero no suena. Dejando isGlobalPlaying
    // en true, el salto sigue el mismo camino único que el botón "Siguiente".
    if (audio.current) {
      audio.current.currentTime = audio.current.duration;
      audio.current.pause();
      toggle(false, audio.current.currentTime || 0);
    }
    setIsPlaying(false);

    onConfirm();
  };

  const onPause = async () => {
    if (audio.current) {
      audio.current.pause();
      setIsPlaying(false);
      toggle(false, audio.current.currentTime || 0);

      if (isGlobalControllable) {
        dispatch(setIsGlobalPlaying(false));
      }
    }
  };

  const onPlay = async () => {
    if (!audio.current) return;

    // If audio is not yet ready to play (no metadata), mark it as pending
    if (audio.current.readyState < 1) {
      console.log("Audio not ready, marking as pendingPlay");
      pendingPlay.current = true;
      return;
    }

    try {
      if (isGlobalControllable && myCurrentTime && (audio.current.duration > 0)) {
        audio.current.currentTime = myCurrentTime;
      }

      await audio.current.play();

      setIsPlaying(true);
      toggle(true, audio.current.currentTime || 0);

      if (isGlobalControllable) {
        dispatch(setIsGlobalPlaying(true));
      }
    } catch (error: any) {
      // play() interrumpido por un load()/pause() inmediato al cambiar de
      // pista: no es un fallo real; si apagamos el estado aquí matamos el
      // auto-avance.
      if (error?.name === "AbortError") return;

      console.error(error);
      console.log("Error Chrome cannot play sound without user interaction first");

      setIsPlaying(false);
      toggle(false, audio.current?.currentTime || 0);

      if (isGlobalControllable) {
        dispatch(setIsGlobalPlaying(false));
      }
    }
  };

  const onError = () => {
    console.error("Audio Load Error:", audio.current?.src);
    setIsPlaying(false);
    pendingPlay.current = false;
    if (isGlobalControllable) {
      dispatch(setIsGlobalPlaying(false));
    }
  };

  const onLoad = async (time: any) => {
    if (audio.current) {
      audio.current.currentTime = (audio.current.duration * time) / 100;
      onTimeUpdate();
      updateElapsed(audio.current.currentTime);
    } else {
      if (isGlobalControllable) {
        window.dispatchEvent(new CustomEvent('globalAudioSeek', { detail: time }));
      }
    }
  };

  const isGlobalPlaying = useSelector(selectIsGlobalPlaying);

  // Unified State Sync Effect
  useEffect(() => {
    if (!audio.current || !isGlobalControllable) return;

    // Handle Play/Pause sync
    if (isGlobalPlaying) {
      onPlay();
    } else {
      onPause();
    }
  }, [isGlobalPlaying, isGlobalControllable]);

  // Source Change detection and auto-load
  useEffect(() => {
    if (!audio.current) return;

    const currentSrc = audio.current.src;
    if (lastSrc.current !== currentSrc) {
      lastSrc.current = currentSrc;

      // Reset duration and metadata to prevent showing stale info or "ghostly progress"
      setRealDuration(0);
      setDuration("00:00");
      setProgress(0);
      setCurrentTime("00:00");

      if (isGlobalPlaying) {
        pendingPlay.current = true;
      }

      audio.current.load();
    }
  }); // Run on every render to check the ref's src property

  // Sync state between instances
  useEffect(() => {
    if (!needsProgress) return;

    const handleGlobalState = (e: any) => {
      if (!audio?.current) {
        if (e.detail.type === 'time') {
          setProgress(e.detail.progress);
          setCurrentTime(e.detail.currentTime);
          setDuration(e.detail.duration);
          setRealDuration(e.detail.real_duration);
        } else if (e.detail.type === 'buffer') {
          setBuffer(e.detail.buffer);
        }
      }
    };

    const handleGlobalSeek = (e: any) => {
      // Solo el que tiene el audio instanciado procesa el rebobinado
      if (audio?.current) {
        onLoad(e.detail);
      }
    };

    const handleGlobalStateReq = () => {
      if (audio?.current) {
        onTimeUpdate();
        onUpdateBuffer();
      }
    };

    window.addEventListener('globalAudioState', handleGlobalState);
    window.addEventListener('globalAudioSeek', handleGlobalSeek);
    window.addEventListener('requestGlobalAudioState', handleGlobalStateReq);

    const timeout = setTimeout(() => {
      if (!audio?.current) {
        window.dispatchEvent(new CustomEvent('requestGlobalAudioState'));
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('globalAudioState', handleGlobalState);
      window.removeEventListener('globalAudioSeek', handleGlobalSeek);
      window.removeEventListener('requestGlobalAudioState', handleGlobalStateReq);
    };
  }, [isGlobalControllable]);

  // Playlist Management
  const onTogglePlaylist = (track: Clips, inMyPlaylist: Playlist) => {
    if (inMyPlaylist?.id) {
      return onTrashFromPlaylist(inMyPlaylist);
    } else {
      return onAddToPlaylist(track);
    }
  };

  const onTrashFromPlaylist = async (inMyPlaylist: Playlist) => {
    try {
      await trash(inMyPlaylist?.id ?? 0);
      await db.playlist
        .where("id")
        .equals(inMyPlaylist?.id ?? 0)
        .delete();

      return;
    } catch (error: any) {
      console.log(error);
    }
  };

  const onAddToPlaylist = async (track: Clips) => {
    try {
      const data = {
        clips_id: track.id,
        users_id: user.id,
      };

      const {
        data: { data: added },
      } = await add(data);

      await db.playlist.add({
        id: added.id,
        clip: track,
        users_id: user.id,
      });

      return added;
    } catch (error: any) {
      console.log(error);
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
    onTogglePlaylist,
    onShareLink,
    onLoadedMetadata,
    onUpdateBuffer,
    onTimeUpdate,
    onError,
    onStart,
    onEnd,
    onPause,
    onPlay,
    onLoad,
    downloadAudio,
    deleteAudio,
    getDownloadedAudio,
  };
};
