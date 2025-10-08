// components/marketing/SectionDivider.tsx
"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
    variant?: "fade" | "wave" | "runes";
    className?: string;
    invert?: boolean; // inverte direção (ex: topo vs base)
};

export default function SectionDivider({ variant = "fade", className, invert = false }: Props) {
    if (variant === "wave") {
        return (
            <div aria-hidden className={clsx("relative h-16 md:h-20", className)}>
                <motion.svg
                    viewBox="0 0 1440 200"
                    preserveAspectRatio="none"
                    className={clsx("absolute inset-0 h-full w-full", invert && "rotate-180")}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                >
                    <defs>
                        <linearGradient id="etherGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(34,211,238,0.22)" />
                            <stop offset="55%" stopColor="rgba(251,191,36,0.16)" />
                            <stop offset="100%" stopColor="rgba(232,121,249,0.16)" />
                        </linearGradient>

                        {/* blur suave só para o halo */}
                        <filter id="softBlur" x="-10%" y="-50%" width="120%" height="200%">
                            <feGaussianBlur stdDeviation="8" edgeMode="duplicate" />
                        </filter>
                    </defs>

                    {/* halo desfocado (glow) */}
                    <path
                        d="M0,120 C240,160 480,60 720,100 C960,140 1200,40 1440,90 L1440,200 L0,200 Z"
                        fill="url(#etherGrad)"
                        filter="url(#softBlur)"
                        opacity="0.55"
                    />

                    {/* onda principal (nítida) */}
                    <path
                        d="M0,125 C240,165 480,65 720,105 C960,145 1200,45 1440,95 L1440,200 L0,200 Z"
                        fill="url(#etherGrad)"
                        opacity="0.9"
                    />

                    {/* sombra secundária mais discreta */}
                    <path
                        d="M0,140 C240,180 480,80 720,120 C960,160 1200,60 1440,110 L1440,200 L0,200 Z"
                        fill="url(#etherGrad)"
                        opacity="0.28"
                    />
                </motion.svg>
            </div>
        );
    }


    if (variant === "runes") {
        return (
            <div aria-hidden className={clsx("relative h-20 md:h-24", className)}>
                <div className="absolute inset-0 grid place-items-center">
                    <div className="relative h-16 w-16 opacity-70">
                        <div className="absolute inset-0 rounded-full border border-white/10" />
                        <motion.div
                            className="absolute inset-0"
                            initial={{ rotate: 8, opacity: 0 }}
                            whileInView={{ rotate: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* use um SVG de runas próprio aqui se quiser */}
                            <img src="/rune-ring.svg" alt="" className="h-full w-full invert opacity-70" />
                        </motion.div>
                    </div>
                </div>
                {/* fade de base pra “colar” as seções */}
                <div
                    className={clsx(
                        "pointer-events-none absolute inset-x-0",
                        invert ? "top-0 h-10 bg-gradient-to-b from-black to-transparent" : "bottom-0 h-10 bg-gradient-to-t from-black to-transparent"
                    )}
                />
            </div>
        );
    }

    // default: fade
    return (
        <div aria-hidden className={clsx("relative", className)}>
            <div
                className={clsx(
                    "pointer-events-none absolute inset-x-0",
                    invert ? "top-0 h-16 md:h-24 bg-gradient-to-b from-black via-black/70 to-transparent" : "bottom-0 h-16 md:h-24 bg-gradient-to-t from-black via-black/70 to-transparent"
                )}
            />
            {/* brilhos suaves */}
            <div className="relative h-12 md:h-16">
                <div className="pointer-events-none absolute left-[10%] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-cyan-400/15 blur-2xl" />
                <div className="pointer-events-none absolute right-[12%] top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-amber-300/15 blur-2xl" />
            </div>
        </div>
    );
}
