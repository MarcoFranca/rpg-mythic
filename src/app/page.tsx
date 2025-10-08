"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Waves } from "lucide-react";
import Particles from "@/components/marketing/Particles";
import HeroObelisk from "@/components/marketing/HeroObelisk";
import Features from "@/components/marketing/Features"; // pode manter; depois alinhamos cards
import Lore from "@/components/marketing/Lore";
import Roadmap from "@/components/marketing/Roadmap";
import Community from "@/components/marketing/Community";
// opcional
import EtherealAudioToggle from "@/components/marketing/EtherealAudioToggle";
import DesperteSuaLenda from "@/components/marketing/DesperteSuaLenda";
import SystemStrip from "@/components/marketing/SystemStrip";
import SectionDivider from "@/components/marketing/SectionDivider";
import {usePageSound} from "@/hooks/useSound";

export default function LandingPage() {
    const { enabled } = usePageSound();

    return (
        <main className="relative min-h-[100vh] bg-black text-white">
            {/* efeitos globais */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Particles />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.14),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.12),transparent_60%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-40" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* NAV */}
            <header className="relative z-30 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-amber-400/70 to-cyan-400/70 shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition">
            <Waves className="h-4 w-4" />
          </span>
                    <span className="font-semibold tracking-tight">Eldoryon — Guia Mítico</span>
                </Link>
                <nav className="hidden md:flex items-center gap-2">
                    <Link href="/login">
                        <Button
                            data-sfx="hover"
                            variant="ghost"
                            className="text-white/85 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400">
                            Entrar
                        </Button>
                    </Link>
                    <Link href="/app">
                        <Button
                            data-sfx="hover"
                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold focus-visible:ring-2 focus-visible:ring-amber-300">
                            Acessar o Éter
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button
                            data-sfx="hover"

                            className="bg-amber-300 text-black font-semibold hover:bg-amber-200 focus-visible:ring-2 focus-visible:ring-amber-300"
                        >
                            Criar conta
                        </Button>
                    </Link>
                    <div
                        aria-pressed={enabled}
                        aria-label={enabled ? "Desativar sons" : "Ativar sons"}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    >
                        <EtherealAudioToggle/>
                    </div>
                </nav>
            </header>

            {/* HERO – Obelisco + Éter Vivo */}
            <HeroObelisk>
                <section className="text-center">
                    {/* selo claro: rpg de mesa */}
                    <div
                        className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/75">
                        <Sparkles className="h-3.5 w-3.5" />
                        RPG de mesa • base D&D 5e • mundo original de Eldoryon
                    </div>

                    {/* Título mítico (mantido) */}
                    <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">
                        Desperte o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300">Cântico da Criação</span>
                    </h1>

                    {/* Tagline agora já conecta com “jogar” */}
                    <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/80">
                        Jogue campanhas com <strong>Mestres reais</strong>, crie <strong>personagens</strong>, role <strong>d20</strong> e viva o Éter Vivo entre Luz e Sombra.
                        Purifique Obeliscos, contenha o Sombrasangue e conduza o Equilíbrio Espiritual.
                    </p>

                    {/* CTAs com função distinta */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link href="/app">
                            <Button
                                size="lg"
                                className="bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(34,211,238,0.6)] transition duration-500"
                                data-sfx="hover"
                            >
                                Entrar no Sistema
                            </Button>
                        </Link>
                        <Link href="/how-to-play">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-white hover:border-amber-300 hover:scale-[1.02] transition duration-500"
                                data-sfx="hover"
                            >
                                Como Jogar
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="bg-amber-300 text-black hover:bg-amber-200 hover:scale-[1.02] transition duration-500"
                                data-sfx="hover"
                            >
                                Criar conta agora
                            </Button>
                        </Link>

                    </div>

                    {/* Orbe rúnica com d20 (ok manter) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="pointer-events-none relative mx-auto mt-10 h-40 w-full max-w-3xl"
                        aria-hidden
                    >
                        <div className="absolute inset-0 z-0 rounded-3xl border border-white/10 bg-white/[.02] backdrop-blur-sm" />
                        <div className="absolute -left-10 top-4 z-0 h-28 w-28 rounded-full bg-amber-300/25 blur-2xl" />
                        <div className="absolute right-0 top-8 z-0 h-24 w-24 rounded-full bg-cyan-400/25 blur-2xl" />
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                            <div className="relative h-28 w-28">
                                <div className="absolute inset-0 rounded-full border border-white/10" />
                                <div className="absolute inset-0 animate-spin-slow">
                                    <img src="/rune-ring.svg" alt="" className="h-28 w-28 opacity-55 invert" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <img src="/d20.svg" alt="" className="h-16 w-16 opacity-95 invert drop-shadow" />
                        </div>
                    </motion.div>

                    {/* dica de scroll (UX) */}
                    <div className="mt-8 mb-12 text-xs text-white/60">Role para descobrir seu papel ↓</div>
                </section>
            </HeroObelisk>
            <SectionDivider variant="wave" invert />   {/* Hero → Desperte */}
            <DesperteSuaLenda />
            <SectionDivider variant="fade" />   {/* Desperte → System Strip */}
            <SystemStrip />
            <SectionDivider variant="runes" />  {/* System Strip → Features */}
            <Features />
            <SectionDivider variant="fade" />   {/* Desperte → System Strip */}
            <SectionDivider variant="wave" invert /> {/* Features → Lore */}
            <Lore />
            <SectionDivider variant="fade" />   {/* Lore → Roadmap */}
            <Roadmap />
            <SectionDivider variant="runes" />  {/* Roadmap → Community */}
            <Community />
            <SectionDivider variant="fade" />   {/* Lore → Roadmap */}

            {/* FOOTER */}
            <footer className="relative z-20 border-t border-white/10 px-6 py-8 text-center text-xs text-white/60">
                © {new Date().getFullYear()} Eldoryon — Guia Mítico
            </footer>
        </main>
    );
}
