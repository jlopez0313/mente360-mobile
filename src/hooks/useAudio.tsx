import { updateCurrentTime } from "@/store/slices/audioSlice";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAudio: any = (audio: any, onConfirm: any = () => {}) => {
  const dispatch = useDispatch();
  const { baseURL, audioRef, myCurrentTime } = useSelector(
    (state: any) => state.audio
  );

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
      console.error("Error eliminando archivo:", error);
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

      const blob = new Blob(chunks, { type: "audio/mp3" });
      const base64Data = await convertBlobToBase64(blob);

      await Filesystem.writeFile({
        path: `audio/${fileName}.mp3`,
        data: base64Data.split(",")[1],
        directory: Directory.Data,
      });

      return `audio/${fileName}.mp3`;
    } catch (error) {
      console.error("Error al descargar el audio:", error);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Blob([new Uint8Array(byteArrays)], { type: mimeType });
  };

  const getDownloadedAudio = async (filePath: string) => {
    const file = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Data,
    });

    const blob = base64ToBlob(`${file.data}`, "audio/mp3");
    return URL.createObjectURL(blob);
  };

  const onShareLink = async (id: any) => {
    await Share.share({
      title: "¡Tienes que escuchar esto en Mente360!",
      text: "Esta canción en Mente360 está transformando mi día. Escuchalo también. ¡Se que te va a encantar!",
      url: baseURL + "audios/" + btoa(id),
      dialogTitle:
        "Invita a tus amigos a escuchar esta canción y descubrir Mente360.",
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
    }
  };

  const onUpdateBuffer = () => {
    if (audio.current?.buffered?.length > 0) {
      const bufferedEnd = audio.current.buffered.end(
        audio.current.buffered.length - 1
      );
      const duration = audio.current.duration;

      setBuffer(duration > 0 ? bufferedEnd / duration : 0);
    }
  };

  const onTimeUpdate = () => {
    dispatch(updateCurrentTime(audio.current?.currentTime));

    const current = audio.current?.currentTime || 0;
    setCurrentTime(formatTime(current));
    setProgress((current / (audio.current?.duration || 1)) * 100);

    // console.log('updating time', current, audio.current)
  };

  const onStart = () => {
    if (audio.current) {
      audio.current.currentTime = 0;
    }
    onPause();
  };

  const onEnd = async () => {
    if (audio.current) {
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
      if (myCurrentTime && audio.current) {
        audio.current.currentTime = myCurrentTime;
      }
      audio.current?.play().catch((error: any) => {
        console.log("Chrome cannot play sound without user interaction first");
        onStart();
      });
    } catch (error: any) {
      console.error(error);

      console.log(
        "Error Chrome cannot play sound without user interaction first"
      );
      onStart();
    }

    setIsPlaying(true);
  };

  const onLoad = async (time: any) => {
    if (audio.current) {
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
    downloadAudio,
    deleteAudio,
    getDownloadedAudio,
  };
};
