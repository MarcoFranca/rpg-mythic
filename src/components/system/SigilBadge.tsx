"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
    balance: number;
    cap?: number | null;
    onClick?: () => void;
    loading?: boolean; // <--- adicionado
};

export default function SigilBadge({ balance, cap, onClick, loading }: Props) {
    if (loading) return <div className="h-8 w-28 animate-pulse rounded-xl bg-white/10" />
    const [twinkle, setTwinkle] = useState(false);
    useEffect(() => {
        const t = setInterval(() => setTwinkle((v) => !v), 2200);
        return () => clearInterval(t);
    }, []);

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1.5 text-sm ring-1 ring-white/10 hover:bg-white/10"
        >
      <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{
              boxShadow: "0 0 12px 3px rgba(246, 208, 84, 0.45)",
              background:
                  "radial-gradient(circle at 40% 40%, #ffe59a 0%, #f2b705 60%, #bf7c00 100%)",
          }}
      />
            <span className="tabular-nums">{balance}</span>
            {cap ? (
                <span className="text-white/60 text-xs">/ {cap}</span>
            ) : null}

            {/* brilhozinho */}
            <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full"
                animate={twinkle ? { opacity: [0.1, 0.6, 0.1] } : { opacity: 0.15 }}
                transition={{ duration: 0.6, repeat: 0 }}
                style={{ boxShadow: "0 0 28px 6px rgba(255, 210, 80, 0.25)" }}
            />
        </button>
    );
}
