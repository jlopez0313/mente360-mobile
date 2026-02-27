import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import Likes from "@/database/likes";
import { updateCallbacks } from "@/helpers/musicControls";
import { useAudio } from "@/hooks/useAudio";
import { db } from "@/hooks/useDexie";
import { dislike, like } from "@/services/likes";
import {
    setAudioSrc,
    setGlobalAudio,
    setGlobalPos,
    setIsGlobalPlaying
} from "@/store/slices/audioSlice";
import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useAudioPlayer = (track: Clips | null, idx?: number, isGlobal: boolean = true) => {
    const { user } = useSelector((state: any) => state.user);
    const { status, AudioNoWifi, baseURL } = useContext(NetworkContext);

    const dispatch = useDispatch();

    const { globalAudio, isGlobalPlaying, globalPos, listAudios } = useSelector(
        (state: any) => state.audio
    );

    // We determine if THIS track is the currently playing track globally.
    // If track is null, we assume we are controlling the global track directly (like in Clip.tsx)
    const activeTrack = isGlobal ? (track || globalAudio) : track;
    const isCurrentlyPlayingGlobalTrack = isGlobal ? (track ? (globalAudio?.id === track.id) : true) : false;

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const {
        progress,
        duration,
        real_duration,
        buffer,
        currentTime,
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
    } = useAudio(audioRef, () => { }, isGlobal);

    const isPlaying = isGlobal ? (isCurrentlyPlayingGlobalTrack && isGlobalPlaying) : localIsPlaying;

    // Queries
    const likes = useLiveQuery(
        () => {
            if (!activeTrack) return [];
            return db.likes.where("clips_id").equals(activeTrack.id).toArray()
        },
        [activeTrack?.id]
    );

    const my_like = useLiveQuery(() => {
        if (!activeTrack) return null;
        return db.likes
            .where("users_id")
            .equals(user?.id)
            .and((like: Likes) => like.clips_id === activeTrack.id)
            .first()
    }, [user?.id, activeTrack?.id]);

    const inMyPlaylist = useLiveQuery(() => {
        if (!activeTrack) return false;
        return db.playlist
            .where("users_id")
            .equals(user?.id)
            .and((playlist: any) => playlist?.crecimiento?.id === activeTrack.id)
            .first()
    }, [user?.id, activeTrack?.id]);

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
    const onTogglePlay = async () => {
        if (isPlaying) {
            if (isGlobal) dispatch(setIsGlobalPlaying(false));
            audioPause();
        } else {
            if (isGlobal) {
                if (activeTrack.audio_local) {
                    const audioBlob = await getDownloadedAudio(activeTrack.audio_local);
                    dispatch(setAudioSrc(audioBlob));
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

    const goToPrev = async () => {
        const prevIdx = globalPos === 0 ? listAudios.length - 1 : globalPos - 1;
        dispatch(setGlobalPos(prevIdx));
        const prev = listAudios[prevIdx];

        if (prev.audio_local) {
            const audioBlob = await getDownloadedAudio(prev.audio_local);
            dispatch(setAudioSrc(audioBlob));
        } else {
            dispatch(setAudioSrc(baseURL + prev.audio));
        }

        dispatch(setGlobalAudio(prev));
    };

    const goToNext = async () => {
        const nextIdx = globalPos === listAudios.length - 1 ? 0 : globalPos + 1;
        dispatch(setGlobalPos(nextIdx));
        const next = listAudios[nextIdx];

        if (next.audio_local) {
            const audioBlob = await getDownloadedAudio(next.audio_local);
            dispatch(setAudioSrc(audioBlob));
        } else {
            dispatch(setAudioSrc(baseURL + next.audio));
        }

        dispatch(setGlobalAudio(next));
    };

    const getAudioSrc = () => {
        return activeTrack?.audio_local ? activeTrack.audio_local : baseURL + activeTrack?.audio;
    }

    // Stable callback refs — keep them fresh so background events always use the latest handlers
    const onPlayRef = useRef(() => { dispatch(setIsGlobalPlaying(true)); audioPlay(); });
    const onPauseRef = useRef(() => { dispatch(setIsGlobalPlaying(false)); audioPause(); });
    const onGoBackRef = useRef(goToPrev);
    const onGoNextRef = useRef(goToNext);

    onPlayRef.current = () => { dispatch(setIsGlobalPlaying(true)); audioPlay(); };
    onPauseRef.current = () => { dispatch(setIsGlobalPlaying(false)); audioPause(); };
    onGoBackRef.current = goToPrev;
    onGoNextRef.current = goToNext;

    const stablePlay = useCallback(() => onPlayRef.current(), []);
    const stablePause = useCallback(() => onPauseRef.current(), []);
    const stableGoBack = useCallback(() => onGoBackRef.current(), []);
    const stableGoNext = useCallback(() => onGoNextRef.current(), []);

    // Keep background module callbacks current when this is the main player (Clip view)
    // Toast.tsx owns create(); this just ensures next/prev/play/pause stay up to date
    useEffect(() => {
        if (!track) {
            updateCallbacks(stablePlay, stablePause, stableGoBack, stableGoNext);
        }
    });

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
        onToggleLike,
        handleTogglePlaylist,
        onShareLink,
        onToggleDownload,
        onTogglePlay,
        onPlay: audioPlay,
        onPause: audioPause,
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
