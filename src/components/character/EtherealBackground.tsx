// src/components/character/EtherealBackground.tsx
"use client";
import { useEffect, useMemo, useState } from "react";

type Props = {
    /** caminho base do vídeo (sem extensão). Ex.: /videos/player */
    srcBase: string;
    poster: string;
    veil?: number;
    blurPx?: number;
};

export default function EtherealBackground({ srcBase, poster, veil = 0.75, blurPx = 2 }: Props) {
    const [canAnimate, setCanAnimate] = useState(true);

    useEffect(() => {
        const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })?.connection?.saveData;
        setCanAnimate(!mqReduce.matches && !saveData);
    }, []);

    // remove .mp4/.webm caso venham por engano
    const base = useMemo(() => srcBase.replace(/\.(mp4|webm)$/i, ""), [srcBase]);

    const veilStyle = useMemo<React.CSSProperties>(
        () => ({ opacity: Math.max(0, Math.min(1, veil)), backdropFilter: `blur(${blurPx}px)` }),
        [veil, blurPx]
    );

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {canAnimate ? (
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="metadata"
                    poster={poster}
                    style={{ filter: "saturate(0.9) contrast(1.05) brightness(0.9)" }}
                >
                    {/* prefira webm primeiro */}
                    <source src={`${base}.webm`} type="video/webm" />
                    <source src={`${base}.mp4`} type="video/mp4" />
                </video>
            ) : (
                <img
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: "saturate(0.9) contrast(1.05) brightness(0.9)" }}
                />
            )}

            {/* véu para legibilidade */}
            <div className="absolute inset-0" style={veilStyle}>
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(34,211,238,0.20),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(50%_35%_at_50%_100%,rgba(234,179,8,0.18),transparent_70%)]" />
            </div>
        </div>
    );
}
