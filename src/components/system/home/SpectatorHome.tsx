"use client";

import { Eye, Sword, Shield, BookOpen } from "lucide-react";
import { FeatureGrid, FeatureTile } from "../widgets/Tiles";

export type SpectatorHomeProps = {
    sigils: number;
};

export default function SpectatorHome({ sigils }: SpectatorHomeProps) {
    const canPickPlayer = sigils >= 5;
    const canPickGM = sigils >= 8;

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
