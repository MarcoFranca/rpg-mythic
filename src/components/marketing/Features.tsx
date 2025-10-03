"use client";

import GlareCard from "@/components/marketing/GlareCard";
import { Sword, Shield, Wand2, Sparkles, Users, BookOpen } from "lucide-react";

export default function Features() {
    return (
        <section className="relative z-20 px-6 pb-16 md:pb-24 max-w-7xl mx-auto">
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
    );
}
