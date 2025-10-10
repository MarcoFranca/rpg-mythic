"use client";

import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";
import { SigilProgress } from "./widgets/SigilProgress";
import WelcomeToastOnce from "@/components/system/WelcomeToastOnce";
import { thresholdForTrack } from "@/lib/roles/sigils";
import { SystemHeader } from "./SystemHeader";

import PlayerHome from "./home/PlayerHome";
import GMHome from "./home/GMHome";
import SpectatorHome from "./home/SpectatorHome";

import { EterProvider, useEter } from "@/lib/eter/state";
import EterSky from "@/components/visual/EterSky";
import GoldenDust from "@/components/visual/GoldenDust";

export type Role = "PLAYER" | "GM" | "SPECTATOR";
export type Track = "PLAYER" | "GM" | null;

export interface UserHomeInfo {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: Role;
    track: Track;
    sigils: number;
    counts: { myTables: number; myMemberships: number };
    campaigns?: { id: string; name: string; status: "ativa" | "pausada" | "convidado"; href: string }[];
}

/** Componente casca: garante que tudo abaixo está dentro do provider */
export default function SystemHome({ user }: { user: UserHomeInfo }) {
    return (
        <EterProvider>
            <SystemHomeInner user={user} />
        </EterProvider>
    );
}

/** Parte que usa o contexto (seguro, pois está dentro do provider) */
function SystemHomeInner({ user }: { user: UserHomeInfo }) {
    const { idg } = useEter();

    const trackThreshold = user.track ? thresholdForTrack(user.track) : undefined;
    const canReturn =
        user.role === "SPECTATOR" &&
        !!user.track &&
        user.sigils >= (trackThreshold ?? Number.POSITIVE_INFINITY);

    return (
        <main className="relative min-h-[100dvh] overflow-hidden bg-black text-white">
            {/* Vídeo + anel do Éter, sensível ao IDG */}
            <EterSky
                idg={idg}
                video={{src: "/videos/eclipse-azul.mp4", poster: "/videos/eclipse-azul-poster.png"}}
                opacity={0.92}
                darken={0.42}
                blur={0.5}
                zIndex={5}
                ringSizeVmin={120}
                ringCenter={{x: "62%", y: "58%"}}   // empurra pra direita/baixo do título
                ringSoftness={0.9}
            />
            <div
                aria-hidden
                className="absolute inset-0 z-6"
                style={{
                    background:
                        "radial-gradient(600px 360px at 38% 48%, rgba(5,8,12,0.55) 0%, rgba(5,8,12,0.35) 65%, transparent 80%)",
                    backdropFilter: "blur(2px)",
                }}
            />

            <GoldenDust
                density={0.00027}    // ajuste fino
                speed={0.55}
                intensity={5.9}
                hue={46}             // âmbar→ouro
                zIndex={8}
            />
            {/* Aura de fundo guiada pelo IDG */}
            <BackgroundAura idg={idg}/>

            <ObeliskRingGlow sizeVmin={70} opacity={0.25} anchor="viewport" strength={0.012}/>

            {/* Header */}
            <section className="relative z-15 px-6 pt-6">
                <div className="mx-auto max-w-6xl">
                    <SystemHeader
                        name={user.name}
                        email={user.email}
                        image={user.image}
                        role={user.role}
                    />

                </div>
            </section>

            {/* Conteúdo por papel */}
            <section className="relative z-10 px-6 py-8">
                <div className="mx-auto max-w-6xl">
                    {user.role === "PLAYER" && (
                        <PlayerHome
                            counts={{myMemberships: user.counts.myMemberships}}
                            campaigns={user.campaigns ?? []}
                            userName={user.name}
                        />
                    )}
                    {user.role === "GM" && <GMHome counts={{myTables: user.counts.myTables}}/>}
                    {user.role === "SPECTATOR" && <SpectatorHome sigils={user.sigils}/>}
                </div>
            </section>

            <WelcomeToastOnce role={user.role} name={user.name}/>
        </main>
    );
}

/** Gradiente que varia com o IDG — sem usar o contexto diretamente */
function BackgroundAura({idg}: { idg: number }) {
    const bgForIDG = (v: number) => {
        if (v < 33)
            return "bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.12),transparent_55%)]";
        if (v < 66)
            return "bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.10),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(34,197,94,0.10),transparent_55%)]";
        return "bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.10),transparent_55%)]";
    };

    return (
        <div className={`absolute inset-0 z-5 ${bgForIDG(idg)}`}>
            <div
                className="absolute inset-0 mix-blend-screen opacity-30"
                style={{ backgroundImage: "url('/noise.png')" }}
            />
        </div>
    );
}
