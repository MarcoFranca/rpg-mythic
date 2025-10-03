// app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sword, Shield, Wand2, Sparkles, Users, BookOpen } from "lucide-react";
import Particles from "@/components/marketing/Particles";
import GlareCard from "@/components/marketing/GlareCard";

export default function LandingPage() {
    return (
        <main className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
            {/* Fundo imersivo */}
            <div className="pointer-events-none absolute inset-0">
                <Particles />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15),transparent_60%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* NAV */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2">
          <span className="inline-grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-violet-500/70 to-cyan-400/70 shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-4 w-4" />
          </span>
                    <span className="font-semibold tracking-tight">Guia Mítico</span>
                </Link>
                <nav className="hidden md:flex items-center gap-2">
                    <Link href="/login"><Button variant="ghost" className="text-white/80 hover:text-white">Entrar</Button></Link>
                    <Link href="/app"><Button className="bg-violet-600 hover:bg-violet-500">Entrar no Portal</Button></Link>
                </nav>
            </header>

            {/* HERO */}
            <section className="relative z-10 px-6 pt-10 pb-12 md:pt-20 md:pb-16 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
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
                        <Link href="/app"><Button size="lg" className="bg-violet-600 hover:bg-violet-500">Entrar no Sistema</Button></Link>
                        <Link href="/login"><Button size="lg" variant="outline" className="border-white/30 text-white">Criar/Entrar</Button></Link>
                    </div>
                </motion.div>

                {/* Orbes mágicos */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="pointer-events-none relative mx-auto mt-10 h-40 w-full max-w-3xl"
                >
                    <div className="absolute -left-10 top-4 h-28 w-28 rounded-full bg-violet-500/25 blur-2xl" />
                    <div className="absolute right-0 top-8 h-24 w-24 rounded-full bg-cyan-400/25 blur-2xl" />
                    <div className="absolute inset-0 border border-white/10 rounded-3xl bg-white/[.02] backdrop-blur-sm" />
                </motion.div>
            </section>

            {/* FEATURES */}
            <section className="relative z-10 px-6 pb-16 md:pb-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <GlareCard
                        icon={<Sword className="h-5 w-5" />}
                        title="Guia de Itens"
                        description="Armas, armaduras por partes, consumíveis e conjuntos míticos com bônus por peças."
                        accent="from-rose-500/40 to-rose-400/10"
                        href="/items"
                    />
                    <GlareCard
                        icon={<Wand2 className="h-5 w-5" />}
                        title="Magias & Feats"
                        description="SRD-like: escola, componentes, duração, alcance, save/attack e dano escalável."
                        accent="from-violet-500/40 to-fuchsia-400/10"
                        href="/spells"
                    />
                    <GlareCard
                        icon={<Shield className="h-5 w-5" />}
                        title="Bestiário & Encontros"
                        description="Monstros/NPCs, resistências, imunidades e calculadora de CR para encontros balanceados."
                        accent="from-sky-500/40 to-cyan-400/10"
                        href="/monsters"
                    />
                    <GlareCard
                        icon={<Users className="h-5 w-5" />}
                        title="Mesas & Sessões"
                        description="Campanhas, permissões (GM/PLAYER/OBSERVER), agenda e integração futura."
                        accent="from-teal-500/40 to-green-400/10"
                        href="/app"
                    />
                    <GlareCard
                        icon={<BookOpen className="h-5 w-5" />}
                        title="Fichas Ricas"
                        description="Raças, classes/subclasses, proficiências, inventário, magias e condições em JSON."
                        accent="from-amber-500/40 to-yellow-400/10"
                        href="/characters"
                    />
                    <GlareCard
                        icon={<Sparkles className="h-5 w-5" />}
                        title="Busca Unificada"
                        description="Meilisearch/Algolia para achar itens, magias, monstros, feats e mais — em segundos."
                        accent="from-slate-500/40 to-zinc-400/10"
                        href="/search"
                    />
                </div>
            </section>

            {/* CTA Final */}
            <section className="relative z-10 px-6 pb-20 md:pb-28 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[.03] p-8 text-center shadow-[0_0_60px_-20px_rgba(139,92,246,0.35)]"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold">Pronto para entrar no portal?</h2>
                    <p className="mt-2 text-white/80">
                        Seu mundo de RPG com profundidade de sistema, velocidade de app moderno e magia em cada clique.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <Link href="/app"><Button size="lg" className="bg-cyan-600 hover:bg-cyan-500">Acessar Agora</Button></Link>
                        <Link href="/login"><Button size="lg" variant="outline" className="border-white/30 text-white">Criar Conta</Button></Link>
                    </div>
                </motion.div>
            </section>

            {/* Rodapé simples */}
            <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-xs text-white/60">
                © {new Date().getFullYear()} Guia Mítico — Sistema de RPG
            </footer>
        </main>
    );
}
