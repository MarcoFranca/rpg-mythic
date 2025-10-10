"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEter } from "@/lib/eter/state";

export type Campaign = {
    id: string;
    name: string;
    status: "ativa" | "pausada" | "convidado";
    href: string;
};

export function CampaignCircle({ campaigns }: { campaigns: Campaign[] }) {
    const { theme } = useEter();
    const reduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    return (
        <div className="relative mx-auto grid max-w-xl place-items-center">
            <motion.div
                className="relative h-64 w-64 rounded-full"
                style={{ boxShadow: `inset 0 0 80px ${theme.accentSoft}` }}
                animate={{ rotate: [0, 360] }}
                transition={{
                    duration: reduce ? 0 : 60,
                    repeat: reduce ? 0 : Infinity,
                    ease: "linear",
                }}
            />
            {campaigns.map((c, i) => {
                const angle = (i / campaigns.length) * Math.PI * 2;
                const r = 135;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                const dim = c.status === "pausada" ? 0.5 : 1;

                return (
                    <motion.div
                        key={c.id}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                            filter: `saturate(${dim})`,
                            opacity: c.status === "convidado" ? 0.85 : 1,
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ x, y, opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 180,
                            damping: 24,
                            delay: 0.05 * i,
                        }}
                    >
                        <Link
                            href={c.href}
                            className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs backdrop-blur hover:brightness-110"
                            style={{ boxShadow: `0 0 0 1px ${theme.accentSoft}` }}
                        >
                            <div className="font-semibold">{c.name}</div>
                            <div className="opacity-70">
                                {c.status === "ativa"
                                    ? "Véu Desperto"
                                    : c.status === "pausada"
                                        ? "Silêncio atento"
                                        : "À espera do Cântico"}
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
