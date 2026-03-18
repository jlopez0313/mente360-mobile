import { useEffect, useState } from "react";

const durationCache = new Map<string, string>();
let activeProbes = 0;
const MAX_CONCURRENT_PROBES = 2;

export function useAudioDuration(src: string | undefined): string | null {
    const [duration, setDuration] = useState<string | null>(() => src ? durationCache.get(src) || null : null);

    useEffect(() => {
        if (!src || durationCache.has(src)) return;

        let isMounted = true;
        let audio: HTMLAudioElement | null = null;

        const startProbe = async () => {
            if (activeProbes >= MAX_CONCURRENT_PROBES) {
                // If too many probes, wait a bit and retry
                setTimeout(() => { if (isMounted) startProbe(); }, 1000);
                return;
            }

            activeProbes++;
            audio = new Audio();

            const cleanup = (error = false) => {
                if (audio) {
                    audio.removeEventListener("loadedmetadata", handler);
                    audio.removeEventListener("error", errorHandler);
                    audio.src = "";
                    audio.load(); // Force reset
                    audio = null;
                    activeProbes--;
                    if (error && src) {
                        durationCache.set(src, "00:00");
                    }
                }
            };

            const errorHandler = () => cleanup(true);

            const handler = () => {
                const secs = audio?.duration;
                if (secs && !isNaN(secs) && isFinite(secs)) {
                    const minutes = Math.floor(secs / 60);
                    const seconds = Math.floor(secs % 60);
                    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                    durationCache.set(src, formatted);
                    if (isMounted) setDuration(formatted);
                }
                cleanup();
            };

            if (audio) {
                audio.addEventListener("loadedmetadata", handler);
                audio.addEventListener("error", errorHandler);
                audio.preload = "metadata";
                audio.src = src;
            }
        };

        startProbe();

        return () => {
            isMounted = false;
            // Note: the probe might continue if already started to populate the cache
        };
    }, [src]);

    return duration || durationCache.get(src || "") || null;
}
