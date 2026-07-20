"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PlayerBookLayout from "@/components/character/PlayerBookLayout";
import BookNav, { type BookChapter } from "@/components/character/BookNav";
import IdentityChapter, { type IdentityData } from "@/components/character/chapters/IdentityChapter";
import ClassChapter from "@/components/character/chapters/ClassChapter";
import CatalogChoiceChapter from "@/components/character/chapters/CatalogChoiceChapter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";

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

function classFromDraft(value: unknown) {
    if (!Array.isArray(value) || !value[0] || typeof value[0] !== "object") return {};
    const entry = value[0] as Record<string, unknown>;
    return {
        classId: typeof entry.classId === "string" ? entry.classId : undefined,
        subclassId: typeof entry.subclassId === "string" ? entry.subclassId : undefined,
    };
}

function creationData(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const creation = "creation" in value ? value.creation : null;
    return creation && typeof creation === "object" && !Array.isArray(creation)
        ? creation as Record<string, unknown>
        : {};
}

export default function NewCharacterPage() {
    const utils = api.useUtils();
    const [current, setCurrent] = useState("identity");
    const [wiz, setWiz] = useState<WizardState>({ identity: null });
    const hydrated = useRef(false);

    const { data: draft } = api.characterCreate.getCurrentDraft.useQuery();
    const { data: ancestries = [] } = api.catalog.characterOptions.listAncestries.useQuery();
    const { data: backgrounds = [] } = api.catalog.characterOptions.listBackgrounds.useQuery();
    const createDraft = api.characterCreate.createDraft.useMutation();
    const saveIdentity = api.characterCreate.saveIdentity.useMutation();
    const saveClass = api.characterCreate.saveClass.useMutation();
    const saveAncestry = api.characterCreate.saveAncestry.useMutation();
    const saveBackground = api.characterCreate.saveBackground.useMutation();

    useEffect(() => {
        if (!draft || hydrated.current) return;
        hydrated.current = true;
        const savedClass = classFromDraft(draft.classes);
        const creation = creationData(draft.metadata);
        setWiz({
            draftId: draft.id,
            identity: draft.name === "Eco sem Nome" ? null : {
                name: draft.name,
                epithet: draft.title ?? "",
                concept: typeof creation.concept === "string" ? creation.concept : draft.title ?? "",
                tone: typeof creation.tone === "string" ? creation.tone as IdentityData["tone"] : "",
                pronoun: draft.pronoun === "ele" || draft.pronoun === "ela" ? draft.pronoun : "",
            },
            ancestryId: creation.ancestryConfirmed === true ? draft.ancestryId : undefined,
            backgroundId: creation.backgroundConfirmed === true ? draft.backgroundId ?? undefined : undefined,
            ...savedClass,
        });
    }, [draft]);

    const canGoClass = !!wiz.identity?.name?.trim();
    const canGoAncestry = !!wiz.classId;
    const canGoBackground = !!wiz.ancestryId;
    const canGoAttributes = !!wiz.backgroundId;
    const canGoProfs = !!wiz.attributesDone;
    const canGoEquipment = !!wiz.profsDone;
    const canGoSpells = !!wiz.equipmentDone;
    const canGoFaith = !!wiz.spellsDone || !!wiz.equipmentDone;
    const canGoReview = !!wiz.faithDone;

    const chapters: BookChapter[] = useMemo(() => [
        { id: "identity", title: "Identidade", description: "Nome & conceito", icon: IdentityIcon, completed: !!wiz.identity?.name },
        { id: "class", title: "Classe", description: "Papel & estilo", icon: ClassIcon, completed: !!wiz.classId, disabled: !canGoClass },
        { id: "ancestry", title: "Ancestralidade", description: "Origens & traços", icon: AncestryIcon, completed: !!wiz.ancestryId, disabled: !canGoAncestry },
        { id: "background", title: "Antecedente", description: "História & perícias", icon: BackgroundIcon, completed: !!wiz.backgroundId, disabled: !canGoBackground },
        { id: "attributes", title: "Atributos", description: "Força do sopro", icon: AttributesIcon, completed: !!wiz.attributesDone, disabled: !canGoAttributes },
        { id: "profs", title: "Perícias & Prof.", description: "Escolhas finas", icon: ProfsIcon, completed: !!wiz.profsDone, disabled: !canGoProfs },
        { id: "equipment", title: "Equipamento", description: "Kit inicial", icon: EquipmentIcon, completed: !!wiz.equipmentDone, disabled: !canGoEquipment },
        { id: "spells", title: "Magias", description: "Canalizar o Éter", icon: SpellsIcon, completed: !!wiz.spellsDone, disabled: !canGoSpells },
        { id: "faith", title: "Fé & Éter", description: "Ressonâncias", icon: FaithIcon, completed: !!wiz.faithDone, disabled: !canGoFaith },
        { id: "review", title: "Revisão & Cântico", description: "Snapshot final", icon: ReviewIcon, completed: false, disabled: !canGoReview },
    ], [canGoAncestry, canGoAttributes, canGoBackground, canGoClass, canGoEquipment, canGoFaith, canGoProfs, canGoReview, canGoSpells, wiz]);

    const checkNameAvailability = useCallback((name: string) => utils.name.check.fetch({ name }), [utils]);

    const ensureDraft = useCallback(async () => {
        if (wiz.draftId) return wiz.draftId;
        const created = await createDraft.mutateAsync();
        setWiz((previous) => ({ ...previous, draftId: created.id }));
        await utils.characterCreate.getCurrentDraft.invalidate();
        return created.id;
    }, [createDraft, utils.characterCreate.getCurrentDraft, wiz.draftId]);

    const continueIdentity = useCallback(async () => {
        if (!wiz.identity?.name.trim()) return;
        const id = await ensureDraft();
        await saveIdentity.mutateAsync({ id, data: { name: wiz.identity.name, epithet: wiz.identity.epithet || undefined, concept: wiz.identity.concept || undefined, tone: wiz.identity.tone || undefined, pronoun: wiz.identity.pronoun || undefined } });
        setCurrent("class");
    }, [ensureDraft, saveIdentity, wiz.identity]);

    const autosaveIdentity = useCallback(async (identity: IdentityData) => {
        if (!identity.name.trim()) return;
        const id = await ensureDraft();
        await saveIdentity.mutateAsync({ id, data: { name: identity.name, epithet: identity.epithet || undefined, concept: identity.concept || undefined, tone: identity.tone || undefined, pronoun: identity.pronoun || undefined } });
    }, [ensureDraft, saveIdentity]);

    const continueClass = useCallback(async (classId: string, subclassId?: string) => {
        const id = await ensureDraft();
        await saveClass.mutateAsync({ id, classId, subclassId });
        setWiz((previous) => ({ ...previous, classId, subclassId }));
        setCurrent("ancestry");
    }, [ensureDraft, saveClass]);

    const continueAncestry = useCallback(async () => {
        if (!wiz.ancestryId) return;
        await saveAncestry.mutateAsync({ id: await ensureDraft(), ancestryId: wiz.ancestryId });
        setCurrent("background");
    }, [ensureDraft, saveAncestry, wiz.ancestryId]);

    const continueBackground = useCallback(async () => {
        if (!wiz.backgroundId) return;
        await saveBackground.mutateAsync({ id: await ensureDraft(), backgroundId: wiz.backgroundId });
        setCurrent("attributes");
    }, [ensureDraft, saveBackground, wiz.backgroundId]);

    return (
        <PlayerBookLayout
            title="Livro do Jogador – Criação"
            subtitle="&quot;Tudo o que é criado deve cantar.&quot;"
            sidebar={<BookNav chapters={chapters} currentId={current} onSelect={(id) => { const chapter = chapters.find((item) => item.id === id); if (chapter && !chapter.disabled) setCurrent(id); }} />}
        >
            <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                    {wiz.identity?.name && <Badge variant="secondary">{wiz.identity.name}</Badge>}
                    {wiz.classId && <Badge variant="outline">Classe definida</Badge>}
                    {wiz.draftId && <span className="text-xs text-emerald-200/70">Rascunho guardado no Éter</span>}
                </div>
                <Separator className="bg-white/10" />

                {current === "identity" && <IdentityChapter value={wiz.identity} onChange={(identity) => setWiz((previous) => ({ ...previous, identity }))} onAutosave={autosaveIdentity} isSaving={createDraft.isPending || saveIdentity.isPending} onContinue={() => void continueIdentity()} checkNameAvailability={checkNameAvailability} allowDuplicateNames />}
                {current === "class" && <ClassChapter initialSelectedClassId={wiz.classId} initialSelectedSubclassId={wiz.subclassId} onConfirm={(classId, subclassId) => void continueClass(classId, subclassId)} />}
                {current === "ancestry" && <CatalogChoiceChapter title="Escolha tua Ancestralidade" description="A origem grava traços, idiomas e a primeira ressonância do teu Eco no mundo." selectedId={wiz.ancestryId} onSelect={(ancestryId) => setWiz((previous) => ({ ...previous, ancestryId }))} onContinue={() => void continueAncestry()} continueLabel="Confirmar ancestralidade" isSaving={saveAncestry.isPending} choices={ancestries.map((ancestry) => ({ id: ancestry.id, name: ancestry.name, description: ancestry.lore, badges: ancestry.bonuses, details: [{ label: "Movimento", text: `${ancestry.speed} m` }, { label: "Idiomas", text: ancestry.languages.join(", ") }, ...ancestry.traits.map((trait) => ({ label: trait.name, text: trait.description }))] }))} />}
                {current === "background" && <CatalogChoiceChapter title="Escolha teu Antecedente" description="O antecedente revela o que teu personagem aprendeu antes de responder ao chamado de Eldoryon." selectedId={wiz.backgroundId} onSelect={(backgroundId) => setWiz((previous) => ({ ...previous, backgroundId }))} onContinue={() => void continueBackground()} continueLabel="Confirmar antecedente" isSaving={saveBackground.isPending} choices={backgrounds.map((background) => ({ id: background.id, name: background.name, description: "Uma marca do passado que orienta teus conhecimentos e recursos iniciais.", badges: background.skills, details: background.equipment.length ? [{ label: "Equipamento", text: background.equipment.join(", ") }] : [] }))} />}

                {current !== "identity" && current !== "class" && current !== "ancestry" && current !== "background" && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-sm leading-6 text-white/70">
                        Este capítulo será o próximo rito do Livro. Teu progresso já está salvo; conclua as escolhas anteriores para continuar.
                        <Button variant="link" className="ml-1 px-1" onClick={() => setCurrent(chapters.find((chapter) => !chapter.disabled)?.id ?? "identity")}>Voltar ao próximo rito</Button>
                    </div>
                )}
            </div>
        </PlayerBookLayout>
    );
}
