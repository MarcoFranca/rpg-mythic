"use client";

import { useEffect, useMemo, useRef } from "react";

type ParticlesProps = {
    count?: number;
    className?: string;
};

export default function Particles({ count = 120, className }: ParticlesProps) {
    const ref = useRef<HTMLCanvasElement | null>(null);
    const particles = useMemo(
        () =>
            Array.from({ length: count }).map(() => ({
                x: Math.random(),
                y: Math.random(),
                r: Math.random() * 1.5 + 0.3,
                vx: (Math.random() - 0.5) * 0.0006,
                vy: (Math.random() - 0.5) * 0.0006,
                a: Math.random() * 0.6 + 0.2,
            })),
        [count]
    );

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;
        const resize = () => {
            const { width, height } = canvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(width * ratio));
            canvas.height = Math.max(1, Math.floor(height * ratio));
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();

        const step = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > 1) p.vx *= -1;
                if (p.y < 0 || p.y > 1) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x * canvas.clientWidth, p.y * canvas.clientHeight, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.a})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [particles]);

    return <canvas ref={ref} className={className ?? "absolute inset-0 h-full w-full"} aria-hidden />;
}
