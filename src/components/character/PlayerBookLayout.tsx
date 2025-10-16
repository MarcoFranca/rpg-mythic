// src/components/character/PlayerBookLayout.tsx
"use client";
import { PropsWithChildren } from "react";
import EtherealBackground from "./EtherealBackground";
import EtherMotes from "@/components/character/EtherMotes";

type PlayerBookLayoutProps = PropsWithChildren<{
    sidebar: React.ReactNode;
    title?: string;
    subtitle?: string;
}>;

export default function PlayerBookLayout({ sidebar, children, title, subtitle }: PlayerBookLayoutProps) {
    return (
        <section
            className="relative grid text-white overflow-hidden"
            style={{ height: "calc(100dvh - var(--header-h, 64px))", gridTemplateColumns: "320px 1fr" }}
        >
            <aside className="h-full overflow-y-auto border-r border-white/10 bg-black/30">
                <div className="h-full">{sidebar}</div>
            </aside>

            <main className="relative w-full h-full overflow-y-auto bg-transparent">
                {/* fundo de vídeo exclusivo do main */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <EtherealBackground
                        srcBase="/videos/player"
                        poster="/videos/player.png"
                        veil={0.72}   // já dá uma escurecida leve
                        blurPx={2}
                    />
                </div>

                {/* véu extra só atrás do form (para legibilidade) */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-[1]"
                >
                    {/* vinheta lateral esquerda/direita muito sutil */}
                    <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_50%,rgba(0,0,0,.42),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_50%,rgba(0,0,0,.35),transparent_55%)]" />
                </div>

                {/* partículas mágicas suaves */}
                <EtherMotes className="z-[1]" />

                <div className="relative z-[2] mx-auto h-full max-w-5xl px-6 py-6">
                    {title && (
                        <header className="mb-4">
                            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
                        </header>
                    )}
                    <div className="min-h-0">{children}</div>
                </div>
            </main>
        </section>
    );
}
