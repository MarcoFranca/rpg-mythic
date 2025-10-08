"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, BookOpen, Eye, Sparkles, Dice6, Users } from "lucide-react";

type RoleKey = "PLAYER" | "GM" | "SPECTATOR";

type Role = {
    title: string;
    icon: React.ReactNode;
    description: string;
    bullets: string[];
    roleKey: RoleKey;
    cta: { href: string; label: string };
    badge: string;
};

const roles: Role[] = [
    {
        title: "Jogador",
        icon: <Swords className="h-5 w-5" />,
        description: "Crie heróis, role d20 e viva campanhas no mundo vivo de Eldoryon.",
        bullets: ["Fichas completas (atributos, perícias, magias)", "Inventário e itens míticos", "Rolador com histórico e vantagem/desvantagem"],
        roleKey: "PLAYER",
        cta: { href: "/register?role=PLAYER", label: "Criar conta de Jogador" }, // 👈
        badge: "d20 • classes • magias",
    },
    {
        title: "Mestre",
        icon: <BookOpen className="h-5 w-5" />,
        description: "Erga mesas, crie encontros, controle o IDG e conduza o Cântico.",
        bullets: ["Criação de campanhas e sessões", "NPCs/monstros, encontros e iniciativa", "Mapas, handouts e permissões"],
        roleKey: "GM",
        cta: { href: "/register?role=GM", label: "Criar conta de Mestre" },      // 👈
        badge: "campanhas • encontros",
    },
    {
        title: "Espectador",
        icon: <Eye className="h-5 w-5" />,
        description: "Assista mesas ao vivo, aprenda as regras e sinta o Éter vibrar.",
        bullets: ["Salas abertas/públicas", "Timeline de rolagens", "Chat e reações"],
        roleKey: "SPECTATOR",
        cta: { href: "/register?role=SPECTATOR", label: "Criar conta de Espectador" }, // 👈
        badge: "assistir • aprender",
    },
];

export default function DesperteSuaLenda() {
    return (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
            {/* selo superior: RPG de mesa */}
            <div className="mb-6 flex items-center justify-center gap-2 text-xs text-white/70">
                <Dice6 className="h-4 w-4" />
                <span className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1">
          RPG de mesa • base D&D 5e • mundo original de Eldoryon
        </span>
            </div>

            <div className="mb-8 text-center">
                <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    Desperte sua <span className="bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Lenda</span>
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-pretty text-white/75">
                    Você escolhe o papel. O Cântico responde. Jogue como <strong>Jogador</strong>, conduza como <strong>Mestre</strong> ou aprenda como <strong>Espectador</strong>.
                </p>
            </div>

            {/* cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role, i) => (
                    <motion.div
                        key={role.title}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, delay: 0.06 * i }}
                    >
                        <Card className="group relative h-full overflow-hidden border-white/10 bg-white/[.03] p-5 backdrop-blur-sm transition hover:border-cyan-300/40">
                            {/* glow */}
                            <div className="pointer-events-none absolute inset-0 opacity-0 blur-2xl transition group-hover:opacity-100"
                                 style={{
                                     background:
                                         "radial-gradient(60% 60% at 50% 10%, rgba(34,211,238,0.10), transparent), radial-gradient(60% 60% at 90% 80%, rgba(251,191,36,0.08), transparent)"
                                 }}
                            />
                            <div className="relative">
                                <div className="mb-3 inline-flex items-center gap-2 text-xs text-white/70">
                  <span className="inline-grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-amber-400/70 to-cyan-400/70 shadow-lg shadow-cyan-500/10">
                    {role.icon}
                  </span>
                                    <span className="rounded-full border border-white/10 px-2 py-0.5">{role.badge}</span>
                                </div>

                                <h3 className="text-lg font-semibold">{role.title}</h3>
                                <p className="mt-1 text-sm text-white/75">{role.description}</p>

                                <ul className="mt-4 space-y-2 text-sm text-white/70">
                                    {role.bullets.map((b) => (
                                        <li key={b} className="flex items-start gap-2">
                                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5">
                                    <Link href={role.cta.href}>
                                        <Button
                                            size="sm"
                                            className="bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_24px_rgba(34,211,238,.55)]"
                                            data-sfx="hover"
                                        >
                                            {role.cta.label}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* faixa CTA secundária */}
            <div className="mt-8 grid gap-3 md:grid-cols-2">
                <Link href="/how-to-play" className="group">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.02] px-4 py-3 transition hover:border-amber-300/40">
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4" />
                            <span>Como jogar: passo a passo para sua primeira mesa</span>
                        </div>
                        <span className="text-xs text-white/60 group-hover:text-white/80">Abrir →</span>
                    </div>
                </Link>
                <Link href="/srd" className="group">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.02] px-4 py-3 transition hover:border-cyan-300/40">
                        <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-4 w-4" />
                            <span>Base mecânica: estrutura D&D 5e adaptada ao Cântico</span>
                        </div>
                        <span className="text-xs text-white/60 group-hover:text-white/80">Abrir →</span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
