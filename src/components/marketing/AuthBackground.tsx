"use client";

import { useEffect, useState } from "react";
import Particles from "@/components/marketing/Particles";

export default function AuthBackground() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    return (
        <>
            {/* Partículas + gradient + noise */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Particles count={140} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_60%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-35" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* Dragão com fade lateral para não “cortar” */}
            <div className="absolute inset-0 z-10">
                {!reducedMotion ? (
                    <video
                        className="absolute right-0 top-0 h-full w-auto min-w-[125%] object-cover object-right opacity-20"
                        style={{
                            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
                            maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)",
                        }}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        poster="/poster.jpg"
                        aria-hidden
                    >
                        <source src="/dragon-1080.webm" type="video/webm" />
                        <source src="/dragon-1080.mp4" type="video/mp4" />
                    </video>
                ) : (
                    <img src="/poster.jpg" alt="" className="absolute right-0 top-0 h-full w-auto min-w-[125%] object-cover object-right opacity-20" />
                )}
                {/* Fallback do fade */}
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-56 bg-gradient-to-r from-black via-black/60 to-transparent" />
            </div>

            {/* Camada de legibilidade */}
            <div className="absolute inset-0 z-20 bg-black/40" />
        </>
    );
}
