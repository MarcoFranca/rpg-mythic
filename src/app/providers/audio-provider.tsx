// app/providers/audio-provider.tsx
"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

type AudioCtx = {
    enabled: boolean;           // preferências do usuário
    interacted: boolean;        // só vira true após 1ª interação (click/tecla)
    toggle: () => void;         // liga/desliga áudio global
    ensureLoop: () => void;     // re-tenta tocar o loop (após clique)
};

const Ctx = createContext<AudioCtx | null>(null);

export function useAudio() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAudio() deve ser usado dentro de <AudioProvider/>");
    return ctx;
}

/**
 * Provider global:
 * - Um ÚNICO <audio> para o loop (sem duplicar).
 * - Respeita autoplay: só toca quando 'interacted === true'.
 * - Persiste 'enabled' no localStorage (gm_sound_enabled).
 */
export default function AudioProvider({ children }: { children: React.ReactNode }) {
    const loopRef = useRef<HTMLAudioElement | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [interacted, setInteracted] = useState(false);

    // carrega preferência (enabled)
    useEffect(() => {
        try {
            const saved = localStorage.getItem("gm_sound_enabled");
            setEnabled(saved === "1");
        } catch {}
    }, []);

    // cria o <audio> do loop uma única vez
    useEffect(() => {
        if (!loopRef.current) {
            const el = new Audio("/sounds/eter-loop.mp3");
            el.loop = true;
            el.volume = 0.25;
            el.preload = "auto";
            loopRef.current = el;
        }
    }, []);

    // tenta tocar/pausar o loop sempre que (enabled|interacted) mudar
    useEffect(() => {
        const loop = loopRef.current;
        if (!loop) return;

        if (enabled && interacted) {
            loop.play().catch(() => {
                // se ainda falhar, garantimos no próximo clique com ensureLoop()
            });
        } else {
            loop.pause();
            loop.currentTime = 0;
        }
    }, [enabled, interacted]);

    // marca 'interacted' na 1ª interação global pós-refresh
    useEffect(() => {
        const onFirstInteract = () => {
            setInteracted(true);
            window.removeEventListener("pointerdown", onFirstInteract);
            window.removeEventListener("keydown", onFirstInteract);
        };
        window.addEventListener("pointerdown", onFirstInteract, { once: true, passive: true });
        window.addEventListener("keydown", onFirstInteract, { once: true, passive: true });
        return () => {
            window.removeEventListener("pointerdown", onFirstInteract);
            window.removeEventListener("keydown", onFirstInteract);
        };
    }, []);

    const toggle = useCallback(() => {
        setEnabled((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("gm_sound_enabled", next ? "1" : "0");
            } catch {}
            return next;
        });
    }, []);

    const ensureLoop = useCallback(() => {
        // força re-play do loop após um clique
        const loop = loopRef.current;
        if (!loop) return;
        if (enabled && interacted) {
            loop.play().catch(() => {});
        }
    }, [enabled, interacted]);

    return (
        <Ctx.Provider value={{ enabled, interacted, toggle, ensureLoop }}>
            {children}
        </Ctx.Provider>
    );
}
