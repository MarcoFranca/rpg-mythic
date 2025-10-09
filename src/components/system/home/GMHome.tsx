"use client";

import { Users, Shield, Boxes, BookOpen, Wand2 } from "lucide-react";
import { FeatureGrid, FeatureTile } from "../widgets/Tiles";

export type GMHomeProps = {
    counts: { myTables: number };
};

export default function GMHome({ counts }: GMHomeProps) {
    return (
        <FeatureGrid>
            <FeatureTile
                title="Minhas Mesas"
                description="Crie e conduza mesas, convide jogadores."
                href="/app/gm/tables"
                kpi={`${counts.myTables}`}
                icon={<Users className="h-4 w-4" />}
                accent="violet"
                cta="Criar Mesa"
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
                icon={<Wand2 className="h-4 w-4" />}
            />
            <FeatureTile
                title="Relíquias & Itens"
                description="Crie ou aprove itens para o mundo."
                href="/app/gm/items"
                icon={<Boxes className="h-4 w-4" />}
            />
            <FeatureTile
                title="Grimório (Homebrew)"
                description="Magias originais e aprovações."
                href="/app/gm/grimoire"
                icon={<BookOpen className="h-4 w-4" />}
            />
        </FeatureGrid>
    );
}
