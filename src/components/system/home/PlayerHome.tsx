"use client";

import { Users, Sword, Boxes, BookOpen, CalendarCheck2, Sparkles } from "lucide-react";
import { FeatureGrid, FeatureTile } from "../widgets/Tiles";

export type PlayerHomeProps = {
    counts: { myMemberships: number };
};

export default function PlayerHome({ counts }: PlayerHomeProps) {
    return (
        <FeatureGrid>
            <FeatureTile
                title="Minhas Campanhas"
                description="Gerencie presença e acompanhe o Cântico em jogo."
                href="/app/campaigns"
                kpi={`${counts.myMemberships}`}
                icon={<Users className="h-4 w-4" />}
            />
            <FeatureTile
                title="Personagens"
                description="Forje histórias: atributos, magias e destinos."
                href="/app/characters"
                icon={<Sword className="h-4 w-4" />}
                accent="emerald"
                cta="Criar Personagem"
            />
            <FeatureTile
                title="Grimório"
                description="Magias, rituais e o fluxo do Éter."
                href="/app/grimoire"
                icon={<BookOpen className="h-4 w-4" />}
            />
            <FeatureTile
                title="Inventário & Relíquias"
                description="Armas, armaduras e artefatos míticos."
                href="/app/inventory"
                icon={<Boxes className="h-4 w-4" />}
            />
            <FeatureTile
                title="Agenda"
                description="Suas próximas sessões."
                href="/app/schedule"
                icon={<CalendarCheck2 className="h-4 w-4" />}
            />
            <FeatureTile
                title="Hall da Taverna"
                description="Mensagens e feitos recentes das suas mesas."
                href="/app/hall"
                icon={<Sparkles className="h-4 w-4" />}
            />
        </FeatureGrid>
    );
}
