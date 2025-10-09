"use client";

import Image from "next/image";
import { Sword, Shield, Eye, Settings, Users, BookOpen, Boxes } from "lucide-react";
import PortalEterBackground from "@/components/marketing/PortalEterBackground";
import ObeliskRingGlow from "@/components/marketing/ObeliskRingGlow";
import { SigilProgress } from "./widgets/SigilProgress";
import { FeatureGrid, FeatureTile } from "./widgets/Tiles";
import WelcomeToastOnce from "@/components/system/WelcomeToastOnce";
import { thresholdForTrack } from "@/lib/roles/sigils"; // mesmo helper que usamos no backend

type Role = "PLAYER" | "GM" | "SPECTATOR";
type Track = "PLAYER" | "GM" | null;

export default function SystemHome(props: {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        role: Role;
        track: Track;
        sigils: number;
        counts: { myTables: number; myMemberships: number };
    };
}) {
    const { user } = props;

    // meta visual comum
    const headerIcon = user.role === "GM" ? <Shield className="h-5 w-5" /> :
        user.role === "SPECTATOR" ? <Eye className="h-5 w-5" /> :
            <Sword className="h-5 w-5" />;

    const trackThreshold = user.track ? thresholdForTrack(user.track) : undefined;
    const canReturn = user.role === "SPECTATOR" && !!user.track && user.sigils >= (trackThreshold ?? 999);

    return (
        <main className="relative min-h-[100dvh] bg-black text-white overflow-hidden">
            <PortalEterBackground src="/videos/anel-eter.mp4" poster="/videos/anel-eter-poster.jpg" opacity={0.6} />
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.10),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_55%)]" />
                <div className="absolute inset-0 mix-blend-screen opacity-30" style={{ backgroundImage: "url('/noise.png')" }} />
            </div>

            {/* saudação + “selo” */}
            <section className="relative z-10 px-6 pt-10">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-2">{headerIcon}</div>
                        <h1 className="text-xl font-semibold">
                            {user.role === "GM" ? "Salão do Mestre" :
                                user.role === "SPECTATOR" ? "Galeria do Observador" :
                                    "Salão do Aventureiro"}
                        </h1>
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/10">
                            {user.image ? (
                                <Image alt={user.name} src={user.image} fill className="object-cover" />
                            ) : (
                                <div className="grid h-full w-full place-items-center text-white/60">{user.name.at(0)}</div>
                            )}
                        </div>
                        <div>
                            <div className="text-white/90 text-sm">
                                {user.role === "GM" ? `Mestre ${user.name}` :
                                    user.role === "SPECTATOR" ? `Viajante ${user.name}` :
                                        `Aventureiro ${user.name}`}
                            </div>
                            <div className="text-xs text-white/60">{user.email}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* obelisco glow */}
            <ObeliskRingGlow sizeVmin={70} opacity={0.25} anchor="viewport" strength={0.012} />

            {/* barra de progresso de Sígilos */}
            <section className="relative z-10 px-6 mt-6">
                <div className="mx-auto max-w-6xl">
                    <SigilProgress
                        sigils={user.sigils}
                        role={user.role}
                        track={user.track}
                    />
                    {canReturn && (
                        <div className="mt-2 text-xs text-emerald-300/90">
                            Você possui Sígilos suficientes para retornar à sua trilha. Procure o botão “Retornar” nas áreas pertinentes.
                        </div>
                    )}
                </div>
            </section>

            {/* grade de features: muda por papel, mas mesma linguagem visual */}
            <section className="relative z-10 px-6 py-8">
                <div className="mx-auto max-w-6xl">
                    {user.role === "GM" && <GMView user={user} />}
                    {user.role === "PLAYER" && <PlayerView user={user} />}
                    {user.role === "SPECTATOR" && <SpectatorView user={user} />}
                </div>
            </section>

            {/* toast de boas-vindas contextual (já com som + visual mágico) */}
            <WelcomeToastOnce role={user.role} name={user.name} />
        </main>
    );
}

