// src/components/character/PlayerBookLayout.tsx
"use client";
import { PropsWithChildren } from "react";
import EtherealBackground from "./EtherealBackground";
import Particles from "@/components/marketing/Particles";

type PlayerBookLayoutProps = PropsWithChildren<{
    sidebar: React.ReactNode;
    title?: string;
    subtitle?: string;
}>;

export default function PlayerBookLayout({ sidebar, children, title, subtitle }: PlayerBookLayoutProps) {
    return (
        <section
            className="relative grid text-white overflow-hidden"
            style={{height: "calc(100dvh - var(--header-h, 58px))", gridTemplateColumns: "320px 1fr"}}
        >
            {/* ASIDE: fundo no próprio <aside>, scroll em um wrapper interno */}
            {/*// src/components/character/PlayerBookLayout.tsx */}
            <aside className="relative min-h-0 border-r border-white/10 bg-black/30">
                {/* camadas decorativas FIXAS do aside */}
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-slate-950/40 to-fuchsia-950/30"/>
                </div>
                {/* SCROLLER do aside */}
                <div className="relative z-10 h-full overflow-y-auto">
                    <Particles
                        count={30}
                        colors={["rgba(186,230,253,.7)", "rgb(241,203,14)"]}
                        speed={0.5}
                        radius={{min: 0.4, max: 2}}
                        className="absolute inset-0 h-full w-full mix-blend-screen"
                    />
                    <div className="h-full">{sidebar}</div>
                </div>
            </aside>

            {/* MAIN: fundo e partículas FIXOS, scroll em wrapper interno */}
            <main className="relative bg-transparent">
                {/* fundo (vídeo/poster) FIXO */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <EtherealBackground
                        srcBase="/videos/player"      // sem extensão
                        poster="/videos/player.png"
                        veil={0.74}
                        blurPx={2}
                    />
                    {/* partículas sutis FIXAS sobre o vídeo */}
                    <Particles
                        count={90}
                        colors={["rgba(186,230,253,.7)", "rgba(253,230,138,.5)"]}
                        speed={0.8}
                        radius={{min: 0.4, max: 1.2}}
                        className="absolute inset-0 h-full w-full mix-blend-screen"
                    />
                    {/* vinheta lateral p/ contraste */}
                    <div className="absolute inset-0">
                        <div
                            className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_50%,rgba(0,0,0,.35),transparent_55%)]"/>
                        <div
                            className="absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_50%,rgba(0,0,0,.28),transparent_55%)]"/>
                    </div>
                </div>

                {/* SCROLLER do conteúdo */}
                <div className="relative z-10 h-[calc(100dvh-var(--header-h,64px))] overflow-y-auto">
                    <div className="mx-auto max-w-5xl px-6 py-6">
                        {title && (
                            <header className="mb-4">
                                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                                {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
                            </header>
                        )}
                        <div className="min-h-0">{children}</div>
                    </div>
                </div>
            </main>
        </section>
    );
}
