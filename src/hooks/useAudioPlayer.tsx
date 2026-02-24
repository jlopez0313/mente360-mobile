import { NetworkContext } from "@/context/NetworkContext";
import Clips from "@/database/clips";
import Likes from "@/database/likes";
import { startBackground } from "@/helpers/background";
import { create } from "@/helpers/musicControls";
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
import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const useAudioPlayer = (track: Clips | null, idx?: number) => {
    const { user } = useSelector((state: any) => state.user);
    const { status, AudioNoWifi, baseURL } = useContext(NetworkContext);

    const dispatch = useDispatch();

    const { audioSrc, globalAudio, isGlobalPlaying, globalPos, listAudios } = useSelector(
        (state: any) => state.audio
    );

    // We determine if THIS track is the currently playing track globally.
    // If track is null, we assume we are controlling the global track directly (like in Clip.tsx)
    const isCurrentlyPlayingGlobalTrack = track ? (globalAudio?.id === track.id) : true;
    const activeTrack = track || globalAudio;
    const isPlaying = isCurrentlyPlayingGlobalTrack && isGlobalPlaying;

    const audioRef = useRef<HTMLAudioElement | any>({
        currentTime: 0,
        duration: 0,
        pause: () => { },
        play: () => Promise.resolve(),
        fastSeek: () => { },
    });

    const {
        progress,
        duration,
        real_duration,
        buffer,
        currentTime,
        onLoadedMetadata,
        onTimeUpdate,
        onUpdateBuffer,
        onPause: audioPause,
        onPlay: audioPlay,
        onShareLink,
        downloadAudio,
        deleteAudio,
        getDownloadedAudio,
        onTogglePlaylist: originalTogglePlaylist,
    } = useAudio(audioRef, () => { });

    // Queries
    const likes = useLiveQuery(
        () => db.likes.where("clips_id").equals(activeTrack?.id).toArray(),
        [activeTrack?.id]
    );

    const my_like = useLiveQuery(
        () =>
            db.likes
                .where("users_id")
                .equals(user?.id)
                .and((like: Likes) => like.clips_id === activeTrack?.id)
                .first(),
        [user?.id, activeTrack?.id]
    );

    const inMyPlaylist = useLiveQuery(() =>
        db.playlist
            .where("users_id")
            .equals(user?.id)
            .and((playlist: any) => playlist?.clip?.id === activeTrack?.id)
            .first(),
        [user?.id, activeTrack?.id]
    );

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
            dispatch(setIsGlobalPlaying(false));
            audioPause();
        } else {
            if (activeTrack.audio_local) {
                const audioBlob = await getDownloadedAudio(activeTrack.audio_local);
                dispatch(setAudioSrc(audioBlob));
            } else {
                dispatch(setAudioSrc(baseURL + activeTrack.audio));
            }

            if (idx !== undefined) dispatch(setGlobalPos(idx));

            dispatch(setGlobalAudio({ ...activeTrack, inMyPlaylist }));
            dispatch(setIsGlobalPlaying(true));
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

    // Effect for Background controls (if controlling global audio)
    useEffect(() => {
        if (real_duration && !track) { // Only bind background if it's the main player (Clip)
            startBackground();
            create(
                baseURL,
                globalAudio,
                real_duration,
                audioPlay,
                audioPause,
                goToPrev,
                goToNext
            );
        }
    }, [real_duration]);

    return {
        audioRef,
        activeTrack,
        isPlaying,
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
        goToPrev,
        goToNext,
        onLoadedMetadata,
        onTimeUpdate,
        onUpdateBuffer,
        globalPos,
        listAudios,
    };
};