/* ---------- Sub-views ---------- */

function PlayerView({ user }: { user: any }) {
    return (
        <FeatureGrid>
            <FeatureTile
                title="Minhas Campanhas"
                description="Entre, gerencie presença e acompanhe o Cântico em jogo."
                href="/app/campaigns"
                kpi={`${user.counts.myMemberships}`}
                icon={<Users className="h-4 w-4" />}
            />
            <FeatureTile
                title="Personagens"
                description="Forje histórias: atributos, magias e destinos."
                href="/app/characters"
                icon={<Sword className="h-4 w-4" />}
                accent="emerald"
            />
            <FeatureTile
                title="Inventário & Relíquias"
                description="Armas, armaduras e artefatos míticos."
                href="/app/inventory"
                icon={<Boxes className="h-4 w-4" />}
            />
            <FeatureTile
                title="Grimório"
                description="Magias, rituais e o fluxo do Éter."
                href="/app/grimoire"
                icon={<BookOpen className="h-4 w-4" />}
            />
        </FeatureGrid>
    );
}

function GMView({ user }: { user: any }) {
    return (
        <FeatureGrid>
            <FeatureTile
                title="Minhas Mesas"
                description="Crie e conduza mesas, convide jogadores."
                href="/app/gm/tables"
                kpi={`${user.counts.myTables}`}
                icon={<Users className="h-4 w-4" />}
                accent="violet"
            />
            <FeatureTile
                title="Bestiário & NPCs"
                description="Feras, entidades e figuras do mito."
                href="/app/gm/bestiary"
                icon={<Shield className="h-4 w-4" />}
            />
            <FeatureTile
                title="Preparação"
                description="Cenas, trilhas sonoras, encontros."
                href="/app/gm/prep"
                icon={<Settings className="h-4 w-4" />}
            />
            <FeatureTile
                title="Relíquias & Itens"
                description="Crie ou aprove itens para o mundo."
                href="/app/gm/items"
                icon={<Boxes className="h-4 w-4" />}
            />
        </FeatureGrid>
    );
}

function SpectatorView({ user }: { user: any }) {
    // se não tem trilha definida ainda, exibimos CTA para escolher ao atingir limiar
    const canPickPlayer = user.sigils >= 5;
    const canPickGM = user.sigils >= 8;

    return (
        <>
            <div className="mb-4 text-sm text-white/80">
                Você é um Observador. Algumas áreas estão desabilitadas, mas o Cântico sempre canta — ganhe Sígilos para abrir novos caminhos.
            </div>
            <FeatureGrid>
                <FeatureTile
                    title="Campanhas"
                    description="Acompanhe campanhas como espectador."
                    href="/app/campaigns"
                    icon={<Eye className="h-4 w-4" />}
                />
                <FeatureTile
                    title="Tornar-se Jogador"
                    description="Requer 5 Sígilos."
                    href={canPickPlayer ? "/app/ascend?track=PLAYER" : undefined}
                    icon={<Sword className="h-4 w-4" />}
                    disabled={!canPickPlayer}
                    accent="emerald"
                    cta={canPickPlayer ? "Ascender" : undefined}
                />
                <FeatureTile
                    title="Tornar-se Mestre"
                    description="Requer 8 Sígilos."
                    href={canPickGM ? "/app/ascend?track=GM" : undefined}
                    icon={<Shield className="h-4 w-4" />}
                    disabled={!canPickGM}
                    accent="violet"
                    cta={canPickGM ? "Ascender" : undefined}
                />
                <FeatureTile
                    title="Relíquias & Lore"
                    description="Explore o mundo de Eldoryon."
                    href="/app/lore"
                    icon={<BookOpen className="h-4 w-4" />}
                />
            </FeatureGrid>
        </>
    );
}
