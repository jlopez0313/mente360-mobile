import { useEffect, useState } from "react";

export function useAudioDuration(src: string | undefined): string | null {
    const [duration, setDuration] = useState<string | null>(null);

    useEffect(() => {
        if (!src) return;
        setDuration(null);

        const audio = new Audio();
        const handler = () => {
            const secs = audio.duration;
            if (!isNaN(secs) && isFinite(secs)) {
                const minutes = Math.floor(secs / 60);
                const seconds = Math.floor(secs % 60);
                setDuration(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
            }
        };
        audio.addEventListener("loadedmetadata", handler);
        audio.preload = "metadata";
        audio.src = src;

        return () => {
            audio.removeEventListener("loadedmetadata", handler);
            audio.src = "";
        };
    }, [src]);

    return duration;
}
