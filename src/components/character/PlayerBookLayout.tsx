// src/components/character/PlayerBookLayout.tsx
"use client";
import { PropsWithChildren, ReactNode } from "react";
import EtherealBackground from "./EtherealBackground";
import Particles from "@/components/marketing/Particles";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

type PlayerBookLayoutProps = PropsWithChildren<{
    sidebar: React.ReactNode;
    title?: string;
    subtitle?: string;
}>;

/** Sheet lateral para capítulos no mobile */
function MobileChaptersSheet({ children }: { children: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-white/90 hover:text-white"
                >
                    <Menu className="h-4 w-4" />
                    Capítulos
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                // largura confortável no mobile; sem “any”, só classes utilitárias
                className="w-[88vw] max-w-sm p-0 bg-black/70 backdrop-blur border-white/10 text-white"
            >
                <SheetHeader className="p-3 border-b border-white/10">
                    <SheetTitle className="text-white/90">Capítulos</SheetTitle>
                </SheetHeader>
                {/* scroller interno do menu */}
                <div className="h-[calc(100dvh-3rem)] overflow-y-auto">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default function PlayerBookLayout({
                                             sidebar,
                                             children,
                                             title,
                                             subtitle,
                                         }: PlayerBookLayoutProps) {
    // defina uma altura padrão única para o header da app (desktop + mobile)
    // e para a topbar mobile (aprox. 44px)
    const headerVar = "var(--header-h,64px)";
    const mobileTopbarPx = 44;

    return (
        <section
            className="relative grid text-white overflow-hidden md:[grid-template-columns:320px_1fr]"
            style={{ height: `calc(100dvh - ${headerVar})` }}
        >
            {/* ASIDE (desktop) */}
            <aside className="relative min-h-0 border-r border-white/10 bg-black/30 hidden md:block">
                <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-slate-950/40 to-fuchsia-950/30" />
                </div>
                <div className="relative z-10 h-full overflow-y-auto">
                    <Particles
                        count={30}
                        colors={["rgba(186,230,253,.7)", "rgb(241,203,14)"]}
                        speed={0.5}
                        radius={{ min: 0.4, max: 2 }}
                        className="absolute inset-0 h-full w-full mix-blend-screen"
                    />
                    <div className="h-full">{sidebar}</div>
                </div>
            </aside>

            {/* MAIN */}
            <main className="relative bg-transparent min-h-0 flex flex-col">
                {/* TOP BAR MOBILE — AGORA VISÍVEL E FIXA */}
                <div className="sticky top-0 z-30 md:hidden border-b border-white/10 bg-black/50 px-4 py-2 backdrop-blur flex items-center justify-between">
                    <MobileChaptersSheet>{sidebar}</MobileChaptersSheet>
                    {title ? (
                        <span className="text-sm font-medium text-white/80 truncate ml-2">
              {title}
            </span>
                    ) : null}
                </div>

                {/* Fundo fixo */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <EtherealBackground
                        srcBase="/videos/player"
                        poster="/videos/player.png"
                        veil={0.74}
                        blurPx={2}
                    />
                    <Particles
                        count={90}
                        colors={["rgba(186,230,253,.7)", "rgba(253,230,138,.5)"]}
                        speed={0.8}
                        radius={{ min: 0.4, max: 1.2 }}
                        className="absolute inset-0 h-full w-full mix-blend-screen md:opacity-100 opacity-80"
                    />
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_50%,rgba(0,0,0,.35),transparent_55%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_50%,rgba(0,0,0,.28),transparent_55%)]" />
                    </div>
                </div>

                {/* SCROLLER DO CONTEÚDO
            - desktop: ocupa (100dvh - header)
            - mobile: subtrai também a topbar (≈44px) para não cobrir a barra
        */}
                <div
                    className={[
                        "relative z-10 overflow-y-auto",
                        `md:h-[calc(100dvh-${headerVar})]`,
                        `h-[calc(100dvh-${headerVar}-${mobileTopbarPx}px)]`,
                    ].join(" ")}
                >
                    <div className="mx-auto max-w-5xl px-6 py-6">
                        {title && (
                            <header className="mb-4 hidden md:block">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-sm text-white/70">{subtitle}</p>
                                )}
                            </header>
                        )}
                        <div className="min-h-0">{children}</div>
                    </div>
                </div>
            </main>
        </section>
    );
}
