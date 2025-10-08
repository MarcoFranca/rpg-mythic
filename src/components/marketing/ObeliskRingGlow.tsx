// components/marketing/ObeliskRingGlow.tsx
"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Props = {
    sizeVmin?: number;
    opacity?: number;
    reactToFocus?: boolean;
    anchor?: "container" | "viewport";
    parallax?: boolean;
    strength?: number;
    offsetX?: number;
    offsetY?: number;
    className?: string;
};

export default function ObeliskRingGlow({
                                            sizeVmin = 56,
                                            opacity = 0.32,
                                            reactToFocus = true,
                                            anchor = "container",
                                            parallax = true,
                                            strength = 0.02,
                                            offsetX = 0,
                                            offsetY = 0,
                                            className = "",
                                        }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const [reduced, setReduced] = useState(false);
    const [coarse, setCoarse] = useState(false);
    useEffect(() => {
        const mq1 = window.matchMedia("(prefers-reduced-motion: reduce)");
        const mq2 = window.matchMedia("(pointer: coarse)");
        setReduced(mq1.matches);
        setCoarse(mq2.matches);
        const on1 = () => setReduced(mq1.matches);
        const on2 = () => setCoarse(mq2.matches);
        mq1.addEventListener?.("change", on1);
        mq2.addEventListener?.("change", on2);
        return () => {
            mq1.removeEventListener?.("change", on1);
            mq2.removeEventListener?.("change", on2);
        };
    }, []);

    const enableParallax = useMemo(() => parallax && !reduced && !coarse, [parallax, reduced, coarse]);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const x = useSpring(mx, { stiffness: 40, damping: 12 });
    const y = useSpring(my, { stiffness: 40, damping: 12 });
    const tx = useTransform(x, (v) => v);
    const ty = useTransform(y, (v) => v);

    // >>> SEMENTE INICIAL: garante que já começa no lugar correto (sem “escorregar”)
    useLayoutEffect(() => {
        // centraliza no container e aplica offset inicial
        mx.set(offsetX);
        my.set(offsetY);
    }, [mx, my, offsetX, offsetY]);

    // Parallax ANCORADO ao container/viewport
    useEffect(() => {
        if (!enableParallax) {
            mx.set(offsetX);
            my.set(offsetY);
            return;
        }
        const onMove = (e: MouseEvent) => {
            let cx = window.innerWidth / 2;
            let cy = window.innerHeight / 2;

            if (anchor === "container" && ref.current) {
                const r = ref.current.getBoundingClientRect();
                cx = r.left + r.width / 2;
                cy = r.top + r.height / 2;
            }
            mx.set((e.clientX - cx) * strength + offsetX);
            my.set((e.clientY - cy) * strength + offsetY);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, [anchor, enableParallax, mx, my, strength, offsetX, offsetY]);

    // Micro boost em foco
    useEffect(() => {
        if (!reactToFocus) return;
        const onFocus = () => document.body.classList.add("ring-boost");
        const onBlur = () => document.body.classList.remove("ring-boost");
        window.addEventListener("focusin", onFocus);
        window.addEventListener("focusout", onBlur);
        return () => {
            window.removeEventListener("focusin", onFocus);
            window.removeEventListener("focusout", onBlur);
        };
    }, [reactToFocus]);

    return (
        <div
            ref={ref}
            aria-hidden
            className={`pointer-events-none absolute inset-0 grid place-items-center ${className}`}
        >
            {/* initial={false} evita qualquer animação “do estado inicial” para o atual */}
            <motion.div
                initial={false}
                style={{ x: tx, y: ty }}
                animate={{ opacity, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }} // só para opacity/scale
                className="rounded-full will-change-transform transform-gpu"
            >
                <motion.div
                    aria-hidden
                    className="rounded-full mix-blend-screen"
                    animate={{ scale: [1, 1.01, 1], filter: ["blur(8px)", "blur(10px)", "blur(8px)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        width: `min(${sizeVmin}vmin, 560px)`,
                        height: `min(${sizeVmin}vmin, 560px)`,
                        background:
                            "conic-gradient(from 0deg, rgba(99,102,241,.25), rgba(34,197,94,.12), rgba(56,189,248,.22), rgba(234,179,8,.12), rgba(99,102,241,.25))",
                        boxShadow: "0 0 140px 40px rgba(56,189,248,.10) inset, 0 0 160px rgba(99,102,241,.10)",
                    }}
                />
            </motion.div>

            <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .mix-blend-screen { animation: none !important; }
        }
        body.ring-boost .mix-blend-screen {
          transform: scale(1.03) !important;
          filter: blur(10px) !important;
          opacity: 0.38 !important;
        }
      `}</style>
        </div>
    );
}
