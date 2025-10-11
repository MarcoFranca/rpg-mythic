// /src/components/player/JourneyCallout.tsx
"use client";

import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
    userName: string;
    hasCharacter: boolean;
    hasCampaigns: boolean;
    className?: string;
};

export default function JourneyCallout({
                                           userName, hasCharacter, hasCampaigns, className,
                                       }: Props) {
    const prefersReduced = useReducedMotion();

    const state: "no-char" | "no-campaign" | "ready" =
        !hasCharacter ? "no-char" : hasCampaigns ? "ready" : "no-campaign";

    const title =
        state === "no-char"
            ? "O Véu sussurra teu nome."
            : state === "no-campaign"
                ? "Teu Eco ressoa, mas o Véu ainda dorme."
                : "Os passos do teu Eco deixam fulgor na névoa.";

    const subtitle =
        state === "no-char"
            ? "Forja teu Eco da Alma e desperta a primeira centelha de Eldoryn."
            : state === "no-campaign"
                ? "Encontra um Véu pulsante ou pede passagem à mesa que te chama."
                : "Continua tua jornada — a próxima sessão já te pressente.";

    // Animações SEM 'ease' (evita erro de typings nessa versão)
    const haloAnim: TargetAndTransition = prefersReduced
        ? { opacity: 0.32, scale: 1 }
        : {
            opacity: [0.35, 0.7, 0.35],
            scale: [1, 1.05, 1],
            transition: { duration: 5.2, repeat: Infinity },
        };

    const sheenAnim: TargetAndTransition = prefersReduced
        ? { rotate: 0, opacity: 0.12 }
        : {
            rotate: [0, 360],
            opacity: [0.08, 0.22, 0.08],
            transition: { duration: 18, repeat: Infinity },
        };

    const starsAnim: TargetAndTransition = prefersReduced
        ? { opacity: 0.15 }
        : {
            opacity: [0.1, 0.25, 0.1],
            transition: { duration: 4, repeat: Infinity, delay: 0.6 },
        };

    return (
        <motion.div
            key={state}
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/15",
                "bg-[rgba(8,10,14,0.68)] backdrop-blur-md p-5 md:p-6",
                className
            )}
            style={{
                boxShadow: "0 0 0 1px rgba(255,255,255,.06), inset 0 0 160px rgba(255,215,130,.06)",
            }}
        >
            {/* Camada decorativa (atrás do conteúdo) */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
                {/* HALO radiante */}
                <motion.div
                    className="absolute -inset-10 rounded-[28px] mix-blend-screen"
                    animate={haloAnim}
                    style={{
                        background:
                            "radial-gradient(70% 70% at 50% 50%, rgba(255,205,125,0.35), rgba(0,0,0,0))",
                        filter: "blur(18px)",
                        willChange: "opacity, transform",
                    }}
                />

                <motion.div
                    className="absolute inset-0 rounded-[20px] mix-blend-screen"
                    animate={starsAnim}
                    style={{
                        backgroundImage: [
                            // pontinhos maiores
                            "radial-gradient(1.6px 1.6px at 12% 28%, rgba(255,245,200,.95) 60%, transparent 61%)",
                            "radial-gradient(1.6px 1.6px at 78% 18%, rgba(255,255,255,.95) 60%, transparent 61%)",
                            "radial-gradient(1.6px 1.6px at 32% 72%, rgba(255,235,180,.95) 60%, transparent 61%)",
                            // pontinhos menores
                            "radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,.9) 60%, transparent 61%)",
                            "radial-gradient(1px 1px at 88% 66%, rgba(255,255,210,.9) 60%, transparent 61%)",
                            "radial-gradient(1px 1px at 8% 64%, rgba(255,255,255,.9) 60%, transparent 61%)",
                        ].join(","),
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "100% 100%",
                        opacity: 0.45,        // intensidade base
                        filter: "drop-shadow(0 0 4px rgba(255,240,180,.45))",
                    }}
                />
                {/* ‘Sheen’ conic sutil */}
                <motion.div
                    className="absolute -inset-6 rounded-[28px] mix-blend-screen"
                    animate={sheenAnim}
                    style={{
                        background:
                            "conic-gradient(from 0deg at 50% 50%, rgba(255,240,200,0.0) 0deg, rgba(255,240,200,0.18) 40deg, rgba(255,240,200,0.0) 80deg)",
                        filter: "blur(10px)",
                        willChange: "transform, opacity",
                    }}
                />

                {/* poeira/estrelas */}
                <motion.div
                    className="absolute inset-0 opacity-30 mix-blend-screen"
                    animate={starsAnim}
                    style={{backgroundImage: "url('/noise.png')"}}
                />
            </div>

            {/* Conteúdo */}
            <div className="relative z-10">
                <div className="mb-1.5 text-xs text-white/70">O Véu se abre.</div>
                <h2 className="text-balance text-2xl md:text-3xl font-semibold leading-tight">
                    {title}
                </h2>
                <p className="mt-1.5 text-sm text-white/75">{subtitle}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {state === "no-char" && (
                        <Button asChild>
                            <Link href="/app/characters/new">Criar personagem</Link>
                        </Button>
                    )}

                    {state === "no-campaign" && (
                        <>
                            <Button asChild>
                                <Link href="/app/campaigns">Encontrar campanha</Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/app/calls/new">Pedir entrada</Link>
                            </Button>
                        </>
                    )}

                    {state === "ready" && (
                        <>
                            <Button asChild>
                            <Link href="/app/campaigns/my">Minhas campanhas</Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/app/characters">Abrir personagem</Link>
                            </Button>
                        </>
                    )}

                    <a
                        href="/how-to-play"
                        className="text-xs text-white/60 underline-offset-2 hover:underline"
                    >
                        Como funciona?
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
