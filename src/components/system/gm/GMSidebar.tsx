
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Shield, Wand2, Boxes } from "lucide-react";

const LINKS = [
    { href: "/app/gm/tables",   label: "Minhas Mesas", icon: Users },
    { href: "/app/gm/bestiary", label: "Bestiário",    icon: Shield },
    { href: "/app/gm/prep",     label: "Preparação",   icon: Wand2 },
    { href: "/app/gm/items",    label: "Relíquias",    icon: Boxes },
] as const;

function cx(...s: Array<string | undefined | false>) {
    return s.filter(Boolean).join(" ");
}

export function GMSidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-16 h-[calc(100vh-6rem)] w-60 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
            <div className="mb-2 px-2 text-xs uppercase tracking-wide text-white/60">Mestre</div>
            <nav className="grid gap-1">
                {LINKS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cx(
                                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                                active
                                    ? "border border-white/15 bg-white/10 text-white"
                                    : "text-white/80 hover:text-white hover:bg-white/10 border border-transparent"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
