"use client";

import { thresholdForTrack } from "@/lib/roles/sigils";
import { motion } from "framer-motion";

type Role = "PLAYER" | "GM" | "SPECTATOR";
type Track = "PLAYER" | "GM" | null;

export function SigilProgress({ sigils, role, track }: { sigils: number; role: Role; track: Track }) {
    const threshold = track ? thresholdForTrack(track) : (role === "GM" ? thresholdForTrack("GM") : thresholdForTrack("PLAYER"));
    const value = Math.max(0, Math.min(1, sigils / threshold));
    const labelLeft =
        role === "SPECTATOR" && !track ? "Observador (sem trilha)" :
            role === "SPECTATOR" && track ? `Observador (trilha: ${track})` :
                role === "GM" ? "Mestre" : "Jogador";

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between text-xs text-white/80">
                <span>{labelLeft}</span>
                <span> Sígilos: <strong className="text-white/90">{sigils}</strong> / {threshold}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400/80 via-teal-400/70 to-cyan-400/60"
                    style={{ boxShadow: "0 0 14px rgba(16,185,129,0.35)" }}
                />
            </div>
            <div className="mt-2 text-[11px] text-white/60">
                {role === "SPECTATOR"
                    ? (!track
                        ? "Ao atingir um dos limiares, escolha sua trilha — Jogador (5) ou Mestre (8)."
                        : `Recupere Sígilos até o limiar da sua trilha (${threshold}) para retornar.`)
                    : "Se seus Sígilos caírem abaixo do limiar, você se torna Observador até reequilibrar o Cântico."}
            </div>
        </div>
    );
}
