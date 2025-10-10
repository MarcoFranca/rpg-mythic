"use client";

import { useMemo } from "react";
import { useEter } from "@/lib/eter/state";
import { glassClass } from "@/components/system/Glass";

export function FaithMeter(props: { faith: number; corruption: number; ether: number }) {
    const { theme, idg } = useEter();
    const bars = useMemo(
        () => [
            { key: "Fé", value: props.faith, color: theme.accent },
            { key: "Éter", value: props.ether, color: "#E0B341" },
            { key: "Sombrasangue", value: props.corruption, color: "#642F73" },
        ],
        [props.faith, props.ether, props.corruption, theme.accent]
    );

    return (
        <div className={glassClass("p-4")} style={{ boxShadow: `0 0 0 1px ${theme.accentSoft}` }}>
            <div className="mb-2 text-sm opacity-85">
                Equilíbrio Espiritual <span className="opacity-70">(IDG: {idg})</span>
            </div>
            <div className="space-y-3">
                {bars.map((b) => (
                    <div key={b.key}>
                        <div className="mb-1 flex items-center justify-between text-xs opacity-80">
                            <span>{b.key}</span><span>{b.value}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/30">
                            <div className="h-full rounded-full transition-[width]" style={{ width: `${b.value}%`, background: b.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
