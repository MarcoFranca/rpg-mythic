"use client";

import { useEffect, useState } from "react";
import Particles from "@/components/marketing/Particles";

export default function HeroDragon({ children }: { children: React.ReactNode }) {
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-black">
            {/* Vídeo do dragão (fundo) */}
            <div className="absolute inset-0 z-10 flex items-center justify-end">
                {!reducedMotion ? (
                    <video
                        className="
          absolute right-0 top-0 h-full w-auto
          object-cover object-right
          opacity-25 bg-black
        "
                        style={{
                            WebkitMaskImage:
                                "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
                            maskImage:
                                "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
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
                    <img
                        src="/poster.jpg"
                        alt=""
                        className="h-full object-contain opacity-25"
                    />
                )}
            </div>

            {/* Partículas acima do vídeo, abaixo do conteúdo */}
            <div className="pointer-events-none absolute inset-0 z-20">
                <Particles />
            </div>

            {/* Camadas de cor para legibilidade */}
            <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_65%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_65%)]" />
            <div className="absolute inset-0 z-20 bg-black/35" />

            {/* Conteúdo (título/CTA) */}
            <div className="relative z-30 mx-auto grid h-[80vh] max-w-7xl content-center px-6 pt-2 md:pb-24">
                {children}
            </div>
        </section>
    );
}
