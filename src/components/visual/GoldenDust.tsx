"use client";

import { useEffect, useRef } from "react";

type Props = {
    /** de 0.00003 a 0.0002 é um bom intervalo */
    density?: number;
    /** 0..1 (0 = parado, 1 = rápido) */
    speed?: number;
    /** 0..1 (0 = quase nada, 1 = bem brilhante) */
    intensity?: number;
    /** z-index para posicionar entre vídeo e UI */
    zIndex?: number;
    /** opcional: matiz em graus (ex.: 42 = âmbar, 50 = ouro) */
    hue?: number;
};

export default function GoldenDust({
                                       density = 0.00008,
                                       speed = 0.55,
                                       intensity = 0.85,
                                       zIndex = 8,
                                       hue = 46, // âmbar-dourado
                                   }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const particlesRef = useRef<
        { x: number; y: number; r: number; v: number; a0: number; tw: number; ph: number; d: number }[]
    >([]);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d", { alpha: true })!;
        let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
        let h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
        ctx.scale(devicePixelRatio, devicePixelRatio);

        const spawn = () => {
            particlesRef.current = [];
            const count = Math.max(40, Math.floor(canvas.clientWidth * canvas.clientHeight * density));
            for (let i = 0; i < count; i++) {
                const depth = Math.random();                  // 0 (perto) .. 1 (longe)
                const r = 0.6 + (1.8 - 0.6) * (1 - depth);    // tamanho
                const v = (0.1 + Math.random() * 0.6) * speed * (1 - depth); // velocidade
                particlesRef.current.push({
                    x: Math.random() * canvas.clientWidth,
                    y: Math.random() * canvas.clientHeight,
                    r,
                    v,
                    a0: 0.15 + Math.random() * 0.45 * intensity, // brilho base
                    tw: 1.2 + Math.random() * 2.0,               // velocidade do brilho
                    ph: Math.random() * Math.PI * 2,             // fase do brilho
                    d: depth,
                });
            }
        };

        spawn();

        const draw = (t: number) => {
            // “apaga” com leve trilha para suavidade
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            for (const p of particlesRef.current) {
                // flutua pra cima + leve drift horizontal
                p.y -= p.v;
                p.x += Math.sin((t * 0.0003 + p.ph) * (0.6 + p.d)) * 0.15;

                // recicla
                if (p.y < -10) p.y = canvas.clientHeight + 10;
                if (p.x < -10) p.x = canvas.clientWidth + 10;
                if (p.x > canvas.clientWidth + 10) p.x = -10;

                // tremulação do brilho (twinkle)
                const tw = p.a0 + Math.sin(t * 0.001 * p.tw + p.ph) * 0.08 * intensity;
                const alpha = Math.max(0, Math.min(1, tw));

                // cor/halo (screen)
                ctx.beginPath();
                ctx.fillStyle = `hsla(${hue}, 95%, 70%, ${alpha})`;
                ctx.shadowBlur = 10 * (1 - p.d) + 4;
                ctx.shadowColor = `hsla(${hue}, 95%, 65%, ${alpha})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        const onResize = () => {
            w = canvas.width = canvas.offsetWidth * devicePixelRatio;
            h = canvas.height = canvas.offsetHeight * devicePixelRatio;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(devicePixelRatio, devicePixelRatio);
            spawn();
        };

        rafRef.current = requestAnimationFrame(draw);
        const ro = new ResizeObserver(onResize);
        ro.observe(canvas);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            ro.disconnect();
        };
    }, [density, speed, intensity, hue]);

    return (
        <div
            className="pointer-events-none absolute inset-0"
            style={{ zIndex, mixBlendMode: "screen" }}
            aria-hidden
        >
            {/* máscara suave nas bordas para não poluir a UI */}
            <div
                className="absolute inset-0"
                style={{
                    WebkitMask:
                        "radial-gradient(ellipse at 50% 55%, black 60%, transparent 95%)",
                    mask:
                        "radial-gradient(ellipse at 50% 55%, black 60%, transparent 95%)",
                }}
            />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
}
