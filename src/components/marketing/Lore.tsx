"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

export default function Lore() {
    return (
        <section
            className="relative mx-auto max-w-6xl px-6 py-16 md:py-20"
            aria-labelledby="lore-heading"
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.03] backdrop-blur-sm"
            >
                {/* brilho etéreo */}
                <div
                    className="pointer-events-none absolute -inset-1 opacity-60 blur-2xl"
                    style={{
                        background:
                            "radial-gradient(60% 60% at 20% 0%, rgba(34,211,238,0.10), transparent), radial-gradient(60% 60% at 100% 100%, rgba(251,191,36,0.08), transparent)",
                    }}
                    aria-hidden
                />
                <div className="relative p-6 md:p-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/75">
                        <Sparkles className="h-3.5 w-3.5" />
                        Cânone de Eldoryon
                    </div>

                    <h2
                        id="lore-heading"
                        className="text-balance text-3xl font-semibold tracking-tight md:text-4xl"
                    >
                        O Cântico, o Éter e os Obeliscos
                    </h2>

                    <div className="mt-4 grid gap-6 md:grid-cols-2">
                        {/* Poético */}
                        <p className="text-pretty text-white/80">
                            Sob céus marcados pelas cicatrizes da Queda, o{" "}
                            <strong>Éter Vivo</strong> respira entre Luz e Sombra. Os{" "}
                            <strong>Obeliscos</strong> guardam notas perdidas do Cântico;
                            heróis os purificam, enquanto a voz dos Caídos sussurra nas
                            fendas. Cada mesa é um verso — e cada rolagem, um eco do destino.
                        </p>
                        {/* Jogável */}
                        <p className="text-pretty text-white/80">
                            No <strong>Guia Mítico</strong>, o mito encontra a mesa: fichas,
                            magias, encontros e inventário vivem no mesmo fluxo. Você joga com
                            regras baseadas em <strong>D&D 5e</strong>, mas todos os nomes,
                            escolas e poderes são moldados pelo cânone de Eldoryon —{" "}
                            <em>livro de Elyra, Obeliscos e Sombrasangue</em>.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/elyra"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[.02] px-4 py-2 text-sm text-white/85 transition hover:border-amber-300/40 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-300"
                            aria-label="Abrir o Livro de Elyra"
                        >
                            <BookOpen className="h-4 w-4" />
                            Livro de Elyra (teologia & eras)
                        </Link>
                        <Link
                            href="/lore"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[.02] px-4 py-2 text-sm text-white/85 transition hover:border-cyan-300/40 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400"
                            aria-label="Abrir o Guia Mítico"
                        >
                            <BookOpen className="h-4 w-4" />
                            Guia Mítico (povos, reinos, obeliscos)
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
