"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SoundMap = {
    success: string;
    error: string;
    click: string;
};

const DEFAULT_SOUNDS: SoundMap = {
    success: "/sounds/success.mp3",
    error: "/sounds/error.mp3",
    click: "/sounds/click.mp3",
};

export function usePageSound(custom?: Partial<SoundMap>) {
    const sounds = useMemo<SoundMap>(() => ({ ...DEFAULT_SOUNDS, ...custom }), [custom]);
    const cache = useRef<Record<keyof SoundMap, HTMLAudioElement>>({} as Record<keyof SoundMap, HTMLAudioElement>);
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        // preferência do usuário
        const saved = localStorage.getItem("gm_sound_enabled");
        setEnabled(saved === "1");
        // pre-carrega
        (Object.keys(sounds) as Array<keyof SoundMap>).forEach((k) => {
            const el = new Audio(sounds[k]);
            el.preload = "auto";
            el.volume = 0.35;
            cache.current[k] = el;
        });
    }, [sounds]);

    function toggle() {
        const next = !enabled;
        setEnabled(next);
        localStorage.setItem("gm_sound_enabled", next ? "1" : "0");
    }

    function play(key: keyof SoundMap) {
        if (!enabled) return;
        const el = cache.current[key];
        if (!el) return;
        try {
            el.currentTime = 0;
            void el.play();
        } catch {
            /* ignore */
        }
    }

    return { enabled, toggle, play };
}
