"use client";

import Particles from "@/components/marketing/Particles";

export default function HeroDragon({ children }: { children: React.ReactNode }) {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-black">
            {/* vídeo do dragão */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end">
                <Particles />

                <video
                    className=" h-full object-contain opacity-25 bg-black"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/poster.jpg"
                    aria-hidden
                >
                    <source src="/dragon-1080.webm" type="video/webm" />
                    <source src="/dragon-1080.mp4" type="video/mp4" />
                </video>
                {/* fallback estático */}
                <img
                    src="/poster.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-auto object-contain opacity-20"
                />
            </div>

            {/* camadas de leitura */}
            <div className="absolute inset-0 z-5 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_65%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_65%)]" />
            <div className="absolute inset-0 z-5 bg-black/40" />

            {/* conteúdo da hero */}
            <div className="relative content-center h-[80vh] z-20 px-6 pt-2 items-center justify-center md:pb-24 max-w-7xl mx-auto">
                {children}
            </div>
        </section>
    );
}
