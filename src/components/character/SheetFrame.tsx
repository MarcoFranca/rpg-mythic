"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Frame com borda sutil, padding e rolagem controlada.
 * - Aplica um container com borda/gradiente
 * - Controla a altura para o drawer (mobile/desktop)
 */
export function SheetFrame({
                               children,
                               className,
                               contentClassName,
                               maxHeight = "85dvh", // desktop
                               maxHeightMobile = "75dvh", // mobile
                           }: {
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    maxHeight?: string;
    maxHeightMobile?: string;
}) {
    return (
        <div
            className={cn(
                "relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] shadow-sm",
                className
            )}
            style={{}}
        >
            <ScrollArea
                className={cn(
                    "rounded-2xl",
                    "max-h-[var(--sf-max-h)]",
                )}
                style={
                    {
                        // controla max-height com CSS custom prop (mobile vs desktop)
                        "--sf-max-h": `clamp(${maxHeightMobile}, 80dvh, ${maxHeight})`,
                    } as React.CSSProperties
                }
            >
                <div className={cn("p-4 md:p-6", contentClassName)}>{children}</div>
            </ScrollArea>

            {/* hairline externo sutil */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/[0.06]" />
        </div>
    );
}
