// src/components/character/BookNav.tsx
"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { CheckCircle2, Circle, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconComponent = React.ComponentType<{ className?: string }>;
type IconElement = React.ReactElement<{ className?: string }>;

type AnyIcon =
    | IconComponent
    | IconElement
    | StaticImageData
    | string;

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

// 🔧 tamanho unificado dos ícones (maior que antes)
const ICON = "h-5 w-5 md:h-6 md:w-6";

// util
function isStaticImageData(x: unknown): x is StaticImageData {
    return !!x && typeof x === "object" && "src" in (x as Record<string, unknown>);
}

const ICON_SIZE = "h-7 w-7"; // mude para "h-7 w-7" se quiser ainda maior

function renderIcon(icon?: AnyIcon, extraClass = "") {
    if (!icon) return <Wand2 className={cn(ICON_SIZE, "text-white/80", extraClass)} />;

    if (typeof icon === "string") {
        return (
            <Image
                src={icon}
                alt=""
                width={48}
                height={48}
                className={cn(ICON_SIZE, "text-white/80 invert opacity-90", extraClass)}
                priority={false}
                aria-hidden
            />
        );
    }

    if (isStaticImageData(icon)) {
        return (
            <Image
                src={icon}
                alt=""
                width={48}
                height={48}
                className={cn(ICON_SIZE, "text-white/80 invert opacity-90", extraClass)}
                priority={false}
                aria-hidden
            />
        );
    }

    if (React.isValidElement<{ className?: string }>(icon)) {
        return React.cloneElement(icon, {
            className: cn(ICON_SIZE, "text-white/85", icon.props.className, extraClass),
        });
    }

    const Cmp = icon as IconComponent;
    return <Cmp className={cn(ICON_SIZE, "text-white/85", extraClass)} />;
}

export default function BookNav({ chapters, currentId, onSelect, className }: BookNavProps) {
    return (
        <aside
            className={cn(
                "sticky top-0 h-screen p-4 bg-gradient-to-b from-cyan-950/40 via-slate-950/40 to-fuchsia-950/30",
                "ring-1 ring-white/10 rounded-none relative overflow-hidden",
                className
            )}
        >
            <MagicDust />
            <div className="relative z-10 flex h-full flex-col">
                <h2 className="mb-3 text-sm font-medium tracking-[0.2em] text-white/70 uppercase">
                    Capítulos do Cântico
                </h2>

                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <ol className="m-2 space-y-2 pb-4">
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
                                        )}>
                                        {done ? (
                                            <CheckCircle2 className={cn(ICON_SIZE, "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,.45)]")} />
                                        ) : (
                                            <Circle className={cn(ICON_SIZE, "text-white/60")} />
                                        )}

                                        {/* ícone principal — ganha “neon” quando ativo */}
                                         {renderIcon(
                                            c.icon,
                                            active ? "text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,.45)]" : "text-white/85"
                                        )}
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-white">{c.title}</div>
                                            <div className="text-xs text-white/60">{c.description}</div>
                                        </div>

                                        {active && <Sparkles className={cn(ICON, "ml-auto text-cyan-200/80")} />}
                                    </Button>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>

            <style jsx global>{`
                @keyframes twinkle { 0%,100%{transform:scale(.9);opacity:.6} 50%{transform:scale(1.2);opacity:1} }
                @keyframes drift {
                    0% { transform: translate(0,0) }
                    25% { transform: translate(4px,-3px) }
                    50% { transform: translate(0,-6px) }
                    75% { transform: translate(-3px,-2px) }
                    100% { transform: translate(0,0) }
                }
                @media (prefers-reduced-motion: reduce) {
                    [style*="twinkle"], [style*="drift"] { animation: none !important; }
                }
            `}</style>
        </aside>
    );
}

/** partículas leves com drift */
function MagicDust() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-10 -left-20 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <Dot x="15%" y="8%" delay="0s" />
            <Dot x="30%" y="20%" delay=".3s" />
            <Dot x="70%" y="15%" delay=".6s" />
            <Dot x="85%" y="35%" delay=".1s" />
            <Dot x="20%" y="70%" delay=".5s" />
            <Dot x="65%" y="80%" delay=".9s" />
        </div>
    );
}
function Dot({ x, y, delay }: { x: string; y: string; delay?: string }) {
    return (
        <span
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200/70"
            style={{
                left: x,
                top: y,
                animation: "twinkle 2.6s ease-in-out infinite, drift 12s ease-in-out infinite",
                animationDelay: `${delay ?? "0s"}, ${delay ?? "0s"}`,
                boxShadow: "0 0 8px rgba(186,230,253,0.55), 0 0 16px rgba(186,230,253,0.25)",
            }}
        />
    );
}
