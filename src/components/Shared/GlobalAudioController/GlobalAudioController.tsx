import { setIsGlobalPlaying, setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export const GlobalAudioController = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isGlobalPlaying } = useSelector((state: any) => state.audio);

    useEffect(() => {
        // Wait for router changes.
        const path = location.pathname;

        const isCanales = path.includes("/canales");
        const isClip = path.includes("/musicaterapia/clip");

        if (isCanales || isClip) {
            // Hide mini player
            dispatch(setShowGlobalAudio(false));

            // We do not stop the audio automatically when navigating 
            // to Clip because it plays there in the big player.
            if (isCanales && isGlobalPlaying) {
                dispatch(setIsGlobalPlaying(false));
            }
        } else {
            // Show mini player anywhere else
            dispatch(setShowGlobalAudio(true));
        }

    }, [location.pathname, isGlobalPlaying]);

    return null;
};
