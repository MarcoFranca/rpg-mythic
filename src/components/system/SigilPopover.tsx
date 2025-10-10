"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Entry = { id: string; delta: number; reason: string; createdAt: string };

export default function SigilPopover({
                                         open, onClose,
                                         balance, cap, recent,
                                     }: {
    open: boolean;
    onClose: () => void;
    balance: number;
    cap?: number | null;
    recent: Entry[];
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("pointerdown", onDown, { capture: true });
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown, { capture: true } as any);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl bg-black/80 p-3 backdrop-blur ring-1 ring-white/10"
                    ref={ref}
                >
                    <div className="flex items-baseline justify-between">
                        <div className="text-sm text-white/70">Sigilos</div>
                        <div className="text-lg font-medium tabular-nums">{balance}{cap ? <span className="text-white/50 text-sm"> / {cap}</span> : null}</div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <a className="rounded-lg bg-white/8 px-3 py-2 text-sm hover:bg-white/12 ring-1 ring-white/10" href="/app/sigils/earn">Ganhar</a>
                        <a className="rounded-lg bg-white/8 px-3 py-2 text-sm hover:bg-white/12 ring-1 ring-white/10" href="/app/sigils/spend">Gastar</a>
                        <a className="rounded-lg bg-white/8 px-3 py-2 text-sm hover:bg-white/12 ring-1 ring-white/10 col-span-2" href="/app/sigils/transfer">Transferir</a>
                    </div>

                    <div className="mt-3 text-xs text-white/60">Últimos lançamentos</div>
                    <div className="mt-1 max-h-44 overflow-auto pr-1">
                        {recent.length === 0 ? (
                            <div className="text-xs text-white/40 py-2">Sem movimentações ainda.</div>
                        ) : recent.map((e) => (
                            <div key={e.id} className="flex items-center justify-between py-1.5 text-sm">
                                <span className="text-white/70">{label(e.reason)}</span>
                                <span className={`tabular-nums ${e.delta >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                  {e.delta >= 0 ? "+" : ""}{e.delta}
                </span>
                            </div>
                        ))}
                    </div>

                    {cap ? (
                        <div className="mt-2 text-[11px] text-white/50">
                            Cap aumenta com emblemas e marcos. <a className="underline" href="/app/sigils/cap">Saber mais</a>
                        </div>
                    ) : null}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function label(r: string) {
    const map: Record<string, string> = {
        purchase: "Compra",
        referral: "Indicação",
        daily_login: "Login diário",
        gm_session: "Mestrou sessão",
        transfer_in: "Transferência (entrada)",
        transfer_out: "Transferência (saída)",
        create_character: "Criar ficha",
        extra_slot: "Slot extra",
        join_campaign: "Entrar em campanha",
        cosmetic: "Cosmético",
    };
    return map[r] ?? r;
}
