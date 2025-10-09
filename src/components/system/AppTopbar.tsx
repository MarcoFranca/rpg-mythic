// src/components/system/AppTopbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTransition, useState } from "react";
import { signOut } from "@/app/(auth)/logout/actions";
import {
    LogOut, Settings, Menu, X, Sword, Shield, Eye,
    Users, Boxes, BookOpen, CalendarCheck2, Sparkles, Wand2, Home, MoreHorizontal
} from "lucide-react";
import EtherealAudioToggle from "@/components/marketing/EtherealAudioToggle";

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
    DropdownMenuLabel, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { useOverflowNav } from "@/hooks/useOverflowNav";

type Role = "PLAYER" | "GM" | "SPECTATOR";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles: Role[];
    disabled?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
    { label: "Início",        href: "/app",            icon: <Home className="h-4 w-4" />,           roles: ["PLAYER","GM","SPECTATOR"] },
    { label: "Campanhas",     href: "/app/campaigns",  icon: <Users className="h-4 w-4" />,          roles: ["PLAYER","GM","SPECTATOR"] },
    { label: "Grimório",      href: "/app/grimoire",   icon: <BookOpen className="h-4 w-4" />,       roles: ["PLAYER","GM","SPECTATOR"] },
    { label: "Personagens",   href: "/app/characters", icon: <Sword className="h-4 w-4" />,          roles: ["PLAYER"] },
    { label: "Inventário",    href: "/app/inventory",  icon: <Boxes className="h-4 w-4" />,          roles: ["PLAYER"] },
    { label: "Agenda",        href: "/app/schedule",   icon: <CalendarCheck2 className="h-4 w-4" />, roles: ["PLAYER"] },
    { label: "Hall",          href: "/app/hall",       icon: <Sparkles className="h-4 w-4" />,       roles: ["PLAYER","GM"] },
];

const GM_NAV: NavItem[] = [
    { label: "Minhas Mesas", href: "/app/gm/tables",   icon: <Users className="h-4 w-4" />,  roles: ["GM"] },
    { label: "Bestiário",    href: "/app/gm/bestiary", icon: <Shield className="h-4 w-4" />, roles: ["GM"] },
    { label: "Preparação",   href: "/app/gm/prep",     icon: <Wand2 className="h-4 w-4" />,  roles: ["GM"] },
    { label: "Relíquias",    href: "/app/gm/items",    icon: <Boxes className="h-4 w-4" />,  roles: ["GM"] },
];

function cx(...s: Array<string | false | null | undefined>) {
    return s.filter(Boolean).join(" ");
}

