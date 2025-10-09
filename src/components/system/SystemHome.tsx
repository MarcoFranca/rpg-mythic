"use client";

import PortalEterBackground from "@/components/marketing/PortalEterBackground";
import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";
import { SigilProgress } from "./widgets/SigilProgress";
import WelcomeToastOnce from "@/components/system/WelcomeToastOnce";
import { thresholdForTrack } from "@/lib/roles/sigils";
import { SystemHeader } from "./SystemHeader";

import PlayerHome from "./home/PlayerHome";
import GMHome from "./home/GMHome";
import SpectatorHome from "./home/SpectatorHome";

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
    counts: {
        myTables: number;
        myMemberships: number;
    };
}

export default function SystemHome({ user }: { user: UserHomeInfo }) {
    const trackThreshold = user.track ? thresholdForTrack(user.track) : undefined;
    const canReturn =
        user.role === "SPECTATOR" &&
        !!user.track &&
        user.sigils >= (trackThreshold ?? Number.POSITIVE_INFINITY);

    return (
        <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.jpg" opacity={0.6} />
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.10),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_55%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* header */}
            <section className="relative z-10 px-6 pt-10">
                <div className="mx-auto max-w-6xl">
                    <SystemHeader name={user.name} email={user.email} image={user.image} role={user.role} />
                </div>
            </section>

            <ObeliskRingGlow sizeVmin={70} opacity={0.25} anchor="viewport" strength={0.012} />

            {/* progresso / sigils */}
            <section className="relative z-10 px-6 mt-6">
                <div className="mx-auto max-w-6xl">
                    <SigilProgress sigils={user.sigils} role={user.role} track={user.track} />
                    {canReturn && (
                        <div className="mt-2 text-xs text-emerald-300/90">
                            Você possui Sígilos suficientes para retornar à sua trilha. Procure o botão “Retornar” nas áreas pertinentes.
                        </div>
                    )}
                </div>
            </section>

            {/* conteúdo por papel */}
            <section className="relative z-10 px-6 py-8">
                <div className="mx-auto max-w-6xl">
                    {user.role === "PLAYER" && <PlayerHome counts={{ myMemberships: user.counts.myMemberships }} />}
                    {user.role === "GM" && <GMHome counts={{ myTables: user.counts.myTables }} />}
                    {user.role === "SPECTATOR" && <SpectatorHome sigils={user.sigils} />}
                </div>
            </section>

            <WelcomeToastOnce role={user.role} name={user.name} />
        </main>
    );
}
