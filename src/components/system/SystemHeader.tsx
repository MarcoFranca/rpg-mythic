// src/components/system/SystemHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SigilBadge from "@/components/system/SigilBadge";
import SigilPopover from "@/components/system/SigilPopover";
import { useSigils } from "@/lib/sigils/hooks";

type Role = "PLAYER" | "GM" | "SPECTATOR";

export function SystemHeader(props: {
    name: string;
    email: string;
    image: string | null;
    role: Role;
}) {
    const [open, setOpen] = useState(false);
    const { sigils, isLoading } = useSigils();

    // adapta SigilEntry[] -> Entry[] (shape esperado pelo Popover)
    const recentForPopover =
        sigils.recent?.map((e) => ({
            id: e.id,
            delta: e.delta,
            reason: e.kind,      // mapeia kind -> reason
            createdAt: e.at,     // mapeia at -> createdAt
        })) ?? [];

    return (
        <div className="flex items-center justify-between gap-4">
            {/* Esquerda: avatar + identidade */}
            <Link
                href="/app"
                aria-label="Voltar para a Câmara do Despertar"
                className="group flex items-center gap-4 rounded-2xl outline-none transition hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/10">
                    {props.image ? (
                        <Image alt={props.name} src={props.image} fill className="object-cover" />
                    ) : (
                        <div className="grid h-full w-full place-items-center text-white/60">
                            {props.name?.at(0) ?? "@"}
                        </div>
                    )}
                </div>
                <div className="pr-2">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-100/45">Câmara do Cântico</div>
                    <div className="text-white/90 text-sm">
                        {props.role === "GM"
                            ? `Mestre ${props.name}`
                            : props.role === "SPECTATOR"
                                ? `Viajante ${props.name}`
                                : `Aventureiro ${props.name}`}
                    </div>
                    <div className="text-xs text-white/60">{props.email}</div>
                </div>
            </Link>

            {/* Direita: ações */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    {isLoading ? (
                        <div className="h-8 w-28 animate-pulse rounded-xl bg-white/10" />
                    ) : (
                        <>
                            <SigilBadge
                                balance={sigils.balance}
                                cap={sigils.cap ?? undefined}
                                onClick={() => setOpen((v) => !v)}
                            />
                            <SigilPopover
                                open={open}
                                onClose={() => setOpen(false)}
                                balance={sigils.balance}
                                cap={sigils.cap ?? undefined}
                                recent={recentForPopover}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
