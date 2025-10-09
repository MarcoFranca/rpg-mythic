"use client";

import { toast } from "sonner";
import { useAudio } from "@/app/providers/audio-provider";
import { usePageSound } from "@/hooks/useSound";
import { motion } from "framer-motion";
import {
    CheckCircle2, AlertTriangle, Info,
    Dices, Sword, Eye
} from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Role = "PLAYER" | "GM" | "SPECTATOR";

/* ======================= ÍCONES ======================= */
function IconFor({ kind }: { kind: ToastKind }) {
    const cls =
        kind === "success" ? "text-emerald-300" :
            kind === "error"   ? "text-rose-300" :
                "text-cyan-300";
    const Comp = kind === "success" ? CheckCircle2 : kind === "error" ? AlertTriangle : Info;
    return <Comp className={`h-5 w-5 ${cls}`} />;
}

function RPGIcon({ role }: { role?: Role }) {
    const Comp = role === "GM" ? Sword : role === "SPECTATOR" ? Eye : Dices;
    return <Comp className="h-4 w-4 text-emerald-300" />;
}

/* ======================= AURA ======================= */
function Aura({ color }: { color: string }) {
    return (
        <div
            className={`absolute -inset-1 rounded-2xl blur-md opacity-70 bg-gradient-to-r ${color} pointer-events-none`}
            style={{ WebkitMaskImage: "radial-gradient(white, transparent 75%)" }}
        />
    );
}

const auraByKind: Record<ToastKind, string> = {
    success: "from-emerald-400/25 via-teal-400/20 to-cyan-400/10",
    error:   "from-rose-400/25 via-fuchsia-400/20 to-purple-400/10",
    info:    "from-cyan-400/25 via-indigo-400/20 to-fuchsia-400/10",
};

