"use client";

import React, {
    createContext, useCallback, useContext, useEffect, useRef, useState,
} from "react";

type SoundKey = "success" | "error" | "click" | "cardSelect" | "hover" | "openModal" | "closeModal";

type AudioCtx = {
    enabled: boolean;
    interacted: boolean;
    toggle: () => void;
    ensureLoop: () => void;

    /** Toca um SFX persistente (vive no provider, não desmonta em navegação) */
    playSfx: (key: SoundKey) => void;

    /** (opcional) Registrar/override de fontes para chaves específicas */
    registerSfx: (map: Partial<Record<SoundKey, string[]>>) => void;
};

const Ctx = createContext<AudioCtx | null>(null);
export function useAudio() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAudio() deve ser usado dentro de <AudioProvider/>");
    return ctx;
}

const wav = (p: string) => `/sounds/${p}.wav`;

const DEFAULT_SFX: Record<SoundKey, string[]> = {
    success: [wav("success")],
    error: [wav("error")],
    // O arquivo disponível no projeto se chama "cick.wav".
    click: [wav("cick")],
    cardSelect: [wav("card-select")],
    hover: [wav("hover")],
    openModal: [wav("open")],
    closeModal: [wav("close")],
};

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    // ===== Loop ambiente (já existia)
    const loopRef = useRef<HTMLAudioElement | null>(null);
    const [enabled, setEnabled] = useState(true);
    const [interacted, setInteracted] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("gm_sound_enabled");
            // Sons ligados por padrão. Só respeitamos silêncio se o jogador o escolheu.
            setEnabled(saved !== "0");
        } catch {}
    }, []);

    useEffect(() => {
        if (!loopRef.current) {
            const el = new Audio("/sounds/eter-loop.mp3");
            el.loop = true;
            el.volume = 0.25;
            el.preload = "auto";
            loopRef.current = el;
        }
    }, []);

    useEffect(() => {
        const loop = loopRef.current;
        if (!loop) return;
        if (enabled && interacted) {
            loop.play().catch(() => {});
        } else {
            loop.pause();
            loop.currentTime = 0;
        }
    }, [enabled, interacted]);

    useEffect(() => {
        const onFirst = () => {
            setInteracted(true);
            // O play precisa ocorrer no próprio gesto para obedecer à política de autoplay.
            if (enabled) loopRef.current?.play().catch(() => {});
            window.removeEventListener("pointerdown", onFirst);
            window.removeEventListener("keydown", onFirst);
        };
        window.addEventListener("pointerdown", onFirst, { once: true, passive: true });
        window.addEventListener("keydown", onFirst, { once: true, passive: true });
        return () => {
            window.removeEventListener("pointerdown", onFirst);
            window.removeEventListener("keydown", onFirst);
        };
    }, [enabled]);

    const toggle = useCallback(() => {
        setEnabled((prev) => {
            const next = !prev;
            try { localStorage.setItem("gm_sound_enabled", next ? "1" : "0"); } catch {}
            return next;
        });
    }, []);

    const ensureLoop = useCallback(() => {
        const loop = loopRef.current;
        if (!loop) return;
        if (enabled && interacted) loop.play().catch(() => {});
    }, [enabled, interacted]);

    // ====== SFX persistentes (novo)
    const sfxSourcesRef = useRef<Record<SoundKey, string[]>>({ ...DEFAULT_SFX });
    const sfxMapRef = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});

    // carrega um SFX tentando as fontes na ordem (mp3 -> ogg -> wav)
    const loadSfx = useCallback(async (key: SoundKey) => {
        const urls = sfxSourcesRef.current[key] ?? [];
        for (const url of urls) {
            const el = new Audio();
            el.preload = "auto";
            el.volume = 0.35;

            const ok = await new Promise<boolean>((resolve) => {
                const onOK = () => { cleanup(); resolve(true); };
                const onErr = () => { cleanup(); resolve(false); };
                const cleanup = () => {
                    el.removeEventListener("loadeddata", onOK);
                    el.removeEventListener("canplaythrough", onOK);
                    el.removeEventListener("error", onErr);
                };
                el.addEventListener("loadeddata", onOK, { once: true });
                el.addEventListener("canplaythrough", onOK, { once: true });
                el.addEventListener("error", onErr, { once: true });
                el.src = url;
            });

            if (ok) {
                sfxMapRef.current[key] = el;
                return;
            }
        }
        // se nada carregar, deixa sem src (silencioso)
        sfxMapRef.current[key] = new Audio();
    }, []);

    // carrega todos os default na montagem (uma vez só)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            for (const key of Object.keys(DEFAULT_SFX) as SoundKey[]) {
                if (cancelled) break;
                await loadSfx(key);
            }
        })();
        return () => { cancelled = true; };
    }, [loadSfx]);

    const registerSfx = useCallback((map: Partial<Record<SoundKey, string[]>>) => {
        // permite substituir/expandir fontes (se quiser personalizar por página/tema)
        sfxSourcesRef.current = { ...sfxSourcesRef.current, ...map };
        // recarrega apenas as chaves alteradas
        Object.keys(map).forEach((k) => loadSfx(k as SoundKey));
    }, [loadSfx]);

    const playSfx = useCallback((key: SoundKey) => {
        if (!enabled || !interacted) return;
        const el = sfxMapRef.current[key];
        if (!el || !el.src) return;
        try { el.currentTime = 0; void el.play(); } catch {}
    }, [enabled, interacted]);

    // Uma camada global e discreta para os botões do sistema.
    // O som de hover toca uma vez por entrada e tem um pequeno intervalo de proteção.
    useEffect(() => {
        let hovered: HTMLElement | null = null;
        let lastHoverAt = 0;

        const controlFrom = (target: EventTarget | null, selector: string) =>
            target instanceof Element ? target.closest<HTMLElement>(selector) : null;

        const onPointerOver = (event: PointerEvent) => {
            const control = controlFrom(event.target, '[data-sfx-hover="true"]');
            if (!control || control === hovered) return;

            hovered = control;
            const now = Date.now();
            if (now - lastHoverAt < 90) return;
            lastHoverAt = now;
            playSfx("hover");
        };

        const onPointerOut = (event: PointerEvent) => {
            const control = controlFrom(event.target, '[data-sfx-hover="true"]');
            const nextControl = controlFrom(event.relatedTarget, '[data-sfx-hover="true"]');
            // Ao passar entre ícone, texto e borda do mesmo botão, não reinicia o hover.
            if (control && control === hovered && nextControl !== control) hovered = null;
        };

        const onClick = (event: MouseEvent) => {
            const control = controlFrom(event.target, "[data-sfx-click]");
            const key = control?.dataset.sfxClick;
            if (key && key in DEFAULT_SFX) playSfx(key as SoundKey);
        };

        document.addEventListener("pointerover", onPointerOver);
        document.addEventListener("pointerout", onPointerOut);
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("pointerover", onPointerOver);
            document.removeEventListener("pointerout", onPointerOut);
            document.removeEventListener("click", onClick);
        };
    }, [playSfx]);

    return (
        <Ctx.Provider value={{ enabled, interacted, toggle, ensureLoop, playSfx, registerSfx }}>
            {children}
        </Ctx.Provider>
    );
}
