"use client";

import { useEffect, useState } from "react";

type Props = {
    src?: string;      // caminho do .mp4 no /public
    poster?: string;   // imagem de poster opcional
    opacity?: number;  // opacidade do vídeo (0–1)
};

export default function PortalEterBackground({
                                                 src = "/videos/anel-eter.mp4",
                                                 poster = "/videos/anel-eter-poster.jpg",
                                                 opacity = 0.75,
                                             }: Props) {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
            {/* Vídeo (loop, mudo, inline) */}
            {!reduced ? (
                <video
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ opacity }}
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster={poster}
                    aria-hidden
                />
            ) : (
                <img
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ opacity }}
                />
            )}

            {/* Realce suave no centro + vinheta para foco no card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(0,0,0,0) 46%, rgba(0,0,0,0.65) 100%)",
                }}
            />

            {/* Textura leve (opcional) */}
            <div
                className="absolute inset-0 mix-blend-screen opacity-35"
                style={{ backgroundImage: "url('/noise.png')" }}
                aria-hidden
            />
        </div>
    );
}
