"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { LogOut, Settings, Loader2 } from "lucide-react";
import { signOut } from "@/app/(auth)/logout/actions";

type Role = "PLAYER" | "GM" | "SPECTATOR";

export function SystemHeader(props: {
    name: string;
    email: string;
    image: string | null;
    role: Role;
}) {
    const [pending, start] = useTransition();

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
                        {props.role === "GM" ? `Mestre ${props.name}` :
                            props.role === "SPECTATOR" ? `Viajante ${props.name}` :
                                `Aventureiro ${props.name}`}
                    </div>
                    <div className="text-xs text-white/60">{props.email}</div>
                </div>
            </div>

            {/* Direita: ações */}
            <div className="flex items-center gap-2">
                <Link
                    href="/app/settings"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
                    title="Configurações"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>

                <button
                    onClick={() => start(async () => { await signOut(); })}
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
