// components/marketing/SystemStrip.tsx
"use client";

import Link from "next/link";
import {Dice6, Shield, Sword, Tickets, Wand2} from "lucide-react";
import type { ReactNode } from "react";

type StripItem = {
    icon: ReactNode;
    title: string;
    subtitle: string;
    href: string;
    aria: string;
};

const items: StripItem[] = [
    {
        icon: <Dice6 className="h-4 w-4" />,
        title: "Rolagens d20",
        subtitle: "vantagem/desvantagem, histórico",
        href: "/roller",
        aria: "Abrir rolador de dados d20",
    },
    {
        icon: <Sword className="h-4 w-4" />,
        title: "Classes & Perícias",
        subtitle: "balanceadas no cânone de Eldoryon",
        href: "/classes",
        aria: "Ver classes e perícias",
    },
    {
        icon: <Wand2 className="h-4 w-4" />,
        title: "Magia & Fé",
        subtitle: "Éter Vivo, Sombrasangue e escolas",
        href: "/magic",
        aria: "Ver magias e fé",
    },
    {
        icon: <Shield className="h-4 w-4" />,
        title: "Campanhas com Mestre",
        subtitle: "sessões, encontros, iniciativa",
        href: "/app",
        aria: "Abrir campanhas e sessões",
    },
];

export default function SystemStrip() {
    return (
        <section
            className="relative z-10 items-center justify-center mt-4 mx-auto max-w-6xl px-6 pb-8"
            aria-labelledby="system-strip-heading"
        >
            <div aria-hidden
                 className="pointer-events-none absolute -top-8 inset-x-0 h-16 bg-gradient-to-b from-black to-transparent"/>

            {/* título leve para dividir da sessão anterior */}
            <div className={'text-center p-8'}>
                <div
                    className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs text-white/75">
                    <Tickets className="h-3.5 w-3.5"/>
                    Fundamentos do Sistema
                </div>
            </div>

            <ul className="grid gap-3 md:grid-cols-4" role="list">
                {items.map((f) => (
                    <li key={f.title} className="relative">
                        <Link
                            href={f.href}
                            aria-label={f.aria}
                            title={f.title}
                            className={[
                                "group block rounded-lg border border-white/10 bg-white/[.03] px-4 py-3 text-sm backdrop-blur-sm",
                                "transition duration-300 hover:scale-[1.01] hover:border-cyan-300/40",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
                                "motion-reduce:transition-none motion-reduce:transform-none",
                            ].join(" ")}
                        >
                            <div className="mb-1 flex items-center gap-2 text-white/85">
                <span
                    className="inline-grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-cyan-400/70 to-amber-400/70">
                  {f.icon}
                </span>
                                <strong className="tracking-tight">{f.title}</strong>
                            </div>
                            <p className="text-xs text-white/70">{f.subtitle}</p>

                            {/* glow leve no hover/focus */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 rounded-lg opacity-0 blur-2xl transition group-hover:opacity-100 group-focus-visible:opacity-100"
                                style={{
                                    background:
                                        "radial-gradient(60% 60% at 15% 15%, rgba(34,211,238,.10), transparent), radial-gradient(60% 60% at 85% 85%, rgba(251,191,36,.08), transparent)",
                                }}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
