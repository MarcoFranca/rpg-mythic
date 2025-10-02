"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Swords, Shield, FlaskConical, BookOpenCheck, Skull, Users, SwordsIcon, Dice5, Search,
} from "lucide-react";
import ThemeToggle from "@/components/theme/theme-toggle";

type HubItem = {
    href: string;
    title: string;
    description: string;
    icon: React.ElementType;
    accent: string; // tailwind border/glow
};

const HUB: HubItem[] = [
    { href: "/items",       title: "Itens",        description: "Armas, armaduras por partes, consumíveis e conjuntos míticos.", icon: Swords,        accent: "from-rose-500/40 to-rose-400/10" },
    { href: "/weapons",     title: "Armas",        description: "Categorias, propriedades, dano, efeitos e raridades.",        icon: SwordsIcon,    accent: "from-orange-500/40 to-amber-400/10" },
    { href: "/armors",      title: "Armaduras",    description: "Capacete, peitoral, luvas, braçadeiras, botas, escudo, capa.", icon: Shield,        accent: "from-sky-500/40 to-cyan-400/10" },
    { href: "/consumables", title: "Consumíveis",  description: "Poções, elixires, pergaminhos e itens de uso único.",          icon: FlaskConical,  accent: "from-emerald-500/40 to-lime-400/10" },
    { href: "/spells",      title: "Magias",       description: "SRD-like: nível, escola, componentes, duração, alcance.",     icon: BookOpenCheck, accent: "from-violet-500/40 to-fuchsia-400/10" },
    { href: "/monsters",    title: "Bestiário",    description: "Monstros/NPCs, traits, ações, resistências e fraquezas.",     icon: Skull,         accent: "from-purple-500/40 to-indigo-400/10" },
    { href: "/characters",  title: "Fichas",       description: "Raças, classes/subclasses, perícias, inventário, magias.",    icon: Users,         accent: "from-blue-500/40 to-indigo-400/10" },
    { href: "/tables",      title: "Mesas & Sessões", description: "Campanhas, permissões (GM/PLAYER/OBSERVER) e agenda.",     icon: Users,         accent: "from-teal-500/40 to-green-400/10" },
    { href: "/encounters",  title: "Encontros & Combate", description: "Iniciativa, turnos, efeitos e calculadora de CR.",     icon: Swords,        accent: "from-amber-500/40 to-yellow-400/10" },
    { href: "/roller",      title: "Rolador de Dados", description: "d4–d20, vantagem/desvantagem e presets de rolagem.",       icon: Dice5,         accent: "from-pink-500/40 to-rose-400/10" },
    { href: "/search",      title: "Busca Unificada", description: "Encontre itens, magias, monstros, feats e classes.",       icon: Search,        accent: "from-slate-500/40 to-zinc-400/10" },
];

export default function PortalHome() {
    return (
        <main className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
            {/* Fundo mágico */}
            <div className="pointer-events-none absolute inset-0">
                <div className="mt-6 flex items-center justify-center gap-3">
                    <ThemeToggle/>
                </div>
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.25),transparent_60%)]"/>
                <div className="absolute inset-0 opacity-40 mix-blend-screen animate-pulse"
                     style={{backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22 viewBox=%220 0 160 160%22><circle cx=%2210%22 cy=%2210%22 r=%221%22 fill=%22white%22 opacity=%220.6%22/><circle cx=%2280%22 cy=%2240%22 r=%221%22 fill=%22white%22 opacity=%220.4%22/><circle cx=%22120%22 cy=%2290%22 r=%221%22 fill=%22white%22 opacity=%220.5%22/></svg>')"}}/>
            </div>

            {/* Hero */}
            <section className="relative z-10 px-6 pt-16 pb-8 md:pt-24 md:pb-10 max-w-6xl mx-auto text-center">
                <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                           className="text-3xl md:text-5xl font-bold tracking-tight">
                    Sistema de RPG — <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">Guia Mítico</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                          className="mt-4 text-sm md:text-base text-white/80">
                    Entre no portal. Explore itens, magias, monstros e conduza campanhas épicas — tudo em um único ecossistema.
                </motion.p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link href="/search"><Button variant="default">Buscar agora</Button></Link>
                    <Link href="/items"><Button variant="outline" className="border-white/30 text-white">Ver Itens</Button></Link>
                </div>
            </section>

            {/* Grid */}
            <section className="relative z-10 px-6 pb-16 md:pb-24 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {HUB.map((h, idx) => (
                        <motion.div key={h.href}
                                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}>
                            <Link href={h.href}>
                                <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/[.03] hover:shadow-xl hover:shadow-violet-500/10 transition">
                                    <div className={`pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl bg-gradient-to-br ${h.accent} transition`} />
                                    <CardContent className="relative p-4 h-full">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0 rounded-xl bg-white/10 p-2">
                                                <h.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{h.title}</h3>
                                                <p className="text-xs text-white/70">{h.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
