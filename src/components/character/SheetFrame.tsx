"use client";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    maxHeight?: string;        // desktop
    maxHeightMobile?: string;  // mobile
    /** Quando true (padrão), cria ScrollArea interna com max-height.
     *  Quando false, NÃO cria ScrollArea — o card cresce conforme o conteúdo. */
    scroll?: boolean;
};

/**
 * Frame com borda sutil, padding e (opcional) rolagem controlada.
 */
export function SheetFrame({
                               children,
                               className,
                               contentClassName,
                               maxHeight = "85dvh",
                               maxHeightMobile = "75dvh",
                               scroll = true,
                           }: Props) {
    return (
        <div
            className={cn(
                "relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] shadow-sm",
                className
            )}
        >
            {scroll ? (
                <ScrollArea
                    className={cn("rounded-2xl", "max-h-[var(--sf-max-h)]")}
                    style={
                        {
                            "--sf-max-h": `clamp(${maxHeightMobile}, 80dvh, ${maxHeight})`,
                        } as React.CSSProperties
                    }
                >
                    <div className={cn("p-4 md:p-6", contentClassName)}>{children}</div>
                </ScrollArea>
            ) : (
                <div className={cn("p-4 md:p-6", contentClassName)}>{children}</div>
            )}

            {/* hairline externo sutil */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/[0.06]" />
        </div>
    );
}