export function AppTopbar(props: {
    role: Role;
    name: string;
    email: string;
    image: string | null;
}) {
    const pathname = usePathname();
    const [pending, start] = useTransition();
    const [open, setOpen] = useState(false);

    const canSee = (n: NavItem) => n.roles.includes(props.role);
    const main = PRIMARY_NAV.filter(canSee);
    const gm   = GM_NAV.filter(canSee);

    const { ref: overflowRef, visible, overflow } = useOverflowNav<NavItem>(main);

    const isActive = (href: string) =>
        pathname === href || (href !== "/app" && pathname?.startsWith(href));

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                {/* Left: brand + toggle mobile */}
                <div className="flex items-center gap-2">
                    <button
                        className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/80 hover:bg-white/20 lg:hidden"
                        onClick={() => setOpen(v => !v)}
                        aria-label="Abrir menu"
                    >
                        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>

                    <Link href="/app" className="group flex items-center gap-2">
            <span className={cx(
                "grid h-8 w-8 place-items-center rounded-xl border",
                props.role === "GM" ? "border-violet-400/40 bg-violet-500/10" :
                    props.role === "SPECTATOR" ? "border-cyan-400/40 bg-cyan-500/10" :
                        "border-emerald-400/40 bg-emerald-500/10"
            )}>
              {props.role === "GM" ? <Shield className="h-4 w-4 text-violet-300" /> :
                  props.role === "SPECTATOR" ? <Eye className="h-4 w-4 text-cyan-300" /> :
                      <Sword className="h-4 w-4 text-emerald-300" />}
            </span>
                        <span className="text-sm font-semibold text-white group-hover:text-white/90">Eldoryon</span>
                    </Link>
                </div>

                {/* Center: nav desktop – overflow + "+ Mais" */}
                <div className="relative hidden lg:flex max-w-[58rem] flex-1 justify-center">
                    <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-black to-transparent" />
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-black to-transparent" />

                    <nav ref={overflowRef} className="flex items-center gap-1 overflow-x-hidden px-6">
                        {visible.map((item) => (
                            <Link
                                key={item.href}
                                href={item.disabled ? "#" : item.href}
                                onClick={(e) => { if (item.disabled) e.preventDefault(); }}
                                className={cx(
                                    "flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition xl:px-3 xl:py-2",
                                    item.disabled && "pointer-events-none opacity-40",
                                    isActive(item.href)
                                        ? "bg-white/15 text-white border border-white/15"
                                        : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                                )}
                                title={item.label}
                            >
                                {item.icon}
                                <span className="hidden xl:inline">{item.label}</span>
                            </Link>
                        ))}

                        {overflow.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="ml-1 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/20">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="hidden xl:inline">Mais</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" sideOffset={8} className="w-56 border-white/10 bg-black/90 text-white">
                                    <DropdownMenuLabel className="text-xs text-white/70">Navegação</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {overflow.map((o) => (
                                        <DropdownMenuItem key={o.href} asChild>
                                            <Link href={o.href} className="flex items-center gap-2 text-sm">
                                                {o.icon}
                                                <span>{o.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {props.role === "GM" && gm.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="ml-1 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/20">
                                    <Shield className="h-4 w-4" />
                                    <span className="hidden xl:inline">Mestre</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" sideOffset={8} className="w-60 border-white/10 bg-black/90 text-white">
                                    <DropdownMenuLabel className="text-xs text-white/70">Ferramentas do Mestre</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {gm.map((g) => (
                                        <DropdownMenuItem key={g.href} asChild>
                                            <Link href={g.href} className="flex items-center gap-2 text-sm">
                                                {g.icon}
                                                <span>{g.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </nav>
                </div>

                {/* Right: áudio + settings + logout + avatar */}
                <div className="flex items-center gap-2">
                    <EtherealAudioToggle />
                    <Link
                        href="/app/settings"
                        className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/20 sm:inline-flex"
                        title="Configurações"
                    >
                        <Settings className="h-4 w-4" />
                        <span className="hidden md:inline">Settings</span>
                    </Link>
                    <button
                        onClick={() => start(async () => { await signOut(); })}
                        disabled={pending}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/20"
                        title="Sair"
                    >
                        {pending
                            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                            : <LogOut className="h-4 w-4" />}
                        <span className="hidden md:inline">Sair</span>
                    </button>
                    <div className="relative ml-1 h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/10">
                        {props.image ? (
                            <Image alt={props.name} src={props.image} fill className="object-cover" />
                        ) : (
                            <div className="grid h-full w-full place-items-center text-[11px] text-white/60">
                                {props.name?.at(0) ?? "@"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile nav (menu sanduíche) */}
            {open && (
                <div className="border-t border-white/10 bg-black/70 lg:hidden">
                    <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
                        {[...main, ...gm].map((item) => (
                            <Link
                                key={item.href}
                                href={item.disabled ? "#" : item.href}
                                onClick={() => {
                                    if (item.disabled) { event?.preventDefault?.(); return; }
                                    setOpen(false);
                                }}
                                className={cx(
                                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                                    item.disabled && "pointer-events-none opacity-40",
                                    isActive(item.href)
                                        ? "bg-white/15 text-white border border-white/15"
                                        : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}

                        <div className="flex items-center gap-2 pt-1">
                            <Link
                                href="/app/settings"
                                onClick={() => setOpen(false)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/20"
                                title="Configurações"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                            <button
                                onClick={() => start(async () => { await signOut(); })}
                                disabled={pending}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/20"
                                title="Sair"
                            >
                                {pending
                                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                                    : <LogOut className="h-4 w-4" />}
                                Sair
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
