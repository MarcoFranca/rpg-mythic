// components/marketing/Community.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Sparkles, MessageSquare, GitBranch } from "lucide-react";

export default function Community() {
    return (
        <section
            className="relative mx-auto max-w-6xl px-6 pb-20 md:pb-28"
            aria-labelledby="community-heading"
        >
            <div className={'pt-16'}>

                <motion.div
                    initial={{opacity: 0, y: 14}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true, margin: "-80px"}}
                    transition={{duration: 0.4}}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] p-8 text-center backdrop-blur-sm"
                >
                    {/* glow etéreo */}
                    <div
                        className="pointer-events-none absolute -inset-1 opacity-60 blur-2xl"
                        style={{
                            background:
                                "radial-gradient(60% 60% at 0% 0%, rgba(34,211,238,0.10), transparent), radial-gradient(60% 60% at 100% 100%, rgba(251,191,36,0.08), transparent)",
                        }}
                        aria-hidden
                    />

                    {/* Header */}
                    <div className="relative">
                        <div
                            className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/75">
                            <Sparkles className="h-3.5 w-3.5"/>
                            Guilda & Conselho
                        </div>
                        <h3
                            id="community-heading"
                            className="text-balance text-xl font-semibold md:text-2xl"
                        >
                            Junte-se ao Conselho do Cântico
                        </h3>
                        <p className="mx-auto mt-2 max-w-2xl text-pretty text-sm text-white/80 md:text-base">
                            Participe dos <strong>playtests</strong>, decida próximos feitiços, reporte
                            bugs e ajude a lapidar o Guia Mítico. Ganhe <em>títulos lendários</em> e
                            insígnias na comunidade.
                        </p>
                    </div>

                    {/* Stats / social proof */}
                    <div className="relative mx-auto mt-5 grid max-w-3xl grid-cols-3 gap-2 text-xs text-white/70">
                        <div className="rounded-lg border border-white/10 bg-white/[.02] px-3 py-2">
                            <div className="flex items-center justify-center gap-2">
                                <Users className="h-3.5 w-3.5"/>
                                <span>membros</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-white/90">+128</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[.02] px-3 py-2">
                            <div className="flex items-center justify-center gap-2">
                                <MessageSquare className="h-3.5 w-3.5"/>
                                <span>playtests</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-white/90">24</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[.02] px-3 py-2">
                            <div className="flex items-center justify-center gap-2">
                                <GitBranch className="h-3.5 w-3.5"/>
                                <span>issues resolvidas</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-white/90">73</p>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="relative mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link href="/login" aria-label="Entrar para participar da comunidade" data-sfx="hover">
                            <Button
                                className="bg-violet-600 text-white transition duration-300 hover:scale-[1.02] hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] motion-reduce:transition-none">
                                Entrar
                            </Button>
                        </Link>
                        <Link href="/app" aria-label="Abrir o Portal do Éter" data-sfx="hover">
                            <Button
                                variant="outline"
                                className="border-white/30 text-white transition duration-300 hover:scale-[1.02] hover:text-cyan-300 motion-reduce:transition-none"
                            >
                                Ver o Portal
                            </Button>
                        </Link>
                        {/* ajuste a url quando tiver o convite real */}
                        <Link href="/discord" aria-label="Entrar no Discord do Eldoryon" data-sfx="hover">
                            <Button
                                variant="secondary"
                                className="bg-white/10 text-white transition duration-300 hover:scale-[1.02] hover:bg-white/15 motion-reduce:transition-none"
                            >
                                Entrar no Discord
                            </Button>
                        </Link>
                    </div>

                    {/* Como contribuir */}
                    <div className="relative mx-auto mt-6 max-w-3xl">
                        <ul className="grid grid-cols-1 gap-2 text-left text-sm text-white/75 md:grid-cols-3">
                            <li className="rounded-lg border border-white/10 bg-white/[.02] px-4 py-3">
                                <p className="font-medium text-white/85">Playtest & Feedback</p>
                                <p className="mt-1 text-xs text-white/65">
                                    Participe de sessões, reporte bugs e sugira melhorias.
                                </p>
                            </li>
                            <li className="rounded-lg border border-white/10 bg-white/[.02] px-4 py-3">
                                <p className="font-medium text-white/85">Lore & Itens</p>
                                <p className="mt-1 text-xs text-white/65">
                                    Proponha magias, relíquias e NPCs dentro do cânone.
                                </p>
                            </li>
                            <li className="rounded-lg border border-white/10 bg-white/[.02] px-4 py-3">
                                <p className="font-medium text-white/85">Código & Issues</p>
                                <p className="mt-1 text-xs text-white/65">
                                    Ajude no frontend (Next + shadcn) e API (tRPC + Prisma).
                                </p>
                            </li>
                        </ul>
                        <p className="mt-3 text-center text-xs text-white/60">
                            Contribuições reconhecidas com <em>títulos</em> e <em>insígnias</em> no perfil.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
