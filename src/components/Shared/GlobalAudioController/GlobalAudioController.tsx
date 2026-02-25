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

        const isMusicaterapiaHome = path === "/musicaterapia";

        if (isMusicaterapiaHome) {
            // Show mini player if playing musicoterapia
            dispatch(setShowGlobalAudio(true));
        } else {
            // Hide mini player because the full player is visible, or it's a completely different section
            dispatch(setShowGlobalAudio(false));

            // Si salimos a Crecimientos, Home, Podcasts, Notificaciones, etc, apagamos la música global!
            // Excepción: en Clip.tsx (/musicaterapia/clip), que tampoco entra en el if de arriba (se oculta el Toast),
            // NO queremos que se pause la música global, porque allí el Audio está sonando pero en su versión grande.
            if (!path.includes("/musicaterapia/clip")) {
                if (isGlobalPlaying) {
                    dispatch(setIsGlobalPlaying(false));
                }
            }
        }
    }, [location.pathname, isGlobalPlaying]);

    return null;
};
