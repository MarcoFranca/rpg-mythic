// src/components/marketing/Particles.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";

type ParticlesProps = {
    count?: number;
    className?: string;
    colors?: string[];         // ex: ["rgba(186,230,253,.75)","rgba(253,230,138,.55)"]
    speed?: number;            // 1 = padrão, <1 mais lento, >1 mais rápido
    radius?: { min: number; max: number }; // px
};

export default function Particles({
                                      count = 120,
                                      className,
                                      colors = ["rgba(186,230,253,.75)", "rgba(253,230,138,.55)"],
                                      speed = 1,
                                      radius = { min: 0.5, max: 1.6 },
                                  }: ParticlesProps) {
    const ref = useRef<HTMLCanvasElement | null>(null);

    // reduz densidade/velocidade se usuário preferir menos movimento
    const effective = useMemo(() => {
        const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        const c = reduce ? Math.max(20, Math.floor(count * 0.35)) : count;
        const s = reduce ? speed * 0.4 : speed;
        return { count: c, speed: s };
    }, [count, speed]);

    const particles = useMemo(
        () =>
            Array.from({ length: effective.count }).map((_, i) => ({
                x: Math.random(),
                y: Math.random(),
                r: rand(radius.min, radius.max),
                vx: (Math.random() - 0.5) * 0.0006 * effective.speed,
                vy: (Math.random() - 0.5) * 0.0006 * effective.speed,
                hueIndex: i % colors.length,
                a: Math.random() * 0.4 + 0.25,
            })),
        [effective.count, effective.speed, radius.min, radius.max, colors.length]
    );

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;
        let stopped = document.hidden; // pausa se aba estiver oculta

        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR por performance
            canvas.width = Math.max(1, Math.floor(width * ratio));
            canvas.height = Math.max(1, Math.floor(height * ratio));
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const handleVis = () => { stopped = document.hidden; if (!stopped) step(); };
        document.addEventListener("visibilitychange", handleVis, { passive: true });

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        ctx.globalCompositeOperation = "lighter"; // brilho somado

        const step = () => {
            if (stopped) return;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            ctx.clearRect(0, 0, w, h);

            for (const p of particles) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > 1) p.vx *= -1;
                if (p.y < 0 || p.y > 1) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
                ctx.fillStyle = colors[p.hueIndex] ?? "rgba(255,255,255,.6)";
                ctx.globalAlpha = p.a;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(step);
        };

        raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            document.removeEventListener("visibilitychange", handleVis);
        };
    }, [particles, colors]);

    return (
        <canvas
            ref={ref}
            className={className ?? "absolute inset-0 h-full w-full"}
            aria-hidden
        />
    );
}

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
