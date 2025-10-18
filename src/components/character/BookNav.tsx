"use client";

import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { CheckCircle2, Circle, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconComponent = React.ComponentType<{ className?: string }>;
type IconElement = React.ReactElement<{ className?: string }>;
type AnyIcon = IconComponent | IconElement | StaticImageData | string;

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

const ICON_SIZE = "h-7 w-7";

function isStaticImageData(x: unknown): x is StaticImageData {
    return !!x && typeof x === "object" && "src" in (x as Record<string, unknown>);
}

/** Render seguro: evita “imagem quebrada” se vier string vazia/errada */
function renderIcon(icon?: AnyIcon, extraClass = "") {
    if (!icon) return <Wand2 className={cn(ICON_SIZE, "text-white/80", extraClass)} />;

    if (typeof icon === "string") {
        const trimmed = icon.trim();
        if (!trimmed) return <Wand2 className={cn(ICON_SIZE, "text-white/80", extraClass)} />;
        const src = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return (
            <Image
                src={src}
                alt=""
                width={48}
                height={48}
                className={cn(ICON_SIZE, "invert opacity-90", extraClass)}
                priority={false}
                aria-hidden
                onError={(e) => {
                    // esconde se quebrar e deixa o fallback visual limpo
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                unoptimized
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
                className={cn(ICON_SIZE, "invert opacity-90", extraClass)}
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
        <div
            className={cn(
                "flex h-full flex-col p-4",
                "bg-black/30 backdrop-blur-sm", // base translúcida para legibilidade
                className
            )}
        >
            <h2 className="mb-3 text-sm font-medium tracking-[0.2em] text-white/70 uppercase">
                Capítulos do Cântico
            </h2>

            <ol className="min-h-0 flex-1 space-y-2 pr-1">
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
                                    "relative w-full justify-start gap-3 rounded-xl text-left ring-1 ring-white/10 transition-colors",
                                    "bg-white/[0.04] hover:bg-white/[0.08]",
                                    active && "bg-cyan-700/30 hover:bg-cyan-700/35 ring-cyan-400/25",
                                    c.disabled && "cursor-not-allowed opacity-50 hover:bg-white/[0.04]"
                                )}
                                aria-current={active ? "page" : undefined}
                            >
                                {/* AURA conic no item ativo */}
                                {active && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "pointer-events-none absolute -inset-px rounded-[inherit]",
                                            "[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)]",
                                            "[mask-composite:exclude]",
                                            "p-px",
                                            "before:absolute before:inset-0 before:rounded-[inherit]",
                                            "before:bg-[conic-gradient(from_0deg,rgba(34,211,238,.6),rgba(234,179,8,.5),transparent_30%)]",
                                            "before:animate-[spin_6s_linear_infinite]"
                                        )}
                                        style={{
                                            WebkitMaskComposite: "xor",
                                            maskComposite: "exclude",
                                        }}
                                    />
                                )}

                                {done ? (
                                    <CheckCircle2
                                        className={cn(ICON_SIZE, "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,.45)]")}
                                    />
                                ) : (
                                    <Circle className={cn(ICON_SIZE, "text-white/60")} />
                                )}

                                {renderIcon(
                                    c.icon,
                                    active
                                        ? "text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,.45)]"
                                        : "text-white/85"
                                )}

                                <div className="text-left">
                                    <div className="text-sm font-medium text-white">{c.title}</div>
                                    <div className="text-xs text-white/60">{c.description}</div>
                                </div>

                                {active && <Sparkles className="ml-auto h-5 w-5 text-cyan-200/80" aria-hidden />}
                            </Button>
                        </li>
                    );
                })}
            </ol>

            <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { transform: scale(.9); opacity: .6 }
          50% { transform: scale(1.2); opacity: 1 }
        }
        @keyframes drift {
          0% { transform: translate(0, 0) }
          25% { transform: translate(4px, -3px) }
          50% { transform: translate(0, -6px) }
          75% { transform: translate(-3px, -2px) }
          100% { transform: translate(0, 0) }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="twinkle"], [style*="drift"] { animation: none !important; }
        }
      `}</style>
        </div>
    );
}
