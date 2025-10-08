// components/marketing/AuthBackground.tsx
"use client";

import { useEffect, useState } from "react";
import Particles from "@/components/marketing/Particles";

export default function AuthBackground() {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0  overflow-hidden">
            {/* Partículas (leves em mobile) */}
            <Particles count={typeof window !== "undefined" && window.innerWidth < 768 ? 60 : 120} />

            {/* Gradiente base do Éter */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.15),transparent_60%)]" />

            {/* Aurora orgânica (sem arestas) */}
            {!reducedMotion && (
                <div className="absolute inset-0">
                    {/* Cada "blob" é um círculo radial com blur, sem bordas retas */}
                    <div className="aurora-blob" style={{ animationDelay: "0s" }} />
                    <div className="aurora-blob aurora-blob--b" style={{ animationDelay: "4s" }} />
                    <div className="aurora-blob aurora-blob--c" style={{ animationDelay: "8s" }} />
                </div>
            )}

            {/* Textura + foco central (vignette) */}
            <div
                className="absolute inset-0 opacity-40 mix-blend-screen"
                style={{ backgroundImage: "url('/noise.png')" }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at center, rgba(0,0,0,0) 42%, rgba(0,0,0,.46) 100%)",
                }}
            />

            <style jsx global>{`
        .aurora-blob {
          position: absolute;
          left: 10%;
          top: 20%;
          width: 60vmin;
          height: 60vmin;
          border-radius: 9999px;
          filter: blur(40px);
          mix-blend-mode: screen;
          background: radial-gradient(circle at 50% 50%, rgba(124,58,237,0.35), rgba(124,58,237,0) 60%);
          animation: aurora-drift 22s ease-in-out infinite alternate;
        }
        .aurora-blob--b {
          left: auto;
          right: 8%;
          top: 30%;
          width: 52vmin;
          height: 52vmin;
          background: radial-gradient(circle at 50% 50%, rgba(56,189,248,0.30), rgba(56,189,248,0) 60%);
          animation-duration: 26s;
        }
        .aurora-blob--c {
          left: 18%;
          bottom: 8%;
          top: auto;
          width: 48vmin;
          height: 48vmin;
          background: radial-gradient(circle at 50% 50%, rgba(234,179,8,0.24), rgba(234,179,8,0) 60%);
          animation-duration: 28s;
        }
        @keyframes aurora-drift {
          0% { transform: translate3d(-6%, -4%, 0) scale(1.05); opacity: .65; }
          50% { transform: translate3d(4%, 6%, 0) scale(1.0); opacity: .55; }
          100% { transform: translate3d(8%, -2%, 0) scale(1.08); opacity: .6; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none; }
        }
      `}</style>
        </div>
    );
}
