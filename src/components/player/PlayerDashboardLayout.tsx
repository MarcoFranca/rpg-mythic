"use client";

import { useCantoAmbient } from "@/lib/audio/useCantoAmbient";
import { useEter } from "@/lib/eter/state";
import { cn } from "@/lib/utils";

export default function PlayerDashboardLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useEter();
    useCantoAmbient();

    return (
        <section
            className="relative min-h-[100dvh] overflow-hidden"
            style={{
                background:
                    `radial-gradient(90rem 60rem at 50% -10%, ${theme.accentSoft}, transparent 60%),` +
                    `linear-gradient(180deg, ${theme.bgFrom}, ${theme.bgTo})`,
                color: theme.text,
            }}
        >
            <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-soft-light [background-image:radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:4px_4px]" />
            <div className={cn("relative z-10 mx-auto max-w-6xl p-6 md:p-10")}>
                {children}
            </div>
        </section>
    );
}
