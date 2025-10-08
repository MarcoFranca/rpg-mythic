// hooks/useSound.ts
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAudio } from "@/app/providers/audio-provider";

type SoundMap = {
    success: string;
    error: string;
    click: string;
    hover: string;
    openModal: string;
    closeModal: string;
};

const DEFAULT_SOUNDS: SoundMap = {
    success: "/sounds/success.wav",             // harmonia-elyra (pode renomear o arquivo)
    error:   "/sounds/error.wav",               // dissonancia-umbra
    click:   "/sounds/click.wav",               // eco-artehon
    hover:   "/sounds/hover.wav",               // brisa-eter
    openModal: "/sounds/open.wav",
    closeModal: "/sounds/close.wav",
};

/**
 * SFX utilitário por página/componente:
 * - Pré-carrega os sons pedidos.
 * - Só toca se enabled && interacted === true.
 * - NÃO cria loop (isso é do provider).
 */
export function usePageSound(custom?: Partial<SoundMap>) {
    const { enabled, interacted } = useAudio();

    const sounds = useMemo<SoundMap>(() => ({ ...DEFAULT_SOUNDS, ...custom }), [custom]);
    const cache = useRef<Record<keyof SoundMap, HTMLAudioElement>>({} as any);

    // pré-carregar e manter instâncias locais para SFX
    useEffect(() => {
        (Object.keys(sounds) as Array<keyof SoundMap>).forEach((k) => {
            const el = new Audio(sounds[k]);
            el.preload = "auto";
            el.volume = 0.35;
            cache.current[k] = el;
        });
        // opcional: cleanup
        return () => {
            (Object.values(cache.current) as HTMLAudioElement[]).forEach((a) => {
                try { a.pause(); } catch {}
            });
            cache.current = {} as any;
        };
    }, [sounds]);

    function play(key: keyof SoundMap) {
        // 👇 BLOQUEIO anti-NotAllowedError após refresh:
        if (!enabled || !interacted) return; // não tente tocar antes do primeiro gesto do usuário
        const el = cache.current[key];
        if (!el) return;
        try {
            el.currentTime = 0;
            void el.play();
        } catch {}
    }

    return { enabled, play };
}
