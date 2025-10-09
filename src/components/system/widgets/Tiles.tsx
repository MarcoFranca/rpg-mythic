"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FeatureGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    );
}

export function FeatureTile(props: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    href?: string;
    kpi?: string;
    disabled?: boolean;
    accent?: "emerald" | "violet" | "cyan";
    cta?: string;
}) {
    const { title, description, icon, href, kpi, disabled, accent = "cyan", cta } = props;

    const border =
        accent === "emerald" ? "border-emerald-400/35" :
            accent === "violet"  ? "border-violet-400/35"  :
                "border-cyan-400/35";

    const aura =
        accent === "emerald" ? "from-emerald-400/25 via-teal-400/15 to-cyan-400/10" :
            accent === "violet"  ? "from-fuchsia-400/25 via-violet-400/15 to-indigo-400/10" :
                "from-cyan-400/25 via-indigo-400/15 to-fuchsia-400/10";

    const core = (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className={`relative overflow-hidden rounded-2xl border ${border}
                  bg-white/5 p-4 backdrop-blur-md hover:bg-white/[0.08] focus-within:bg-white/[0.08]
                  ${disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"}`}
        >
            {/* aura */}
            <div className={`absolute -inset-1 rounded-3xl blur-md opacity-60 bg-gradient-to-r ${aura}`} style={{ WebkitMaskImage: "radial-gradient(white, transparent 70%)" }} />
            {/* conteúdo */}
            <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2 text-white/90">
                    {icon && <span className="grid place-items-center rounded-xl border border-white/10 bg-white/10 p-2">{icon}</span>}
                    <div className="font-semibold">{title}</div>
                    {kpi && <span className="ml-auto rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-xs text-white/75">{kpi}</span>}
                </div>
                <div className="text-sm text-white/75">{description}</div>
                {cta && !disabled && <div className="mt-3 inline-flex items-center rounded-xl border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/90">{cta}</div>}
            </div>

            {/* overlay “bloqueado” */}
            {disabled && (
                <div className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-black/40">
                    <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/80">Bloqueado</div>
                </div>
            )}
        </motion.div>
    );

    return href && !disabled ? <Link href={href} className="block outline-none">{core}</Link> : core;
}