/* ======================= CANTOS RÚNICOS ======================= */
/** Pequenos sigilos nos cantos (bem discreto) */
/** Pequenos sigilos nos cantos (bem discreto) — versão compatível com TS */
function CornerSigils({
                          size = 12,
                          opacity = 0.22,
                          color = "#34d399",
                          inset = 8,
                          icons = ["/symbols/runa.svg","/symbols/runa2.svg","/symbols/runa3.svg","/symbols/runa2.svg"],
                      }: {
    size?: number; opacity?: number; color?: string; inset?: number; icons?: string[];
}) {
    // um único tipo com props opcionais resolve o erro de union
    type Spot = {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        r: number; // rotation
        i: number; // qual ícone usar
    };

    const spots: Spot[] = [
        { left: inset,  top: inset,     r: -15, i: 0 },
        { right: inset, top: inset,     r:  15, i: 1 },
        { left: inset,  bottom: inset,  r:  15, i: 2 },
        { right: inset, bottom: inset,  r: -15, i: 3 },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            {spots.map((p, idx) => (
                <span
                    key={idx}
                    className="absolute"
                    style={{
                        ...(p.left   !== undefined ? { left: p.left } : {}),
                        ...(p.right  !== undefined ? { right: p.right } : {}),
                        ...(p.top    !== undefined ? { top: p.top } : {}),
                        ...(p.bottom !== undefined ? { bottom: p.bottom } : {}),
                        width: size,
                        height: size,
                        opacity,
                        transform: `rotate(${p.r}deg)`,
                        backgroundColor: color,
                        WebkitMaskImage: `url(${icons[p.i % icons.length]})`,
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                        maskImage: `url(${icons[p.i % icons.length]})`,
                        maskRepeat: "no-repeat",
                        maskSize: "contain",
                        filter: "drop-shadow(0 0 4px rgba(52,211,153,0.4))",
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
}

/* ======================= CRISTAIS ======================= */
function MagicFragmentsCrystal() {
    type Shard = { x: number; y: number; s: number; d: number; r0: number; r1: number; path: string };
    const shards: Shard[] = [
        { x: -28, y: -6,  s: 18, d: 2.2, r0: -12, r1: 6,  path: "50% 0%, 100% 60%, 60% 100%, 0% 40%" },
        { x:  22, y: -10, s: 14, d: 1.9, r0: 8,   r1: 24, path: "0% 20%, 70% 0%, 100% 80%, 35% 100%" },
        { x: -6,  y: 10,  s: 12, d: 1.7, r0: -30, r1: -10,path: "50% 0%, 85% 35%, 60% 100%, 0% 70%" },
        { x:  34, y: 12,  s: 16, d: 2.4, r0: 18,  r1: 36, path: "25% 0%, 100% 20%, 80% 100%, 0% 75%" },
        { x: -22, y: 18,  s: 10, d: 1.5, r0: -20, r1: 0,  path: "55% 0%, 100% 55%, 40% 100%, 0% 45%" },
        { x:  8,  y: -18, s: 11, d: 2.0, r0: -8,  r1: 18, path: "40% 0%, 100% 35%, 70% 100%, 0% 65%" },
    ];
    const sparks = [
        { x: -18, y: -14, d: 1.2 },
        { x:  16, y:  -8, d: 1.1 },
        { x:  -4, y:  16, d: 1.0 },
        { x:  28, y:   4, d: 1.3 },
    ] as const;

    return (
        <div className="pointer-events-none absolute inset-0 z-0">
            {shards.map((sh, i) => (
                <motion.span
                    key={`crystal-${i}`}
                    initial={{ opacity: 0.32, x: sh.x, y: sh.y, rotate: sh.r0, scale: 0.98 }}
                    animate={{ opacity: [0.32, 0.7, 0.32], y: [sh.y, sh.y - 8, sh.y], rotate: [sh.r0, sh.r1, sh.r0], scale: [0.98, 1.02, 0.98] }}
                    transition={{ duration: sh.d, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute"
                    style={{
                        left: `calc(50% + ${sh.x}px)`,
                        top: `calc(50% + ${sh.y}px)`,
                        width: sh.s,
                        height: Math.round(sh.s * 1.25),
                        clipPath: `polygon(${sh.path})`,
                        background: "linear-gradient(180deg, rgba(16,185,129,0.85) 0%, rgba(16,185,129,0.28) 70%, rgba(16,185,129,0.10) 100%)",
                        boxShadow: "0 0 14px rgba(16,185,129,0.35), inset 0 0 10px rgba(255,255,255,0.08)",
                        filter: "drop-shadow(0 0 6px rgba(16,185,129,0.35))",
                    }}
                />
            ))}
            {sparks.map((sp, i) => (
                <motion.span
                    key={`spark-${i}`}
                    initial={{ opacity: 0.0, x: sp.x, y: sp.y, scale: 0.7 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.7, 1, 0.7] }}
                    transition={{ duration: sp.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                    className="absolute rounded-full"
                    style={{
                        left: `calc(50% + ${sp.x}px)`,
                        top: `calc(50% + ${sp.y}px)`,
                        width: 3,
                        height: 3,
                        background: "radial-gradient(circle, rgba(134,239,172,1) 0%, rgba(134,239,172,0.1) 70%)",
                        boxShadow: "0 0 10px rgba(134,239,172,0.8)",
                    }}
                />
            ))}
        </div>
    );
}

/* ======================= TOAST ======================= */
function MagicToast({
                        kind, title, description, role,
                    }: { kind: ToastKind; title: string; description?: string; role?: Role }) {
    const border =
        kind === "success" ? "border-emerald-400/35" :
            kind === "error"   ? "border-rose-400/35" :
                "border-cyan-400/35";

    return (
        <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative overflow-hidden rounded-2xl border ${border}
                  bg-black/70 px-4 py-3 shadow-[0_0_30px_rgba(0,0,0,0.35)]
                  backdrop-blur-md`}
        >
            {/* fundo místico */}
            <Aura color={auraByKind[kind]} />

            {/* sigilos discretos nos cantos */}
            <CornerSigils opacity={0.22} inset={8} size={11} />

            {/* cristais e faíscas */}
            <MagicFragmentsCrystal />

            {/* selo RPG à esquerda */}
            <div className="absolute left-2 top-2 z-10 grid place-items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 p-1 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                <RPGIcon role={role} />
            </div>

            {/* conteúdo */}
            <div className="relative z-10 flex items-start gap-3 pl-7">
                <div className="mt-0.5">
                    <IconFor kind={kind} />
                </div>
                <div>
                    <div className="text-sm font-semibold text-white">{title}</div>
                    {description && <div className="mt-0.5 text-xs text-white/80">{description}</div>}
                </div>
            </div>
        </motion.div>
    );
}

/* ======================= HOOK ======================= */
export function useMythicToast() {
    const { interacted } = useAudio();
    const { play } = usePageSound();

    function playSafe(kind: ToastKind) {
        const key = kind === "success" ? "success" : kind === "error" ? "error" : "click";
        if (interacted) { play(key); return; }
        const once = () => { play(key); window.removeEventListener("pointerdown", once); window.removeEventListener("keydown", once); };
        window.addEventListener("pointerdown", once, { once: true, passive: true });
        window.addEventListener("keydown", once, { once: true, passive: true });
    }

    function notify(kind: ToastKind, title: string, description?: string) {
        playSafe(kind);
        if (kind === "success") toast.success(title, { description });
        else if (kind === "error") toast.error(title, { description });
        else toast(title, { description });
    }

    function notifyMagic(
        kind: ToastKind,
        title: string,
        description?: string,
        opts?: { role?: Role; duration?: number },
    ) {
        playSafe(kind);
        toast.custom(
            () => <MagicToast kind={kind} title={title} description={description} role={opts?.role} />,
            { duration: opts?.duration ?? 3500 }
        );
    }

    return { notify, notifyMagic };
}
