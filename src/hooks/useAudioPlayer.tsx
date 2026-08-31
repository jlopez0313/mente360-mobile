import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import Likes from "@/database/likes";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { dislike, like } from "@/services/likes";
import {
    selectGlobalAudio,
    selectGlobalPos,
    selectIsGlobalPlaying,
    selectListAudios,
    setAudioSrc,
    setGlobalAudio,
    setGlobalPos,
    setIsGlobalPlaying,
    setListAudios
} from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useAudioPlayer = (track: Clips | null, idx?: number, isGlobal: boolean = true) => {
    const { user } = useSelector((state: any) => state.user);
    const { status, AudioNoWifi, baseURL } = useContext(NetworkContext);

    const dispatch = useDispatch();

    const globalAudio = useSelector(selectGlobalAudio);
    const isGlobalPlaying = useSelector(selectIsGlobalPlaying);
    const globalPos = useSelector(selectGlobalPos);
    const listAudios = useSelector(selectListAudios);

    // We determine if THIS track is the currently playing track globally.
    // If track is null, we assume we are controlling the global track directly (like in Clip.tsx)
    const activeTrack = isGlobal ? (track || globalAudio) : track;
    const isCurrentlyPlayingGlobalTrack = isGlobal ? (track ? (globalAudio?.id === track.id) : true) : false;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [resolvedLocalSrc, setResolvedLocalSrc] = useState<string | null>(null);

    const {
        progress,
        duration,
        buffer,
        currentTime,
        real_duration,
        isPlaying: localIsPlaying,
        onPause: audioPause,
        onPlay: audioPlay,
        onLoad,
        onShareLink,
        downloadAudio,
        deleteAudio,
        getDownloadedAudio,
        onTogglePlaylist: originalTogglePlaylist,
        onTimeUpdate,
        onLoadedMetadata,
        onUpdateBuffer,
    } = useAudio(audioRef, () => { }, { isGlobalControllable: isGlobal, needsProgress: track === null });

    const isPlaying = isGlobal ? (isCurrentlyPlayingGlobalTrack && isGlobalPlaying) : localIsPlaying;

    // Queries
    const likes = useLiveQuery(
        () => {
            if (!activeTrack) return [];
            return db.likes.where("clips_id").equals(activeTrack.id).toArray()
        },
        [activeTrack?.id]
    );

    const my_like = useLiveQuery(async () => {
        if (!activeTrack) return undefined;
        const result = await db.likes
            .where("users_id")
            .equals(user?.id)
            .and((like: Likes) => like.clips_id === activeTrack.id)
            .first();
        return result;
    }, [user?.id, activeTrack?.id]);

    const inMyPlaylist = useLiveQuery(async () => {
        if (!activeTrack) return undefined;
        const result = await db.playlist
            .where("users_id")
            .equals(user?.id)
            .and((playlist: any) => 
                playlist?.clip?.id === activeTrack.id || 
                playlist?.crecimiento?.id === activeTrack.id
            )
            .first();
        return result;
    }, [user?.id, activeTrack?.id]);

    // Resolve local path if it exists
    useEffect(() => {
        if (activeTrack?.audio_local) {
            getDownloadedAudio(activeTrack.audio_local).then(setResolvedLocalSrc);
        } else {
            setResolvedLocalSrc(null);
        }
    }, [activeTrack?.audio_local]);

    // ===============================
    // LIKES
    // ===============================
    const onToggleLike = async () => {
        if (my_like) {
            try {
                await dislike(my_like?.id ?? 0);
                await db.likes.where("id").equals(my_like?.id ?? 0).delete();
            } catch (error) { console.error(error); }
        } else {
            try {
                const data = { clips_id: activeTrack.id, users_id: user.id };
                const { data: { data: added } } = await like(data);
                await db.likes.add({ ...data, id: added.id });
            } catch (error) { console.error(error); }
        }
    };

    // ===============================
    // PLAYLIST
    // ===============================
    const handleTogglePlaylist = async () => {
        const playlistToggled = await originalTogglePlaylist(activeTrack, inMyPlaylist);
        if (isCurrentlyPlayingGlobalTrack) {
            dispatch(setGlobalAudio({ ...activeTrack, inMyPlaylist: playlistToggled || null }));
        }
        toast.success(inMyPlaylist ? "Eliminado de favoritos" : "Agregado a favoritos");
    };

    // ===============================
    // DOWNLOADS
    // ===============================
    const onToggleDownload = async (collection: 'clips' | 'crecimientos' = 'clips') => {
        if (activeTrack.audio_local) {
            await deleteAudio(activeTrack.audio_local);
            await db[collection].update(activeTrack.id, { imagen_local: "", audio_local: "", downloaded: 0 });
            toast.success("Eliminado de descargas");
        } else {
            try {
                const ruta = await downloadAudio(baseURL + activeTrack.audio, "audio_" + activeTrack.id);
                if (ruta) {
                    await db[collection].update(activeTrack.id, { imagen_local: activeTrack.imagen, audio_local: ruta, downloaded: 1 });
                    toast.success("Descargado para offline");
                }
            } catch (error) { console.error("Error ondownload", error); }
        }
    };

    // ===============================
    // PLAYBACK CONTROL
    // ===============================
    // Garantiza que exista una cola reproducible en Redux para que el
    // auto-avance (onEnded -> goToNext en Toast) tenga a dónde ir. Si la cola
    // ya contiene este track, se respeta (puede venir de Favoritos o de una
    // búsqueda filtrada); si no, se arma con los clips de su misma categoría.
    const ensureQueue = async (trackToPlay: Clips) => {
        const already = listAudios?.some((a: Clips) => a.id === trackToPlay.id);
        if (already) return;

        const catId = (trackToPlay as any)?.categoria?.id;
        const base = db.clips.orderBy("titulo");
        const queue = catId
            ? await base.filter((c: any) => c.categoria?.id === catId).toArray()
            : await base.toArray();

        if (queue.length) dispatch(setListAudios(queue));
    };

    const onTogglePlay = async () => {
        if (isPlaying) {
            if (isGlobal) dispatch(setIsGlobalPlaying(false));
            audioPause();
        } else {
            if (isGlobal) {
                await ensureQueue(activeTrack);

                if (activeTrack.audio_local) {
                    const localPath = resolvedLocalSrc || await getDownloadedAudio(activeTrack.audio_local);
                    dispatch(setAudioSrc(localPath));
                } else {
                    dispatch(setAudioSrc(baseURL + activeTrack.audio));
                }

                if (idx !== undefined) dispatch(setGlobalPos(idx));

                dispatch(setGlobalAudio({ ...activeTrack, inMyPlaylist }));
                dispatch(setIsGlobalPlaying(true));
            } else {
                // Modificar src del ref directamente para audio local
                if (!audioRef.current?.src) {
                    audioRef.current!.src = getAudioSrc();
                }
            }
            audioPlay();
        }
    };

    // Pausa segura (no togglea): la usa el temporizador de apagado del player.
    const pause = () => {
        if (isGlobal) dispatch(setIsGlobalPlaying(false));
        audioPause();
    };

    // Mismo criterio que Toast.resolveQueue: si Redux perdió la cola (saliste de
    // la lista, Favoritos vacío la limpió, etc.) la reconstruimos con los clips
    // de la categoría de la pista actual, y si no hay categoría, con todos. Así
    // el next/prev del player grande nunca se queda sin lista.
    const resolveQueue = async (): Promise<Clips[]> => {
        if (listAudios && listAudios.length > 0) return listAudios;

        const current = activeTrack || globalAudio;
        const catId = (current as any)?.categoria?.id;
        const base = db.clips.orderBy("titulo");
        const rebuilt = catId
            ? await base.filter((c: any) => c.categoria?.id === catId).toArray()
            : await base.toArray();

        if (rebuilt.length) dispatch(setListAudios(rebuilt));
        return rebuilt;
    };

    // Cambia a la pista dada y deja el estado global reproduciendo. Mismo orden
    // de dispatch que Toast.handleNextPrev para que el <audio> del Toast (único
    // con elemento real) reaccione igual venga del mini-player o del grande.
    const playTrackAt = async (index: number, track: Clips) => {
        if (track.audio_local) {
            const audioBlob = await getDownloadedAudio(track.audio_local);
            dispatch(setAudioSrc(audioBlob));
        } else {
            dispatch(setAudioSrc(baseURL + track.audio));
        }

        dispatch(setGlobalPos(index));
        dispatch(setGlobalAudio(track));
        dispatch(setIsGlobalPlaying(true));
    };

    const goToPrev = async () => {
        const audios = await resolveQueue();
        if (!audios || audios.length === 0) return;

        const currentIdx = audios.findIndex((a: Clips) => a.id === globalAudio?.id);
        const prevIdx = currentIdx <= 0 ? audios.length - 1 : currentIdx - 1;

        const prev = audios[prevIdx];
        if (prev) await playTrackAt(prevIdx, prev);
    };

    const goToNext = async () => {
        const audios = await resolveQueue();
        if (!audios || audios.length === 0) return;

        const currentIdx = audios.findIndex((a: Clips) => a.id === globalAudio?.id);
        const nextIdx = (currentIdx === -1 || currentIdx === audios.length - 1) ? 0 : currentIdx + 1;

        const next = audios[nextIdx];
        if (next) await playTrackAt(nextIdx, next);
    };

    const getAudioSrc = () => {
        if (activeTrack?.audio_local && resolvedLocalSrc) {
            return resolvedLocalSrc;
        }
        return activeTrack?.audio ? baseURL + activeTrack.audio : "";
    }



    return {
        audioRef,
        activeTrack,
        isPlaying,
        isGlobalActive: isCurrentlyPlayingGlobalTrack,
        likesCount: likes?.length || 0,
        hasLiked: !!my_like,
        inMyPlaylist: !!inMyPlaylist,
        status,
        baseURL,
        AudioNoWifi,
        getAudioSrc,
        progress,
        duration,
        currentTime,
        buffer,
        real_duration,
        onToggleLike,
        handleTogglePlaylist,
        onShareLink,
        onToggleDownload,
        onTogglePlay,
        onPlay: audioPlay,
        onPause: audioPause,
        pause,
        onLoad,
        goToPrev,
        goToNext,
        globalPos,
        listAudios,
        onTimeUpdate,
        onLoadedMetadata,
        onUpdateBuffer,
    };
};
