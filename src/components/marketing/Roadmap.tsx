"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Timer, CircleDot } from "lucide-react";
import type { ReactNode } from "react";

type RoadItem = {
    stage: "Agora" | "Próximo" | "Lenda";
    icon: ReactNode;
    points: { label: string; status: "done" | "wip" | "plan" }[];
    accent: string; // tailwind bg gradient utility
    progress?: number; // 0..100 (opcional, para 'Próximo')
    aria: string;
};

const items: RoadItem[] = [
    {
        stage: "Agora",
        icon: <Check className="h-4 w-4" />,
        points: [
            { label: "Itens, Armas e Armaduras por partes", status: "done" },
            { label: "Consumíveis, Magias (estrutura D&D 5e)", status: "done" },
            { label: "Bestiário básico e Busca unificada", status: "done" },
        ],
        accent: "from-emerald-500/30 to-emerald-400/10",
        aria: "Funcionalidades já disponíveis",
    },
    {
        stage: "Próximo",
        icon: <Timer className="h-4 w-4" />,
        points: [
            { label: "Mesas & Sessões (GM • PLAYER • OBSERVER)", status: "wip" },
            { label: "Meilisearch/Algolia + filtros avançados", status: "wip" },
            { label: "Encontros & Iniciativa com efeitos", status: "wip" },
        ],
        progress: 62,
        accent: "from-amber-500/30 to-yellow-400/10",
        aria: "Funcionalidades em desenvolvimento",
    },
    {
        stage: "Lenda",
        icon: <Sparkles className="h-4 w-4" />,
        points: [
            { label: "Conjuntos Míticos dinâmicos (set bonuses vivos)", status: "plan" },
            { label: "Plugins da comunidade / módulos SRD", status: "plan" },
            { label: "Dashboard de campanha em tempo real", status: "plan" },
        ],
        accent: "from-violet-500/30 to-fuchsia-400/10",
        aria: "Visão de longo prazo",
    },
];

function StatusDot({ s }: { s: "done" | "wip" | "plan" }) {
    if (s === "done") return <Check className="h-3.5 w-3.5 text-emerald-400" />;
    if (s === "wip") return <CircleDot className="h-3.5 w-3.5 text-amber-300" />;
    return <CircleDot className="h-3.5 w-3.5 text-white/40" />;
}

export default function Roadmap() {
    return (
        <section
            className="relative mx-auto max-w-7xl px-6 pb-16 md:pb-24"
            aria-labelledby="roadmap-heading"
        >
            <div aria-hidden
                 className="pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-black to-transparent"/>

            {/* Cabeçalho */}
            <div className="mb-6 text-center p-16">
                <div
                    className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/75">
                    <Timer className="h-3.5 w-3.5"/>
                    Roteiro do Cântico
                </div>
                <h2
                    id="roadmap-heading"
                    className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
                >
                    Do que já canta ao que ainda ecoa
                </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {items.map((i, idx) => (
                    <motion.div
                        key={i.stage}
                        initial={{opacity: 0, y: 14}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true, margin: "-80px"}}
                        transition={{duration: 0.4, delay: 0.05 * idx}}
                    >
                        <Card
                            className="group relative cursor-default rounded-xl border-white/10 bg-white/[.03] transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]"
                            aria-label={i.aria}
                        >
                            <div
                                className={`pointer-events-none absolute -inset-1 rounded-2xl blur-2xl opacity-60 bg-gradient-to-br ${i.accent}`}
                                aria-hidden/>
                            <CardContent className="relative p-5">
                                <div
                                    className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/80">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10">
                    {i.icon}
                  </span>
                                    {i.stage}
                                </div>

                                {/* Lista de pontos com status */}
                                <ul className="space-y-2 text-sm text-white/85">
                                    {i.points.map((p) => (
                                        <li key={p.label} className="flex items-start gap-2">
                                            <span className="mt-0.5">{<StatusDot s={p.status}/>}</span>
                                            <span
                                                className={p.status === "done" ? "text-white/90" : p.status === "wip" ? "text-white/85" : "text-white/70"}>
                        {p.label}
                                                {p.status === "wip" ? <span
                                                    className="ml-2 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-300">em progresso</span> : null}
                      </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Barra de progresso (quando houver) */}
                                {typeof i.progress === "number" && (
                                    <div className="mt-4">
                                        <div className="h-1.5 w-full rounded-full bg-white/10">
                                            <div
                                                className="h-1.5 rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 transition-[width] duration-500 motion-reduce:transition-none"
                                                style={{width: `${Math.min(Math.max(i.progress, 0), 100)}%`}}
                                                aria-label={`Progresso ${i.progress}%`}
                                            />
                                        </div>
                                        <p className="mt-1 text-right text-[11px] text-white/60">{i.progress}%</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Rodapé opcional do roadmap */}
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-white/70">
                <span>Próximos marcos: Mesas & Sessões • Encontros dinâmicos • Busca avançada</span>
            </div>
        </section>
    );
}
