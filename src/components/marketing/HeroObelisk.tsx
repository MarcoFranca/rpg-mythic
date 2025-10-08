"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
    children: React.ReactNode;
};

export default function HeroObelisk({ children }: Props) {
    return (
        <section className="relative z-10 min-h-[72vh] md:min-h-[78vh] grid place-items-center overflow-hidden">
            {/* Fundo: constelações + gradiente do Éter */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.10),transparent_40%)]"/>
                <div className="absolute inset-0 mix-blend-screen opacity-35"
                     style={{backgroundImage: "url('/noise.png')"}}/>
            </div>

            {/* Obelisco (parallax leve + animações) */}
            <motion.div
                className="relative mx-auto m-8 h-[50vh] w-[50vh] max-w-[80vw] group overflow-visible isolation-isolate"
                animate={{y: [0, -16, 0]}}
                whileHover={{ rotateX: -2, rotateY: 2, scale: 1.015 }}
                transition={{duration: 6, repeat: Infinity, ease: "easeInOut"}}
            >

                {/* HALO (pulso forte, garantido via framer-motion) */}
                <motion.div
                    className={
                        "absolute z-0 rounded-full blur-3xl " +
                        "-inset-6 md:-inset-10 " +
                        "bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,.30),transparent_55%)," +
                        "radial-gradient(circle_at_60%_60%,rgba(251,191,36,.22),transparent_62%)," +
                        "radial-gradient(circle_at_40%_70%,rgba(232,121,249,.18),transparent_70%)]"
                    }
                    initial={{scale: 0.98, opacity: 0.55}}
                    animate={{scale: [1, 1.14, 1], opacity: [0.55, 0.95, 0.55]}}
                    transition={{duration: 4.8, repeat: Infinity, ease: "easeInOut"}}
                    style={{willChange: "transform,opacity", mixBlendMode: "screen"}}
                />

                {/* OBELISCO */}
                <Image
                    src="/mythic/obelisk.svg"
                    alt="Obelisco de Elyndor"
                    fill
                    priority
                    className="object-contain pointer-events-none select-none drop-shadow-[0_0_40px_rgba(34,211,238,0.25)] z-10"
                    style={{ mixBlendMode: "screen", filter: "saturate(1.05) brightness(1.02)" }}

                />

                {/* BRILHO descendo na aresta */}
                <div
                    className="pointer-events-none absolute inset-0 z-30"
                    style={{
                        background:
                            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)",
                        mixBlendMode: "screen",
                        maskImage:
                            "linear-gradient(90deg, transparent 49.5%, black 50%, transparent 50.5%)",
                        WebkitMaskImage:
                            "linear-gradient(90deg, transparent 49.5%, black 50%, transparent 50.5%)",
                        animation: "edgeSweep 4.2s cubic-bezier(.4,0,.2,1) infinite",
                    }}
                />


                {/* ANEL RÚNICO – gira e acelera no hover */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none z-20">
                    <div className="relative h-[102%] w-[102%] opacity-45">
                        {/* círculo sutil */}
                        <div className="absolute inset-0 z-10 rounded-full border border-white/15"/>
                        {/* sua imagem de runa ring girando */}
                        <Image
                            src="/mythic/rune-ring.png"        // use o path da sua runa
                            alt=""
                            fill
                            className="object-contain"
                            style={{animation: "ring-spin 60s linear infinite"}}
                            priority
                        />
                    </div>
                </div>

            </motion.div>


            {/* Névoas de Éter */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent"/>
            <div
                className="pointer-events-none absolute -left-24 bottom-8 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"/>
            <div
                className="pointer-events-none absolute -right-16 bottom-16 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl"/>

            {/* Conteúdo (headline, ctas etc.) */}
            <div className="relative z-10 px-6">{children}</div>
            <style jsx>{`
                @keyframes etherPulse {
                    0% {
                        transform: scale(1);
                        opacity: .75;
                    }
                    50% {
                        transform: scale(1.06);
                        opacity: .95;
                    }
                    100% {
                        transform: scale(1);
                        opacity: .75;
                    }
                }

                @keyframes edgeSweep {
                    0% { transform: translateY(-120%); }
                    100% { transform: translateY(120%); }
                }
                @keyframes ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                /* acessibilidade */
                @media (prefers-reduced-motion: reduce) {
                    :global(.group *), :global(.group) { animation: none !important; transition: none !important; }
                }
                
                /* acelera o anel no hover do bloco */
                :global(.group:hover) :global(img[style*="ring-spin"]) {
                    animation-duration: 18s !important;
                }

                /* util para o halo */
                :global(.animate-ether) {
                    animation: etherPulse 5.5s ease-in-out infinite;
                }
            `}</style>

        </section>
    );
}
