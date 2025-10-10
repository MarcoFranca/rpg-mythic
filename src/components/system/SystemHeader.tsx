"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { LogOut, Settings, Loader2 } from "lucide-react";
import { signOut } from "@/app/(auth)/logout/actions";
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
    const [pending, start] = useTransition();
    const [open, setOpen] = useState(false);
    const { sigils, isLoading } = useSigils();

    return (
        <div className="flex items-center justify-between gap-4">
            {/* Esquerda: avatar + identidade */}
            <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/10">
                    {props.image ? (
                        <Image alt={props.name} src={props.image} fill className="object-cover" />
                    ) : (
                        <div className="grid h-full w-full place-items-center text-white/60">
                            {props.name?.at(0) ?? "@"}
                        </div>
                    )}
                </div>
                <div>
                    <div className="text-white/90 text-sm">
                        {props.role === "GM"
                            ? `Mestre ${props.name}`
                            : props.role === "SPECTATOR"
                                ? `Viajante ${props.name}`
                                : `Aventureiro ${props.name}`}
                    </div>
                    <div className="text-xs text-white/60">{props.email}</div>
                </div>
            </div>

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
                                recent={sigils.recent}
                            />
                        </>
                    )}
                </div>

                <Link
                    href="/app/settings"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                    title="Configurações"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>

                <button
                    onClick={() =>
                        start(async () => {
                            await signOut();
                        })
                    }
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                    title="Sair"
                >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                    Sair
                </button>
            </div>
        </div>
    );
}
