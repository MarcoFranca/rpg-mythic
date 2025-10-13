"use client";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type PlayerBookLayoutProps = PropsWithChildren<{
    sidebar: React.ReactNode;
    title?: string;
    subtitle?: string;
}>;

export default function PlayerBookLayout({ sidebar, children, title, subtitle }: PlayerBookLayoutProps) {
    return (
        <section className="relative grid h-[calc(100dvh-64px)] grid-cols-1 md:grid-cols-[320px_1fr] bg-black text-white">
            <aside className="border-r border-white/10 bg-gradient-to-b from-emerald-900/30 to-cyan-900/10">
                <ScrollArea className="h-full">{sidebar}</ScrollArea>
            </aside>

            <main className="relative">
                {/* “folhas” do livro: */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(51,204,204,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(224,179,65,0.10),transparent_60%)]" />
                <div className="relative mx-auto h-full max-w-5xl px-6 py-6">
                    {title && (
                        <header className="mb-4">
                            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
                        </header>
                    )}
                    <ScrollArea className="h-[calc(100%-3rem)]">{children}</ScrollArea>
                </div>
            </main>
        </section>
    );
}
