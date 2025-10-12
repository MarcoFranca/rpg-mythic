// src/components/system/EtherealParticles.tsx
"use client";

import { useEffect, useState } from "react";

type Dot = {
    key: number;
    left: string;
    top: string;
    size: string;
    duration: number; // s
    delay: number;    // s
    opacity: number;
    dx: number;       // px
    dy: number;       // px
    glow: number;     // px
};

type Props = {
    className?: string;
    density?: number;    // quantidade de partículas
    maxSize?: number;    // px (tamanho máximo)
    drift?: number;      // amplitude do movimento (px)
    brightness?: number; // 0..1 (intensidade geral)
};

export default function EtherealParticles({
                                              className,
                                              density = 22,
                                              maxSize = 3.5,
                                              drift = 12,
                                              brightness = 0.9,
                                          }: Props) {
    // 1) Ordem de hooks estável em todos os renders
    const [dots, setDots] = useState<Dot[]>([]);

    // 2) Geração client-only (evita aleatoriedade no SSR)
    useEffect(() => {
        const gen = Array.from({ length: density }).map((_, i) => {
            const size = Math.random() * (maxSize - 1) + 1;
            const duration = Math.random() * 8 + 7; // 7–15s
            const delay = Math.random() * 5;        // 0–5s
            const opacity = (Math.random() * 0.35 + 0.35) * brightness;
            const dx = (Math.random() * 2 - 1) * drift; // -drift..drift
            const dy = (Math.random() * 2 - 1) * drift;
            const glow = 8 + Math.random() * 10;    // 8–18
            return {
                key: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: `${size}px`,
                duration,
                delay,
                opacity,
                dx,
                dy,
                glow,
            } as Dot;
        });
        setDots(gen);
    }, [density, maxSize, drift, brightness]);

    return (
        <div className={className} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {/* partículas */}
            {dots.map((d) => (
                <span
                    key={d.key}
                    className="absolute rounded-full"
                    style={{
                        left: d.left,
                        top: d.top,
                        width: d.size,
                        height: d.size,
                        background:
                            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.2) 60%, transparent 70%)",
                        opacity: d.opacity,
                        filter: "blur(0.5px)",
                        boxShadow: `0 0 ${d.glow}px rgba(51,204,204,0.55)`,
                        animation: `
              etherFloat-${d.key} ${d.duration}s ease-in-out ${d.delay}s infinite alternate,
              etherTwinkle-${d.key} ${Math.max(2, d.duration / 3)}s ease-in-out ${d.delay}s infinite
            `,
                        willChange: "transform, opacity, filter",
                    }}
                />
            ))}

            {/* keyframes por partícula (estáveis após mount) */}
            <style jsx>{`
        ${dots
                .map(
                    (d) => `
          @keyframes etherFloat-${d.key} {
            0%   { transform: translate3d(0px, 0px, 0) scale(1); }
            100% { transform: translate3d(${d.dx.toFixed(2)}px, ${d.dy.toFixed(2)}px, 0) scale(1.05); }
          }
          @keyframes etherTwinkle-${d.key} {
            0%, 100% { filter: blur(0.5px); opacity: ${Math.min(1, d.opacity).toFixed(2)}; }
            50%      { filter: blur(0.8px); opacity: 1; }
          }
        `
                )
                .join("\n")}
      `}</style>
        </div>
    );
}
