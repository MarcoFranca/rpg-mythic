// src/components/character/EtherMotes.tsx
"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function EtherMotes({ className }: { className?: string }) {
    const [animate, setAnimate] = useState(true);
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setAnimate(!reduce);
    }, []);
    const a = animate ? "animate-elyra-float" : "";

    return (
        <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
            {[
                { left: "12%", top: "14%" },
                { left: "28%", top: "32%" },
                { left: "64%", top: "22%" },
                { left: "78%", top: "48%" },
                { left: "22%", top: "72%" },
                { left: "56%", top: "82%" },
            ].map((p, i) => (
                <span
                    key={i}
                    className={cn(
                        "absolute h-1.5 w-1.5 rounded-full bg-cyan-200/80 shadow-[0_0_12px_rgba(186,230,253,.6)]",
                        a
                    )}
                    style={{
                        left: p.left,
                        top: p.top,
                        animationDelay: `${i * 0.6}s`,
                    }}
                />
            ))}
        </div>
    );
}
