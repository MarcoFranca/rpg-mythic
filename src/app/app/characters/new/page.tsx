// src/app/(characters)/new/page.tsx
"use client";
import { useMemo, useState, useCallback } from "react";
import PlayerBookLayout from "@/components/character/PlayerBookLayout";
import BookNav, { BookChapter } from "@/components/character/BookNav";
import IdentityChapter, { type IdentityData } from "@/components/character/chapters/IdentityChapter";
import ClassChapter from "@/components/character/chapters/ClassChapter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    User, Shield, Trees, ScrollText, Star, Sword, Backpack,
    FlameKindling, HeartHandshake, Sparkles
} from "lucide-react";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import { api } from "@/trpc/react";
import PapyrusIcon from "@/assets/icons/papyrus.svg";
import AncestryIcon from "@/assets/icons/ancestry.svg";
import IdentityIcon from "@/assets/icons/identity.svg";

type WizardState = {
    draftId?: string;
    identity: IdentityData | null;
    classId?: string;
    ancestryId?: string;
    // (ganchos para próximos passos)
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

    // regras de gating (dependências simples)
    const canGoClass = !!wiz.identity?.name?.trim();
    const canGoAncestry = !!wiz.classId;
    const canGoBackground = !!wiz.ancestryId;
    const canGoAttributes = !!wiz.backgroundId;
    const canGoProfs = !!wiz.attributesDone;
    const canGoEquipment = !!wiz.profsDone;
    const canGoSpells = !!wiz.equipmentDone;      // só se for conjurador, você pode condicionar pela classe
    const canGoFaith = !!wiz.spellsDone || !!wiz.equipmentDone;
    const canGoReview = !!wiz.faithDone;
// ex.: src/assets/icons/sword.svg  (ícone preto padrão)

// no capítulo:

    // lista de capítulos na ordem recomendada
    const chapters: BookChapter[] = [
    // { id: "profs", title: "Perícias", description: "Escolhas finas", icon: (p) => <PapyrusIcon className={cn("h-4 w-4 text-white/80", p?.className)} /> },
        { id: "identity",   title: "Identidade",       description: "Nome & conceito",     icon: IdentityIcon,    completed: !!wiz.identity?.name,},
        { id: "class",      title: "Classe",           description: "Papel & estilo",      icon: PapyrusIcon,     completed: !!wiz.classId,        disabled: !canGoClass },
        { id: "ancestry",   title: "Ancestralidade",   description: "Origens & traços",    icon: AncestryIcon,    completed: !!wiz.ancestryId,     disabled: !canGoAncestry },
        { id: "background", title: "Antecedente",      description: "História & perícias", icon: ScrollText,      completed: !!wiz.backgroundId,   disabled: !canGoBackground },
        { id: "attributes", title: "Atributos",        description: "Força do sopro",      icon: Star,            completed: !!wiz.attributesDone, disabled: !canGoAttributes },
        { id: "profs",      title: "Perícias & Prof.", description: "Escolhas finas",      icon: Sword,           completed: !!wiz.profsDone,      disabled: !canGoProfs },
        { id: "equipment",  title: "Equipamento",      description: "Kit inicial",         icon: Backpack,        completed: !!wiz.equipmentDone,  disabled: !canGoEquipment },
        { id: "spells",     title: "Magias",           description: "Canalizar o Éter",    icon: FlameKindling,   completed: !!wiz.spellsDone,     disabled: !canGoSpells },
        { id: "faith",      title: "Fé & Éter",        description: "Ressonâncias",        icon: HeartHandshake,  completed: !!wiz.faithDone,      disabled: !canGoFaith },
        { id: "review",     title: "Revisão & Cântico",description: "Snapshot final",      icon: Sparkles,        completed: false,                disabled: !canGoReview },
    ];

    const completedMap = useMemo(() => new Set(chapters.filter(c => c.completed).map(c => c.id)), [chapters]);

    const identityBadge = wiz.identity?.name ? (
        <Badge variant="secondary">{wiz.identity.name}</Badge>
    ) : null;

    // checagem de nome (para o capítulo Identidade)
    const checkNameAvailability = useCallback(
        (name: string) => utils.name.check.fetch({ name }),
        [utils]
    );


    return (
        <PlayerBookLayout
            title="Livro do Jogador – Criação"
            subtitle="“Tudo o que é criado deve cantar.”"
            sidebar={
                <BookNav
                    chapters={chapters}
                    currentId={current}
                    onSelect={(id) => {
                        // impõe gating também aqui
                        const target = chapters.find(c => c.id === id);
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

                {/* ——— CAPÍTULOS ——— */}
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
                        selectedClassId={wiz.classId}
                        onSelect={(c: ClassSummaryT) => {
                            setWiz((prev) => ({ ...prev, classId: c.id }));
                            setCurrent("ancestry"); // avança automaticamente
                        }}
                    />
                )}

                {/* placeholders para os próximos capítulos — conecte seus componentes quando estiverem prontos */}
                {current === "ancestry" && (
                    <div className="text-sm text-white/80">
                        (Ancestralidade aqui) — ao concluir, chame setWiz({"{ ...prev, ancestryId: '...' }"}) e setCurrent("background").
                    </div>
                )}

                {current !== "identity" && current !== "class" && current !== "ancestry" && (
                    <div className="text-sm text-white/70">
                        Este capítulo (“{current}”) ainda será ativado. Siga a ordem para desbloquear:
                        <Button variant="link" className="px-1" onClick={() => setCurrent(chapters.find(c => !c.disabled)?.id ?? "identity")}>
                            ir ao próximo disponível
                        </Button>
                    </div>
                )}
            </div>
        </PlayerBookLayout>
    );
}
