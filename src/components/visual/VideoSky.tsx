"use client";

import { useEffect, useRef } from "react";

type Props = {
    src: string;          // MP4 principal
    srcWebm?: string;     // WEBM (quando tiver)
    poster?: string;
    opacity?: number;     // 0..1
    darken?: number;      // 0..1 (vignette base)
    hue?: number;         // 0..360
    saturation?: number;  // 0..2
    brightness?: number;  // 0..2
    blur?: number;        // px
    className?: string;   // <-- adicionado
    children?: React.ReactNode;
};

export default function VideoSky({
                                     src, srcWebm, poster,
                                     opacity = 0.8, darken = 0.35,
                                     hue = 210, saturation = 1.0, brightness = 0.95, blur = 0,
                                     className,
                                     children,
                                 }: Props) {
    const ref = useRef<HTMLVideoElement | null>(null);

    // autoplay silencioso
    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        v.muted = true;
        const play = () => v.play().catch(() => {});
        const onReady = () => play();
        v.addEventListener("canplay", onReady, { once: true });
        play();
        const onVis = () => document.visibilityState === "visible" && play();
        document.addEventListener("visibilitychange", onVis);
        return () => {
            v.removeEventListener("canplay", onReady);
            document.removeEventListener("visibilitychange", onVis);
        };
    }, []);

    return (
        <div className={`pointer-events-none absolute inset-0 z-50 overflow-hidden ${className ?? ""}`}>
            <div
                className="absolute inset-0"
                style={{
                    filter: `hue-rotate(${hue}deg) saturate(${saturation}) brightness(${brightness}) blur(${blur}px)`,
                    opacity,
                }}
            >
                <video
                    ref={ref}
                    className="h-full w-full object-cover"
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="metadata"
                    poster={poster}
                >
                    {srcWebm && <source src={srcWebm} type="video/webm" />}
                    <source src={src} type="video/mp4" />
                </video>
            </div>

            {/* Vignette / foco central */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse at center,
            rgba(0,0,0,0) 40%,
            rgba(0,0,0,${darken}) 70%,
            rgba(0,0,0,${Math.min(darken + 0.25, 0.85)}) 100%)`,
                }}
            />

            {/* Grão */}
            <div
                className="absolute inset-0 mix-blend-screen opacity-25"
                style={{ backgroundImage: "url('/noise.png')" }}
            />

            {children}
        </div>
    );
}
