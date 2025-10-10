// src/components/system/Glass.tsx
export function glassClass(extra = "") {
    return [
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
        extra,
    ].join(" ");
}
