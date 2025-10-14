// src/components/player/OnboardingCoach.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glassClass } from "@/components/system/Glass";
import { useEter } from "@/lib/eter/state";
import { useAudio } from "@/app/providers/audio-provider";
import Link from "next/link";
import { cn } from "@/lib/utils";
import EtherealParticles from "@/components/system/EtherealParticles";
import NeonAuraBorder from "@/components/system/NeonAuraBorder";
import OuterAuraGlow from "@/components/system/OuterAuraGlow";

type Props = {
    hasCharacter: boolean;
    campaignCount: number;
    /** se existir, leva direto pra ficha; senão, para o hub de personagens */
    primaryCharacterId?: string | null;
};

type Step = {
    id: "character" | "campaign";
    title: string;
    desc: string;
    done: boolean;
    cta: { label: string; href: string };
};

export default function OnboardingCoach({
                                            hasCharacter,
                                            campaignCount,
                                            primaryCharacterId,
                                        }: Props) {
    const { idg, theme } = useEter();
    const { playSfx: play } = useAudio();

    const characterCtaHref = hasCharacter
        ? primaryCharacterId
            ? `/app/characters/${primaryCharacterId}`
            : `/app/characters`
        : `/app/characters/new`;

    const characterCtaLabel = hasCharacter
        ? primaryCharacterId
            ? "Ver Ficha"
            : "Escolher Ficha"
        : "Criar Personagem";

    const steps: Step[] = [
        {
            id: "character",
            title: hasCharacter ? "Eco revelado" : "Revelar Eco da Alma",
            desc: hasCharacter
                ? "Sua voz já vibra no Cântico."
                : "Crie seu personagem. Dê forma à nota que te chama.",
            done: hasCharacter,
            cta: { label: characterCtaLabel, href: characterCtaHref },
        },
        {
            id: "campaign",
            title: campaignCount > 0 ? "Véu encontrado" : "Entrar em um Véu",
            desc:
                campaignCount > 0
                    ? "Você já caminha em mesa viva."
                    : "Encontre uma mesa pública ou crie um chamado.",
            done: campaignCount > 0,
            cta:
                campaignCount > 0
                    ? { label: "Minhas Campanhas", href: "/app/campaigns/mine" }
                    : { label: "Encontrar campanha", href: "/app/campaigns" },
        },
    ];

    const completed = steps.filter((s) => s.done).length;
    const total = steps.length;
    const progress = Math.round((completed / total) * 100);

    // ✅ “proof-friendly” pro TS: escolhe por índice e usa non-null assertion
    const nextIdx = steps.findIndex((s) => !s.done);
    const currentStep: Step =
        nextIdx === -1 ? steps[steps.length - 1]! : steps[nextIdx]!;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative rounded-2xl",
                glassClass("p-5"),
                "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
            )}
            style={{ boxShadow: `0 0 0 1px ${theme.accentSoft}` }}
        >
            <OuterAuraGlow className="z-0" intensity={1} />

            <EtherealParticles
                className="pointer-events-none absolute inset-0 z-0"
                density={24}
                maxSize={4}
                drift={14}
                brightness={1}
            />

            <NeonAuraBorder radius={18} stroke={2} glow={0.6} className="z-10" />

            <div
                className="pointer-events-none absolute -inset-24 z-0 opacity-20 blur-3xl"
                style={{
                    background:
                        "radial-gradient(60% 60% at 50% 50%, rgba(51,204,204,.28), transparent 60%), radial-gradient(40% 40% at 70% 30%, rgba(224,179,65,.22), transparent 60%)",
                }}
            />

            <div className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider opacity-75">
                        <Sparkles className="h-3.5 w-3.5" />
                        Caminho do Cântico
                    </div>
                    <div className="text-lg font-semibold leading-snug">
                        {currentStep.id === "character"
                            ? "Revelar quem você é"
                            : "Cruzar o primeiro Véu"}
                    </div>
                    <div className="text-xs opacity-80">
                        IDG atual: {idg} • Progresso inicial: {progress}%
                    </div>
                </div>

                <div className="w-full sm:w-56">
                    <div className="h-2 w-full rounded-full bg-white/10">
                        <div
                            className="h-2 rounded-full transition-all"
                            style={{
                                width: `${progress}%`,
                                background:
                                    "linear-gradient(90deg, rgba(51,204,204,.95), rgba(224,179,65,.95))",
                                boxShadow: "0 0 16px rgba(51,204,204,.45)",
                            }}
                        />
                    </div>
                    <div className="mt-1 text-right text-[10px] opacity-75">
                        {completed}/{total} etapas
                    </div>
                </div>
            </div>

            <div className="relative z-20 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {steps.map((s) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "rounded-xl border p-4 transition-shadow",
                            s.done
                                ? "border-emerald-400/30 bg-emerald-400/5"
                                : "border-white/12 bg-white/5 ring-1 ring-cyan-300/10",
                            "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_24px_rgba(51,204,204,0.16)]",
                        )}
                    >
                        <div className="mb-2 flex items-center gap-2">
                            {s.done ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                                <CircleDashed className="h-4 w-4 opacity-80" />
                            )}
                            <div className="text-sm font-medium">{s.title}</div>
                        </div>
                        <div className="mb-3 text-xs opacity-85">{s.desc}</div>
                        <div className="flex justify-start gap-2">
                            <Button
                                asChild
                                className="rounded-lg"
                                onMouseEnter={() => play("hover")}
                                onClick={() => play("success")}
                            >
                                <Link href={s.cta.href}>{s.cta.label}</Link>
                            </Button>

                            {s.id === "campaign" && !s.done && (
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="rounded-lg"
                                    onMouseEnter={() => play("hover")}
                                    onClick={() => play("success")}
                                >
                                    <Link href="/app/calls/new">Criar chamado</Link>
                                </Button>
                            )}

                            {s.id === "character" && hasCharacter && (
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="rounded-lg"
                                    onMouseEnter={() => play("hover")}
                                    onClick={() => play("success")}
                                >
                                    <Link href="/app/characters/new">Criar outro</Link>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="pointer-events-none absolute right-3 top-2 z-20"
            >
                <Wand2 className="h-5 w-5" />
            </motion.div>
        </motion.div>
    );
}
