// src/components/system/OuterAuraGlow.tsx
"use client";

/**
 * Aura externa que “vaza” além do card.
 * Coloque como irmão do conteúdo, dentro de um container `relative` e **sem** overflow-hidden.
 */
export default function OuterAuraGlow({
                                          radius = 22,
                                          color1 = "rgba(51,204,204,0.55)",
                                          color2 = "rgba(224,179,65,0.45)",
                                          intensity = 1, // multiplica a opacidade
                                          className,
                                      }: {
    radius?: number;
    color1?: string;
    color2?: string;
    intensity?: number;
    className?: string;
}) {
    const style: React.CSSProperties = {
        position: "absolute",
        inset: "-28%",                // vaza bem para fora
        borderRadius: `${radius * 1.35}px`,
        pointerEvents: "none",
        background: `
      radial-gradient(60% 60% at 50% 50%, ${color1}, transparent 60%),
      radial-gradient(46% 46% at 30% 70%, ${color2}, transparent 60%)
    `,
        filter: "blur(36px)",
        opacity: 0.5 * intensity,
        animation: "outerAuraBreath 4.2s ease-in-out infinite",
        zIndex: 0,
    };

    return (
        <div aria-hidden className={className} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <div style={style} />
            <style jsx>{`
        @keyframes outerAuraBreath {
          0%, 100% { opacity: ${0.35 * intensity}; transform: scale(0.98); }
          50%      { opacity: ${0.75 * intensity}; transform: scale(1.02); }
        }
      `}</style>
        </div>
    );
}
