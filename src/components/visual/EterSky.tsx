"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import VideoSky from "./VideoSky";

type VideoProps = { src: string; poster?: string; srcWebm?: string };

type Props = {
    /** 0–100 — harmonia (0) → dissonância (100) */
    idg?: number;
    /** Vídeo de fundo (opcional). */
    video?: VideoProps | null;
    /** Opacidade do vídeo (0..1) */
    opacity?: number;
    /** Vignette do vídeo (0..1) */
    darken?: number;
    /** Z-index (negativo para ficar atrás de tudo) */
    zIndex?: number;
    /** Blur do vídeo (px) */
    blur?: number;

    /** NOVOS CONTROLES DO ANEL */
    ringSizeVmin?: number;                     // default 90
    ringCenter?: { x: string; y: string };     // default 50/50
    ringSoftness?: number;                     // 0..1 (controla blur/aura)
};

export default function EterSky({
                                    idg = 45,
                                    video,
                                    opacity = 0.9,
                                    darken = 0.38,
                                    zIndex = -10,
                                    blur = 0.6,
                                    ringSizeVmin = 110,
                                    ringCenter = { x: "58%", y: "58%" },
                                    ringSoftness = 1,
                                }: Props) {
    // respeita prefers-reduced-motion
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduce(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    // paleta do IDG
    const { ringColor, auraColor, hue } = useMemo(() => {
        const hueA = idg < 33 ? 190 : idg < 66 ? 265 : 285; // anel
        const hueB = idg < 33 ? 158 : idg < 66 ? 160 : 320; // aura
        return {
            ringColor: `hsla(${hueA}, 90%, 65%, 0.55)`,
            auraColor: `hsla(${hueB}, 85%, 62%, 0.35)`,
            hue: idg < 33 ? 190 : idg < 66 ? 260 : 285,
        };
    }, [idg]);

    return (
        <div className="pointer-events-none absolute inset-0" style={{ zIndex }}>
            {/* Vídeo (opcional) */}
            {video && (
                <VideoSky
                    className="z-50"
                    src={video.src}
                    srcWebm={video.srcWebm}
                    poster={video.poster}
                    opacity={opacity}
                    darken={darken}
                    hue={hue}
                    saturation={1.0}
                    brightness={0.95}
                    blur={blur}
                />
            )}

            {/* Estrelas/grão por cima do vídeo */}
            <Starfield />

            {/* Anel etéreo com controles */}
            <EtherRing
                ringColor={ringColor}
                auraColor={auraColor}
                reduce={reduce}
                sizeVmin={ringSizeVmin}
                center={ringCenter}
                softness={ringSoftness}
            />
        </div>
    );
}

/* ---------- subcomponentes ---------- */

/** Estrelas / grão */
function Starfield() {
    return (
        <>
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(1200px 800px at 70% 45%, rgba(255,255,255,0.06), transparent 60%),
            radial-gradient(900px 800px at 20% 60%, rgba(255,255,255,0.05), transparent 65%),
            radial-gradient(circle at 40% 20%, rgba(255,255,255,0.025) 1px, transparent 2px) 0 0/3px 3px,
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.02) 1px, transparent 2px) 0 0/2px 2px`,
                    filter: "saturate(1.05) brightness(1.02)",
                }}
            />
            <div
                className="absolute inset-0 mix-blend-screen opacity-25"
                style={{ backgroundImage: "url('/noise.png')" }}
            />
        </>
    );
}

/** Anel controlável (tamanho, posição e suavidade) */
function EtherRing({
                       ringColor,
                       auraColor,
                       reduce,
                       sizeVmin = 90,
                       center = { x: "50%", y: "50%" },
                       softness = 1,
                   }: {
    ringColor: string;
    auraColor: string;
    reduce: boolean;
    sizeVmin?: number;
    center?: { x: string; y: string };
    softness?: number;
}) {
    const blur = 20 * softness;
    const auraAlpha = 0.35 * softness;

    return (
        <>
            <motion.div
                className="absolute"
                style={{
                    left: center.x,
                    top: center.y,
                    width: `${sizeVmin}vmin`,
                    height: `${sizeVmin}vmin`,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={reduce ? { rotate: 0 } : { rotate: [0, 360] }}
                transition={{ duration: 120, repeat: reduce ? 0 : Infinity, ease: "linear" }}
            >
                {/* glow externo */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `radial-gradient(closest-side, ${ringColor}, transparent 60%)`,
                        filter: `blur(${blur}px)`,
                        opacity: 0.5,
                    }}
                />
                {/* torus */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `
              conic-gradient(from 0deg,
                transparent 0deg 40deg,
                ${ringColor} 60deg,
                hsla(${ringColor.replace("hsla(","").split(",")[0]},85%,62%,${auraAlpha}) 120deg,
                ${ringColor} 180deg,
                hsla(${ringColor.replace("hsla(","").split(",")[0]},85%,62%,${auraAlpha}) 240deg,
                ${ringColor} 300deg,
                transparent 320deg 360deg)
            `,
                        WebkitMask:
                            "radial-gradient(closest-side, transparent 46%, black 52%, black 58%, transparent 64%)",
                        mask:
                            "radial-gradient(closest-side, transparent 46%, black 52%, black 58%, transparent 64%)",
                        filter: "blur(1.2px)",
                        opacity: 0.9,
                        mixBlendMode: "screen",
                    }}
                />
                {!reduce && (
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 58%)",
                            mixBlendMode: "screen",
                            WebkitMask: "radial-gradient(closest-side, black 55%, transparent 75%)",
                            mask: "radial-gradient(closest-side, black 55%, transparent 75%)",
                            filter: "blur(2px)",
                        }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </motion.div>

            {/* halo respirando */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    left: center.x,
                    top: center.y,
                    width: `${Math.round(sizeVmin * 0.6)}vmin`,
                    height: `${Math.round(sizeVmin * 0.6)}vmin`,
                    translateX: "-50%",
                    translateY: "-50%",
                    boxShadow: `0 0 220px 40px ${auraColor}`,
                }}
                animate={reduce ? { opacity: 0.45, scale: 1 } : { opacity: [0.35, 0.7, 0.35], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 8, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
            />
        </>
    );
}
