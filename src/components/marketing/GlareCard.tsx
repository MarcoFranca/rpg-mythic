// components/marketing/GlareCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export default function GlareCard({
                                      icon,
                                      title,
                                      description,
                                      accent,
                                      href,
                                  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    accent: string; // ex: "from-rose-500/40 to-rose-400/10"
    href: string;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link href={href}>
                <Card className="group relative overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/[.03] transition hover:shadow-xl hover:shadow-violet-500/10">
                    <div className={`pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl bg-gradient-to-br ${accent} transition`} />
                    <CardContent className="relative p-5">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5">
                            <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10">{icon}</span>
                            <span className="text-xs text-white/70">Explorar</span>
                        </div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="mt-1 text-sm text-white/70">{description}</p>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
