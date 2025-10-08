"use client";

import { motion } from "framer-motion";
import GlareCard from "@/components/marketing/GlareCard";
import { Sword, Shield, Wand2, Sparkles, Users, BookOpen, Search } from "lucide-react";

type FeatureItem = {
    title: string;
    description: string;
    href: string;
    accent: string;
    icon: React.ReactNode;
    aria: string;
};

const items: FeatureItem[] = [
    {
        icon: <Sword className="h-5 w-5" />,
        title: "Guia de Itens",
        description:
            "Armas, armaduras por partes, consumíveis e conjuntos míticos com bônus por peças.",
        accent: "from-rose-500/40 to-rose-400/10",
        href: "/items",
        aria: "Abrir Guia de Itens",
    },
    {
        icon: <Wand2 className="h-5 w-5" />,
        title: "Magias & Feats",
        description:
            "Escolas, componentes, duração, alcance, testes/ataques e dano escalável prontos para mesa.",
        accent: "from-violet-500/40 to-fuchsia-400/10",
        href: "/spells",
        aria: "Abrir Magias e Feats",
    },
    {
        icon: <Shield className="h-5 w-5" />,
        title: "Bestiário & Encontros",
        description:
            "Monstros/NPCs, resistências e calculadora de CR para encontros balanceados com iniciativa.",
        accent: "from-sky-500/40 to-cyan-400/10",
        href: "/monsters",
        aria: "Abrir Bestiário e Encontros",
    },
    {
        icon: <Users className="h-5 w-5" />,
        title: "Mesas & Sessões",
        description:
            "Campanhas, permissões (GM • PLAYER • OBSERVER), agenda e organização de sessões.",
        accent: "from-teal-500/40 to-green-400/10",
        href: "/app",
        aria: "Abrir Mesas e Sessões",
    },
    {
        icon: <BookOpen className="h-5 w-5" />,
        title: "Fichas Ricas",
        description:
            "Raças, classes/subclasses, proficiências, inventário, magias e condições — tudo integrado.",
        accent: "from-amber-500/40 to-yellow-400/10",
        href: "/characters",
        aria: "Abrir Fichas de Personagem",
    },
    {
        icon: <Search className="h-5 w-5" />,
        title: "Busca Unificada",
        description:
            "Encontre itens, magias, monstros, feats e mais em segundos (Meilisearch/Algolia).",
        accent: "from-slate-500/40 to-zinc-400/10",
        href: "/search",
        aria: "Abrir Busca Unificada",
    },
];

export default function Features() {
    return (
        <section
            className="relative z-20 mx-auto max-w-7xl px-6 pb-16 md:pb-24"
            aria-labelledby="features-heading"
        >

            {/* cabeçalho da seção */}
            <div className="m-16 text-center ">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/75">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ferramentas do Mestre & Jogador
                </div>
                <h2 id="features-heading" className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                    Sistema Mítico, pronto para <span className="bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">jogar agora</span>
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-pretty text-white/75">
                    Tudo que sua mesa precisa: criação de personagens, campanhas, encontros, rolagens e um mundo vivo conectado ao Cântico.
                </p>
            </div>

            {/* grid de features */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.4, delay: 0.05 * i }}
                    >
                        <GlareCard
                            icon={f.icon}
                            title={f.title}
                            description={f.description}
                            accent={f.accent}
                            href={f.href}
                        />
                    </motion.div>
                ))}
            </div>

            {/* CTA secundário da seção */}
            <div className="mt-6 flex justify-center">
                <a
                    href="/features"
                    className="rounded-lg border border-white/10 bg-white/[.02] px-4 py-2 text-sm text-white/80 outline-none transition hover:border-cyan-300/40 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400"
                    aria-label="Ver todas as funcionalidades"
                >
                    Ver todas as funcionalidades →
                </a>
            </div>
        </section>
    );
}
