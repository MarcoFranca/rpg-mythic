"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, MoveRight, ShoppingBag, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import SigilBadge from "@/components/system/SigilBadge";
import { useSigils } from "@/lib/sigils/hooks";

export default function SigilsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { sigils, isLoading } = useSigils();

    // app/sigils/layout.tsx — ajuste as tabs se tua área vive em /app
    const BASE = "/app"; // ou "" se for na raiz
    const tabs = [
        { href: `${BASE}/sigils`, label: "Carteira", icon: Wallet },
        { href: `${BASE}/sigils/transfer`, label: "Transferir", icon: MoveRight },
        { href: `${BASE}/sigils/buy`, label: "Comprar", icon: ShoppingBag },
        { href: `${BASE}/sigils/history`, label: "Histórico", icon: Clock3 },
    ];


    return (
        <div className="relative z-10">
            {/* Top bar compacta */}
            <div className="mx-auto max-w-6xl px-6 pt-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-white/70">Sígilos</div>
                    <div className="relative h-8">
                        {isLoading ? (
                            <div className="h-8 w-28 animate-pulse rounded-xl bg-white/10" />
                        ) : (
                            <SigilBadge
                                balance={sigils.balance}
                                cap={sigils.cap ?? undefined}
                                onClick={() => {}}
                            />
                        )}
                    </div>
                </div>

                {/* Tabs secundárias */}
                <div className="mt-4 flex gap-2 overflow-x-auto">
                    {tabs.map((t) => {
                        const Icon = t.icon;
                        const active = pathname === t.href;
                        return (
                            <Link
                                key={t.href}
                                href={t.href}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition",
                                    active
                                        ? "border-white/20 bg-white/10 text-white"
                                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {t.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Conteúdo da rota */}
            <div className="mx-auto max-w-6xl px-6 py-6">{children}</div>
        </div>
    );
}
