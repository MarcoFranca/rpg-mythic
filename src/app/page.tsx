"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Particles from "@/components/marketing/Particles";
import HeroDragon from "@/components/marketing/HeroDragon";
import Features from "@/components/marketing/Features";
import Lore from "@/components/marketing/Lore";
import Roadmap from "@/components/marketing/Roadmap";
import Community from "@/components/marketing/Community";

export default function LandingPage() {
    return (
        <main className="relative min-h-[100dvh] bg-black text-white">
            {/* EFEITOS GLOBAIS (página toda) */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Particles />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15),transparent_60%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-40" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* NAV */}
            <header className="relative z-20 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
          <span className="inline-grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-violet-500/70 to-cyan-400/70 shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-4 w-4" />
          </span>
                    <span className="font-semibold tracking-tight">Guia Mítico</span>
                </Link>
                <nav className="hidden md:flex items-center gap-2">
                    <Link href="/login"><Button variant="ghost" className="text-white/80 hover:text-white">Entrar</Button></Link>
                    <Link href="/app"><Button className="bg-violet-600 hover:bg-violet-500 text-white">Entrar no Portal</Button></Link>
                </nav>
            </header>

            {/* HERO só com o dragão (inteiro) */}
            <HeroDragon>
                <section className="text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-3 py-1 text-xs text-white/70">
                        <Sparkles className="h-3.5 w-3.5" />
                        Construindo o maior mundo de RPG em PT-BR
                    </div>
                    <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl">
                        Entre no <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300">Portal Mítico</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-pretty text-white/80">
                        Itens lendários, magias SRD-like, bestiário profundo, encontros táticos e mesas épicas.
                        Um ecossistema completo para Mestres e Jogadores.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link href="/app"><Button size="lg" className="bg-violet-600 text-white hover:bg-violet-500 hover:scale-102 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-transform duration-800">Entrar no Sistema</Button></Link>
                        <Link href="/login"><Button size="lg" variant="outline" className="border-white/30 text-white hover:border-cyan-400 hover:scale-102 transition-transform duration-800">Criar/Entrar</Button></Link>
                    </div>

                    {/* ORBES */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="pointer-events-none relative mx-auto mt-10 h-40 w-full max-w-3xl"
                    >
                        <div className="absolute inset-0 z-0 rounded-3xl border border-white/10 bg-white/[.02] backdrop-blur-sm" />
                        <div className="absolute -left-10 top-4 z-0 h-28 w-28 rounded-full bg-violet-500/25 blur-2xl" />
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
                            <img src="/d20.svg" alt="D20" className="h-16 w-16 opacity-95 invert drop-shadow" />
                        </div>
                    </motion.div>
                </section>
            </HeroDragon>

            {/* SEÇÕES */}
            <Features />
            <Lore />
            <Roadmap />
            <Community />

            {/* FOOTER */}
            <footer className="relative z-20 border-t border-white/10 px-6 py-8 text-center text-xs text-white/60">
                © {new Date().getFullYear()} Guia Mítico — Sistema de RPG
            </footer>
        </main>
    );
}
