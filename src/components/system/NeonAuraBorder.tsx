// src/components/system/NeonAuraBorder.tsx
"use client";

type Props = {
    radius?: number;   // px
    stroke?: number;   // px
    color1?: string;   // ciano
    color2?: string;   // ouro
    showStroke?: boolean;  // mostrar/ocultar traço (true = borda; false = só aura)
    glow?: number;     // 0..1 (intensidade)
    className?: string;
};

/**
 * Borda neon estática + aura sutil (sem rotação).
 * Use showStroke={false} se quiser só a aura e nenhum traço.
 */
export default function NeonAuraBorder({
                                           radius = 18,
                                           stroke = 2,
                                           color1 = "rgba(51,204,204,1)",
                                           color2 = "rgba(224,179,65,1)",
                                           showStroke = true,
                                           glow = 0.55,
                                           className,
                                       }: Props) {
    const auraStyle: React.CSSProperties = {
        position: "absolute",
        inset: "-18%",
        borderRadius: `${radius * 1.25}px`,
        pointerEvents: "none",
        background: `
      radial-gradient(60% 60% at 50% 50%, ${color1.replace("1)", `${glow})`)}, transparent 60%),
      radial-gradient(40% 40% at 70% 30%, ${color2.replace("1)", `${glow * 0.75})`)}, transparent 60%)
    `,
        filter: "blur(24px)",
        opacity: 0.6,
        animation: "etherPulse 3.6s ease-in-out infinite",
        zIndex: 0,
    };

    const strokeStyle: React.CSSProperties = showStroke
        ? {
            position: "absolute",
            inset: 0,
            borderRadius: `${radius}px`,
            pointerEvents: "none",
            background: `linear-gradient(90deg, ${color1}, ${color2})`,
            WebkitMask: `linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)`,
            WebkitMaskComposite: "xor",
            maskComposite: "exclude" as React.CSSProperties["maskComposite"],
            padding: `${stroke}px`,
            opacity: 0.9,
            zIndex: 1,
        }
        : {};

    return (
        <div aria-hidden className={className} style={{ position: "absolute", inset: 0 }}>
            <div style={auraStyle} />
            {showStroke && <div style={strokeStyle} />}
            <style jsx>{`
        @keyframes etherPulse {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 0.8;  }
        }
      `}</style>
        </div>
    );
}
