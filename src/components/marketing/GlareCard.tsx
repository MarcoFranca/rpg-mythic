// components/marketing/GlareCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type GlareCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
    accent: string; // ex: "from-rose-500/40 to-rose-400/10"
    href: string;
    ariaLabel?: string;
    dataSfx?: string; // ex: "hover"
    prefetch?: boolean;
};

export default function GlareCard({
                                      icon,
                                      title,
                                      description,
                                      accent,
                                      href,
                                      ariaLabel,
                                      dataSfx = "hover",
                                      prefetch = true,
                                  }: GlareCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.35 }}
        >
            <Link
                href={href}
                prefetch={prefetch}
                aria-label={ariaLabel ?? title}
                title={title}
                data-sfx={dataSfx}
                className="group block outline-none"
            >
                <Card
                    className={[
                        // base
                        "relative rounded-xl border-white/10 bg-white/[.03] transition-transform duration-200",
                        // hover/focus equivalentes
                        "hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(56,189,248,0.40)]",
                        "focus-within:scale-[1.02] focus-within:shadow-[0_0_25px_rgba(56,189,248,0.40)]",
                        // respeita prefers-reduced-motion
                        "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:shadow-none",
                    ].join(" ")}
                >
                    {/* glare / glow */}
                    <div
                        className={[
                            "pointer-events-none absolute -inset-1 rounded-2xl blur-2xl opacity-0 transition",
                            "group-hover:opacity-100 group-focus-within:opacity-100",
                            `bg-gradient-to-br ${accent}`,
                            // reduz movimento (só controla opacidade mesmo)
                            "motion-reduce:transition-none",
                        ].join(" ")}
                    />

                    <CardContent className="relative rounded-xl p-5">
                        {/* header com ícone */}
                        <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-white/10">
                {icon}
              </span>
                            <span className="text-xs text-white/70">Explorar</span>
                        </div>

                        <h3
                            className={[
                                "text-lg font-semibold tracking-tight rounded-sm outline-none",
                                "group-focus-visible:ring-2 group-focus-visible:ring-cyan-400 group-focus-visible:ring-offset-0",
                            ].join(" ")}
                        >
                            {title}
                        </h3>

                        <p className="mt-1 text-sm text-white/70">{description}</p>
                    </CardContent>

                    {/* anel de foco para teclado (container) */}
                    <span
                        className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-focus-visible:ring-2 group-focus-visible:ring-cyan-400/70"
                        aria-hidden="true"
                    />
                </Card>
            </Link>
        </motion.div>
    );
}
