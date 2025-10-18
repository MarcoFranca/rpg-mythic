// src/app/(characters)/new/page.tsx
"use client";
import { useMemo, useState, useCallback } from "react";
import PlayerBookLayout from "@/components/character/PlayerBookLayout";
import BookNav, { type BookChapter } from "@/components/character/BookNav";
import IdentityChapter, { type IdentityData } from "@/components/character/chapters/IdentityChapter";
import ClassChapter from "@/components/character/chapters/ClassChapter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import { api } from "@/trpc/react";

// SVGR (componentes React)
import ClassIcon from "@/assets/icons/class.png";
import AncestryIcon from "@/assets/icons/ancestry.png";
import IdentityIcon from "@/assets/icons/identity.png";
import BackgroundIcon from "@/assets/icons/background.png";
import AttributesIcon from "@/assets/icons/attributes.png";
import ProfsIcon from "@/assets/icons/profs.png";
import EquipmentIcon from "@/assets/icons/equipment.png";
import SpellsIcon from "@/assets/icons/spells4.png";
import FaithIcon from "@/assets/icons/faith2.png";
import ReviewIcon from "@/assets/icons/review.png";

type WizardState = {
    draftId?: string;
    identity: IdentityData | null;
    classId?: string;
    subclassId?: string;
    ancestryId?: string;
    backgroundId?: string;
    attributesDone?: boolean;
    profsDone?: boolean;
    equipmentDone?: boolean;
    spellsDone?: boolean;
    faithDone?: boolean;
};

export default function NewCharacterPage() {
    const utils = api.useUtils();
    const [current, setCurrent] = useState<string>("identity");
    const [wiz, setWiz] = useState<WizardState>({ identity: null });

    // gating simples
    const canGoClass = !!wiz.identity?.name?.trim();
    const canGoAncestry = !!wiz.classId;
    const canGoBackground = !!wiz.ancestryId;
    const canGoAttributes = !!wiz.backgroundId;
    const canGoProfs = !!wiz.attributesDone;
    const canGoEquipment = !!wiz.profsDone;
    const canGoSpells = !!wiz.equipmentDone;
    const canGoFaith = !!wiz.spellsDone || !!wiz.equipmentDone;
    const canGoReview = !!wiz.faithDone;

    // chapters memoizado (evita warning do react-hooks/exhaustive-deps)
    const chapters: BookChapter[] = useMemo(
        () => [
            { id: "identity",   title: "Identidade",       description: "Nome & conceito",     icon: IdentityIcon,   completed: !!wiz.identity?.name },
            { id: "class",      title: "Classe",           description: "Papel & estilo",      icon: ClassIcon,      completed: !!wiz.classId,        disabled: !canGoClass },
            { id: "ancestry",   title: "Ancestralidade",   description: "Origens & traços",    icon: AncestryIcon,   completed: !!wiz.ancestryId,     disabled: !canGoAncestry },
            { id: "background", title: "Antecedente",      description: "História & perícias", icon: BackgroundIcon,     completed: !!wiz.backgroundId,   disabled: !canGoBackground },
            { id: "attributes", title: "Atributos",        description: "Força do sopro",      icon: AttributesIcon,           completed: !!wiz.attributesDone, disabled: !canGoAttributes },
            { id: "profs",      title: "Perícias & Prof.", description: "Escolhas finas",      icon: ProfsIcon,          completed: !!wiz.profsDone,      disabled: !canGoProfs },
            { id: "equipment",  title: "Equipamento",      description: "Kit inicial",         icon: EquipmentIcon,       completed: !!wiz.equipmentDone,  disabled: !canGoEquipment },
            { id: "spells",     title: "Magias",           description: "Canalizar o Éter",    icon: SpellsIcon,  completed: !!wiz.spellsDone,     disabled: !canGoSpells },
            { id: "faith",      title: "Fé & Éter",        description: "Ressonâncias",        icon: FaithIcon, completed: !!wiz.faithDone,      disabled: !canGoFaith },
            { id: "review",     title: "Revisão & Cântico",description: "Snapshot final",      icon: ReviewIcon,       completed: false,                disabled: !canGoReview },
        ],
        [
            wiz.identity?.name, wiz.classId, wiz.ancestryId, wiz.backgroundId,
            wiz.attributesDone, wiz.profsDone, wiz.equipmentDone, wiz.spellsDone, wiz.faithDone,
            canGoClass, canGoAncestry, canGoBackground, canGoAttributes, canGoProfs, canGoEquipment, canGoSpells, canGoFaith, canGoReview
        ]
    );

    // checagem de nome (passa pro capítulo)
    const checkNameAvailability = useCallback(
        (name: string) => utils.name.check.fetch({ name }),
        [utils]
    );

    const identityBadge = wiz.identity?.name ? <Badge variant="secondary">{wiz.identity.name}</Badge> : null;

    return (
        <PlayerBookLayout
            title="Livro do Jogador – Criação"
            // escapa aspas para evitar react/no-unescaped-entities
            subtitle="&quot;Tudo o que é criado deve cantar.&quot;"
            sidebar={
                <BookNav
                    chapters={chapters}
                    currentId={current}
                    onSelect={(id) => {
                        const target = chapters.find((c) => c.id === id);
                        if (!target || target.disabled) return;
                        setCurrent(id);
                    }}
                />
            }
        >
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    {identityBadge}
                    {wiz.classId && <Badge variant="outline">Classe definida</Badge>}
                </div>

                <Separator className="bg-white/10" />

                {current === "identity" && (
                    <IdentityChapter
                        value={wiz.identity}
                        onChange={(val) => setWiz((p) => ({ ...p, identity: val }))}
                        onContinue={() => setCurrent("class")}
                        checkNameAvailability={checkNameAvailability}
                        allowDuplicateNames={true}
                    />
                )}

                {current === "class" && (
                       <ClassChapter
                         initialSelectedClassId={wiz.classId}
                         initialSelectedSubclassId={wiz.subclassId}
                         onConfirm={(classId: string, subclassId?: string) => {
                           setWiz((prev) => ({ ...prev, classId, subclassId }));
                           setCurrent("ancestry");
                         }}
                       />
                     )}

                {current === "ancestry" && (
                    <div className="text-sm text-white/80">
                        (Ancestralidade aqui) — ao concluir, chame setWiz(
                        {"{ ...prev, ancestryId: '...' }"}) e setCurrent(&quot;background&quot;).
                    </div>
                )}

                {current !== "identity" && current !== "class" && current !== "ancestry" && (
                    <div className="text-sm text-white/70">
                        Este capítulo (<q>{current}</q>) ainda será ativado. Siga a ordem para desbloquear:
                        <Button
                            variant="link"
                            className="px-1"
                            onClick={() =>
                                setCurrent(chapters.find((c) => !c.disabled)?.id ?? "identity")
                            }
                        >
                            ir ao próximo disponível
                        </Button>
                        .
                    </div>
                )}
            </div>
        </PlayerBookLayout>
    );
}
