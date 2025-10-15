// src/components/character/BookNav.tsx
"use client";

import * as React from "react";
import { CheckCircle2, Circle, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnyIcon = React.ElementType | React.ReactElement | string | Record<string, any>;

export type BookChapter = {
    id: string;
    title: string;
    description: string;
    icon?: AnyIcon;
    completed?: boolean;
    disabled?: boolean;
};

type BookNavProps = {
    chapters: BookChapter[];
    currentId: string;
    onSelect: (id: string) => void;
    className?: string;
};

function renderIcon(icon?: AnyIcon) {
    if (!icon) return <Wand2 className="h-4 w-4 text-white/80" />;

    // 1) string: caminho em /public
    if (typeof icon === "string") {
        return <img src={icon} alt="" className="h-4 w-4 invert opacity-80" />;
    }

    // 2) elemento React já criado
    if (React.isValidElement(icon)) {
        return React.cloneElement(icon as any, {
            className: cn("h-4 w-4", (icon as any).props?.className),
        });
    }

    // 3) objeto de imagem estática do Next: { src, width, height, ... }
    if (typeof icon === "object" && icon && "src" in icon && typeof (icon as any).src === "string") {
        return <img src={(icon as any).src} alt="" className="h-4 w-4 invert opacity-80" />;
    }

    // 4) componente React (Lucide, SVGR, etc.)
    const Cmp = icon as React.ElementType;
    return <Cmp className="h-4 w-4 text-white/80" />;
}

export default function BookNav({ chapters, currentId, onSelect, className }: BookNavProps) {
    return (
        <aside className={cn("sticky top-0 h-screen p-4 bg-gradient-to-b from-cyan-950/40 via-slate-950/40 to-fuchsia-950/30 ring-1 ring-white/10 rounded-none relative overflow-hidden", className)}>
            <MagicDust />
            <div className="relative z-10 flex h-full flex-col">
                <h2 className="mb-3 text-sm font-medium tracking-[0.2em] text-white/70 uppercase">Capítulos do Cântico</h2>
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <ol className="space-y-2 pb-4">
                        {chapters.map((c) => {
                            const active = c.id === currentId;
                            const done = !!c.completed;
                            return (
                                <li key={c.id}>
                                    <Button
                                        type="button"
                                        disabled={c.disabled}
                                        onClick={() => !c.disabled && onSelect(c.id)}
                                        className={cn(
                                            "w-full justify-start gap-3 rounded-xl text-left ring-1 ring-white/10 transition-colors",
                                            "bg-white/[0.04] hover:bg-white/[0.08]",
                                            active && "bg-cyan-700/30 hover:bg-cyan-700/35 ring-cyan-400/25",
                                            c.disabled && "opacity-50 cursor-not-allowed hover:bg-white/[0.04]"
                                        )}
                                    >
                                        {done ? <CheckCircle2 className="h-4 w-4 text-cyan-300" /> : <Circle className="h-4 w-4 text-white/60" />}
                                        <span className="shrink-0">{renderIcon(c.icon)}</span>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-white">{c.title}</div>
                                            <div className="text-xs text-white/60">{c.description}</div>
                                        </div>
                                        {active && <Sparkles className="ml-auto h-4 w-4 text-cyan-200/80" />}
                                    </Button>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>

            <style jsx global>{`
        @keyframes twinkle { 0%,100%{transform:scale(.9);opacity:.6} 50%{transform:scale(1.2);opacity:1} }
      `}</style>
        </aside>
    );
}

function MagicDust() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-10 -left-20 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <Dot x="15%" y="8%" />
            <Dot x="30%" y="20%" delay="0.3s" />
            <Dot x="70%" y="15%" delay="0.6s" />
            <Dot x="85%" y="35%" delay="0.1s" />
            <Dot x="20%" y="70%" delay="0.5s" />
            <Dot x="65%" y="80%" delay="0.9s" />
        </div>
    );
}
function Dot({ x, y, delay }: { x: string; y: string; delay?: string }) {
    return (
        <span
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200/70"
            style={{ left: x, top: y, animation: "twinkle 2.6s ease-in-out infinite", animationDelay: delay ?? "0s", boxShadow: "0 0 8px rgba(186,230,253,0.55), 0 0 16px rgba(186,230,253,0.25)" }}
        />
    );
}
