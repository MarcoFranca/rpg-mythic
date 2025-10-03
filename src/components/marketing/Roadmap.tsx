// components/marketing/Roadmap.tsx
"use client";

import { Check, Sparkles, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const items = [
    {
        title: "Hoje",
        icon: <Check className="h-4 w-4" />,
        points: [
            "Itens, Armas, Armaduras por partes",
            "Consumíveis, Magias SRD-like",
            "Bestiário básico e Buscador",
        ],
        accent: "from-emerald-500/30 to-emerald-400/10",
    },
    {
        title: "Próximo",
        icon: <Timer className="h-4 w-4" />,
        points: [
            "Mesas & Sessões (roles GM/PLAYER/OBSERVER)",
            "Meilisearch/Algolia + filtros avançados",
            "Encontros & Iniciativa com efeitos",
        ],
        accent: "from-amber-500/30 to-yellow-400/10",
    },
    {
        title: "Lenda",
        icon: <Sparkles className="h-4 w-4" />,
        points: [
            "Conjuntos Míticos dinâmicos",
            "Plugins de comunidade / módulos SRD",
            "Dashboard de campanha em tempo real",
        ],
        accent: "from-violet-500/30 to-fuchsia-400/10",
    },
];

export default function Roadmap() {
    return (
        <section className="relative px-6 pb-16 md:pb-24 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {items.map((i, idx) => (
                    <motion.div
                        key={i.title}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * idx }}
                    >
                        <Card className="group relative border-white/10 bg-white/[.03] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                            <div className={`pointer-events-none absolute -inset-1 blur-2xl opacity-60 bg-gradient-to-br ${i.accent}`} />
                            <CardContent className="relative p-5">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/80">
                                    <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10">{i.icon}</span>
                                    {i.title}
                                </div>
                                <ul className="space-y-2 text-sm text-white/80">
                                    {i.points.map((p) => <li key={p}>• {p}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
