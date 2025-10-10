// /src/components/player/PlayerObelisk.tsx
"use client";

import { motion, useMotionValue, type TargetAndTransition } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { User, Package, BookOpen, Swords } from "lucide-react";
import { useEter } from "@/lib/eter/state";
import PrismaSVG from "@/assets/prisma.svg";
import { useAudio } from "@/app/providers/audio-provider";

type MenuId = "character" | "inventory" | "spells" | "campaigns";
type Props = { onOpen: (section: MenuId) => void };

export function PlayerObelisk({ onOpen }: Props) {
    const { theme } = useEter();
    const { playSfx: play } = useAudio();
    const [open, setOpen] = useState(false);
    const [reduce, setReduce] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const menuId = "player-obelisk-menu";

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduce(mq.matches);
        update();
        mq.addEventListener?.("change", update);
        return () => mq.removeEventListener?.("change", update);
    }, []);

    // tilt 3D
    const rotX = useMotionValue(0);
    const rotY = useMotionValue(0);
    const onMove = (e: React.MouseEvent) => {
        if (reduce) return;
        const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        rotX.set(dy * -6);
        rotY.set(dx * 6);
    };
    const onLeave = () => { rotX.set(0); rotY.set(0); };

    const flicker: TargetAndTransition = reduce
        ? { opacity: 1, filter: "brightness(1)" }
        : {
            opacity: [1, 0.2, 1, 0.25, 1, 1, 0.3, 1],
            filter: [
                "brightness(1)",
                "brightness(0.7)",
                "brightness(1.08)",
                "brightness(0.75)",
                "brightness(1.1)",
                "brightness(1.05)",
                "brightness(0.8)",
                "brightness(1)",
            ],
            transition: {
                duration: 1.05,
                repeat: Infinity,
                ease: [0.42, 0.12, 0.58, 1],
                times: [0, 0.05, 0.10, 0.16, 0.22, 0.70, 0.82, 1],
                repeatDelay: 0.04,
            },
        };

    // fecha ao clicar fora / ESC
    useEffect(() => {
        if (!open) return;
        const onDown = (ev: PointerEvent) => {
            if (!rootRef.current) return;
            const target = ev.target as Node;
            if (!rootRef.current.contains(target)) {
                setOpen(false);
                play("closeModal");
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setOpen(false); play("closeModal"); }
        };
        // usar captura = true nas duas chamadas (add/remove) para evitar cast
        document.addEventListener("pointerdown", onDown, true);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown, true);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, play]);

    const items: { id: MenuId; label: string; icon: React.ReactNode }[] = useMemo(
        () => [
            { id: "character", label: "Eco da Alma", icon: <User className="h-4 w-4" /> },
            { id: "inventory", label: "Inventário Mítico", icon: <Package className="h-4 w-4" /> },
            { id: "spells", label: "Vibração do Éter", icon: <BookOpen className="h-4 w-4" /> },
            { id: "campaigns", label: "Atravessar o Véu", icon: <Swords className="h-4 w-4" /> },
        ],
        []
    );

    const ringStyle: CSSProperties & Record<string, string> = {
        boxShadow: `0 0 0 2px ${theme.accentSoft}, inset 0 0 90px ${theme.accentSoft}`,
        ["--tw-ring-color" as string]: "var(--ring-ether)",
        transformStyle: "preserve-3d",
    };

    return (
        <div ref={rootRef} className="relative grid place-items-center">
            {/* defs */}
            <svg width="0" height="0" aria-hidden="true" className="absolute">
                <defs>
                    <filter id="ether-glass" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="7" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
                        <feSpecularLighting result="spec" surfaceScale="3" specularConstant="0.35" specularExponent="15" lightingColor={theme.accent}>
                            <fePointLight x="-50" y="-80" z="80" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceAlpha" operator="in" result="specMasked" />
                        <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="specMasked" /></feMerge>
                    </filter>
                    <radialGradient id="soft-round" r="0.55">
                        <stop offset="70%" stopColor="white" /><stop offset="100%" stopColor="black" />
                    </radialGradient>
                    <mask id="round-mask"><rect x="-50%" y="-50%" width="200%" height="200%" fill="url(#soft-round)" /></mask>
                    <filter id="ether-noise" x="-20%" y="-20%" width="160%" height="160%">
                        <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" seed="12" result="n" />
                        <feColorMatrix type="saturate" values="0.2" />
                        <feComponentTransfer><feFuncA type="table" tableValues="0 0.04" /></feComponentTransfer>
                        <feBlend in2="SourceGraphic" mode="screen" />
                    </filter>
                </defs>
            </svg>

            {/* Botão / Núcleo */}
            <motion.button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? "Fechar menu do Obelisco" : "Abrir menu do Obelisco"}
                onClick={() => {
                    const next = !open;
                    setOpen(next);
                    if (next) play("openModal"); else play("closeModal");
                }}
                onMouseEnter={() => play("hover")}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="relative z-20 grid h-44 w-44 cursor-pointer place-items-center rounded-full focus:outline-none focus-visible:ring-2"
                style={ringStyle}
            >
                {/* Flutuação */}
                <motion.div
                    initial={{ y: 0, scale: 1, rotateZ: 0, opacity: 1 }}
                    animate={
                        reduce ? { y: 0, scale: 1, rotateZ: 0, opacity: 1 } : {
                            y: [0, -8, 0, -4, 0],
                            scale: [1, 1.01, 1, 1.005, 1],
                            rotateZ: [-0.35, 0.35, -0.15, 0],
                            opacity: [1, 0.35, 1, 0.6, 1],
                        }
                    }
                    transition={{ duration: 6.5, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
                    style={{
                        transformPerspective: 900,
                        rotateX: rotX,
                        rotateY: rotY,
                    }}
                    className="relative grid place-items-center"
                >
                    {/* Prisma */}
                    <motion.div
                        animate={flicker}
                        className="relative h-28 w-28"
                        style={{ opacity: 0.96, mixBlendMode: "screen", filter: "url(#ether-glass)" }}
                    >
                        <PrismaSVG className="h-28 w-28" style={{ color: theme.accent }} />
                    </motion.div>

                    {/* Halo */}
                    {!reduce && (
                        <motion.div
                            className="pointer-events-none absolute rounded-full"
                            style={{ width: 182, height: 182, boxShadow: `0 0 0 1px ${theme.accentSoft}`, opacity: 0.55 }}
                            animate={{ opacity: [0.45, 0.75, 0.45] }}
                            transition={{ duration: 5.5, repeat: Infinity }}
                        />
                    )}

                    {/* Feixe */}
                    {!reduce && (
                        <motion.div
                            aria-hidden
                            className="pointer-events-none absolute"
                            style={{
                                width: 240, height: 240,
                                maskImage: "radial-gradient(closest-side, #000 68%, transparent 100%)",
                                WebkitMaskImage: "radial-gradient(closest-side, #000 68%, transparent 100%)",
                                background:
                                    "linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.30) 35%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.00) 100%)",
                                filter: "blur(6px)",
                                mixBlendMode: "screen",
                                opacity: 0.85,
                            }}
                            initial={{ rotate: -25, x: -60 }}
                            animate={{ x: [-60, 60, -60] }}
                            transition={{ duration: 9, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
                        />
                    )}

                    {/* Cáusticas */}
                    {!reduce && (
                        <>
                            {[
                                { r: 70, size: 6, dur: 9.5, delay: 0.2 },
                                { r: 58, size: 5, dur: 7.5, delay: 1.1 },
                                { r: 82, size: 4, dur: 11,  delay: 2.3 },
                                { r: 66, size: 3, dur: 6.8, delay: 3.2 },
                            ].map((c, i) => (
                                <motion.div
                                    key={i}
                                    className="pointer-events-none absolute rounded-full"
                                    style={{
                                        width: c.size, height: c.size,
                                        boxShadow: `0 0 12px 4px ${theme.accentSoft}`,
                                        background: "white", mixBlendMode: "screen",
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: c.dur, repeat: Infinity, ease: "linear", delay: c.delay }}
                                >
                                    <div style={{ transform: `translate(${c.r}px, 0)` }} className="h-full w-full" />
                                </motion.div>
                            ))}
                        </>
                    )}
                </motion.div>

                {/* Glow externo */}
                {!reduce && (
                    <motion.div
                        className="pointer-events-none absolute inset-0 rounded-full"
                        style={{ boxShadow: `0 0 80px 14px ${theme.accentSoft}` }}
                        animate={{ opacity: [0.3, 0.85, 0.35, 0.7, 0.3] }}
                        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
            </motion.button>

            {/* Menu radial */}
            <div id={menuId} className="absolute inset-0 z-10" style={{ pointerEvents: "none" }} aria-hidden={!open}>
                {items.map((it, idx) => {
                    const angle = (idx / items.length) * Math.PI * 2;
                    const r = 96;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    return (
                        <motion.button
                            key={it.id}
                            type="button"
                            onClick={() => { onOpen(it.id); setOpen(false); play("closeModal"); }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/8 px-3 py-1.5 text-xs backdrop-blur hover:brightness-110 focus:outline-none focus-visible:ring-2"
                            style={{
                                boxShadow: `0 0 0 1px ${theme.accentSoft}`,
                                pointerEvents: open ? "auto" : "none",
                                ["--tw-ring-color" as string]: "var(--ring-ether)",
                            }}
                            onMouseEnter={() => play("hover")}
                            initial={false}
                            animate={open ? { x, y, opacity: 1, scale: 1 } : { x: 0, y: 0, opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 250, damping: 20 }}
                            aria-label={it.label}
                        >
                            <span className="mr-2 inline-flex">{it.icon}</span>
                            <span>{it.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
