"use client";
import { useEffect, useMemo, useState } from "react";
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import type { ClassWithSubclassesVM } from "@/server/api/routers/catalog/_normalize-class";
import { cn } from "@/lib/utils";
import { SheetFrame } from "@/components/character/SheetFrame";
import { Dice6, HeartHandshake, Layers, Shield, Sparkles, Swords } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";

import { Section, InfoBlock, EmptyText, SkeletonLine, SkeletonBullets } from "./ui/Primitives";
import { LoreVM, normalizeLore } from "./lore/lore-vm";
import LoreCard from "./lore/LoreCard";

type Props = {
    open: boolean;
    side: "right" | "bottom";
    onOpenChange: (open: boolean) => void;

    selected: ClassSummaryT | null;
    full?: ClassWithSubclassesVM;
    loadingFull?: boolean;

    initialSubclassId?: string | null;

    onConfirm: (classId: string, subclassId?: string) => void;
};

function RoleIcon({ role }: { role?: string | null }) {
    if (!role) return null;
    const props = { className: "h-3.5 w-3.5" };
    switch (role) {
        case "Defensor": return <Shield {...props} />;
        case "Ofensor": return <Swords {...props} />;
        case "Suporte": return <HeartHandshake {...props} />;
        case "Híbrido": return <Layers {...props} />;
        default: return null;
    }
}

export default function ClassDetailsSheet({
                                              open, side, onOpenChange, selected, full, loadingFull, initialSubclassId = null, onConfirm,
                                          }: Props) {
    const [pickedSubclass, setPickedSubclass] = useState<string | null>(initialSubclassId);

    const { data: loreRaw, isFetching: loreLoading } = api.classCatalog.getLore.useQuery(
        { classId: selected?.id ?? "", locale: "pt-BR" },
        { enabled: !!selected?.id }
    );
    const lore: LoreVM = useMemo(
        () => normalizeLore(loreRaw, selected?.assets?.image),
        [loreRaw, selected?.assets?.image]
    );

    useEffect(() => { setPickedSubclass(initialSubclassId ?? null); }, [initialSubclassId, open]);
    useEffect(() => { setPickedSubclass(null); }, [selected?.id]);
    useEffect(() => {
        if (!loadingFull && full?.subclasses?.length === 1) setPickedSubclass(full.subclasses[0]!.id);
    }, [loadingFull, full?.subclasses]);

    const description = useMemo<string>(() => {
        return (full?.clazz.description ?? selected?.description ?? "Sem descrição.").trim();
    }, [full?.clazz?.description, selected?.description]);

    const chips = (
        <div className="flex flex-wrap items-center gap-2">
            {!!selected?.role && (
                <Badge variant="outline" className="gap-1">
                    <RoleIcon role={selected.role} />
                    {selected.role}
                </Badge>
            )}
            {!!selected?.hitDie && (
                <Badge variant="outline" className="gap-1">
                    <Dice6 className="h-3.5 w-3.5" />
                    {selected.hitDie}
                </Badge>
            )}
            {!!selected?.spellcasting && (
                <Badge variant="outline" className="gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    {selected.spellcasting}
                </Badge>
            )}
            {!!pickedSubclass && (
                <Badge className="gap-1">
                    Subclasse: {full?.subclasses.find((s) => s.id === pickedSubclass)?.name ?? "—"}
                </Badge>
            )}
        </div>
    );

    const hero = (
        <div className="relative">
            <SheetFrame>
                {selected?.assets?.image && (
                    <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
                        {/* Mantém a solução com ratio, sem duplicar código (sem overlay aqui para limpar) */}
                        <div className="relative aspect-[16/9] sm:aspect-[21/9]">
                            <img src={selected.assets.image} alt="" className="absolute inset-0 h-full w-full object-cover rounded-xl" />
                        </div>
                    </div>
                )}

                <div className="mt-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold">{selected?.name ?? "Classe"}</h3>
                            <p className="mt-1 text-xs text-white/60">Entenda estilo, mecânicas e caminhos.</p>
                        </div>
                        {chips}
                    </div>

                    <Separator className="my-3 bg-white/10" />
                    <div className="text-sm leading-relaxed text-white/80">
                        {loadingFull ? <SkeletonLine lines={3} /> : description}
                    </div>
                </div>
            </SheetFrame>
        </div>
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className={cn("w-full sm:max-w-[640px] p-0")}>
                <div className="p-4 pb-3 md:p-5 md:pb-4">
                    <SheetHeader className="mb-2">
                        <SheetTitle>{selected?.name ?? "Classe"}</SheetTitle>
                        <SheetDescription>Pré-visualize antes de confirmar sua escolha.</SheetDescription>
                    </SheetHeader>

                    <div className="mt-2">
                        <ScrollArea className="h-[70dvh] md:h-[78dvh] pr-2 md:pr-3">
                            <div className="space-y-4">
                                {hero}

                                <SheetFrame scroll={false}>
                                    <Tabs defaultValue="sobre" className="w-full">
                                        <TabsList className="grid w-full grid-cols-5">
                                            <TabsTrigger value="sobre">Sobre</TabsTrigger>
                                            <TabsTrigger value="mec">Mecânicas</TabsTrigger>
                                            <TabsTrigger value="proscons">Prós & Contras</TabsTrigger>
                                            <TabsTrigger value="subs">Subclasses</TabsTrigger>
                                            <TabsTrigger value="lore">Lore</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="sobre" className="pt-3">
                                            <Section title="Você aprenderá a…">
                                                {loadingFull ? (
                                                    <SkeletonBullets count={3} />
                                                ) : selected?.featuresPreview?.length ? (
                                                    <ul className="list-disc pl-5 text-sm text-white/80">
                                                        {selected.featuresPreview.map((f) => (<li key={f}>{f}</li>))}
                                                    </ul>
                                                ) : (
                                                    <EmptyText />
                                                )}
                                            </Section>
                                        </TabsContent>

                                        <TabsContent value="mec" className="pt-3">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <InfoBlock label="Papel" value={selected?.role ?? "—"} />
                                                <InfoBlock label="Dado de Vida" value={selected?.hitDie ?? "—"} />
                                                <InfoBlock label="Atributos-Chave" value={fmt(selected?.primaryAbilities)} />
                                                <InfoBlock label="Testes de Resistência" value={fmt(selected?.savingThrows)} />
                                                <InfoBlock label="Armaduras" value={fmt(selected?.armorProficiencies)} />
                                                <InfoBlock label="Armas" value={fmt(selected?.weaponProficiencies)} />
                                                <InfoBlock label="Magia" value={selected?.spellcasting ?? "—"} />
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="proscons" className="pt-3">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <Section title="Vantagens">
                                                    {selected?.pros?.length ? (
                                                        <ul className="list-disc pl-5 text-sm text-white/80">
                                                            {selected.pros.map((p) => (<li key={p}>{p}</li>))}
                                                        </ul>
                                                    ) : <EmptyText />}
                                                </Section>
                                                <Section title="Cuidados / Desvantagens">
                                                    {selected?.cons?.length ? (
                                                        <ul className="list-disc pl-5 text-sm text-white/80">
                                                            {selected.cons.map((c) => (<li key={c}>{c}</li>))}
                                                        </ul>
                                                    ) : <EmptyText />}
                                                </Section>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="lore" className="pt-3">
                                            <LoreCard
                                                lore={lore}
                                                fallbackImage={selected?.assets?.image}
                                                loading={loreLoading}
                                                Section={Section}
                                                SkeletonLine={SkeletonLine}
                                                SkeletonBullets={SkeletonBullets}
                                                EmptyText={EmptyText}
                                            />
                                        </TabsContent>

                                        {/* Subclasses */}
                                        <TabsContent value="subs" className="pt-3">
                                            {loadingFull && <div className="text-sm text-white/60">Carregando subclasses…</div>}
                                            {!loadingFull &&
                                                (!full?.subclasses?.length ? (
                                                    <EmptyText text="Esta classe não possui subclasses cadastradas." />
                                                ) : (
                                                    <>
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <div className="text-xs text-white/60">
                                                                {full.subclasses.length} opção{full.subclasses.length > 1 ? "es" : ""} disponível
                                                                {full.subclasses.length > 1 ? "s" : ""}.
                                                            </div>
                                                            {pickedSubclass && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setPickedSubclass(null)}
                                                                    className="h-7 px-2 text-xs"
                                                                >
                                                                    Limpar seleção
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="grid gap-2">
                                                            {full.subclasses.map((s) => {
                                                                const active = pickedSubclass === s.id;
                                                                return (
                                                                    <button
                                                                        key={s.id}
                                                                        onClick={() => setPickedSubclass(active ? null : s.id)}
                                                                        className={cn(
                                                                            "text-left rounded-lg border p-3 transition",
                                                                            active ? "border-cyan-400/60 bg-cyan-400/10" : "border-white/10 hover:border-white/25"
                                                                        )}
                                                                        aria-pressed={active}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="font-medium">{s.name}</div>
                                                                            {active && <Badge variant="outline">Selecionada</Badge>}
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-white/70">{s.description}</p>
                                                                        {!!s.featuresPreview.length && (
                                                                            <ul className="mt-2 flex flex-wrap gap-2">
                                                                                {s.featuresPreview.map((f) => (
                                                                                    <li key={f} className="text-xs text-white/60">• {f}</li>
                                                                                ))}
                                                                            </ul>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                ))}
                                            <p className="mt-2 text-xs text-white/50">
                                                Dica: a maioria das classes escolhe subclasse no <strong>nível 3</strong>. Você pode pré-selecionar agora.
                                            </p>
                                        </TabsContent>
                                    </Tabs>
                                </SheetFrame>
                            </div>
                        </ScrollArea>
                    </div>

                    <SheetFooter className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-xs text-white/60">
                            Escolha pelo <strong>estilo</strong> que te inspira; números vêm depois.
                        </div>
                        <div className="flex items-center gap-2">
                            <SheetClose asChild><Button variant="ghost">Fechar</Button></SheetClose>
                            {selected && (
                                <Button onClick={() => { onConfirm(selected.id, pickedSubclass ?? undefined); onOpenChange(false); }}>
                                    Selecionar {selected.name}
                                </Button>
                            )}
                        </div>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function fmt(arr?: string[]): string {
    return (arr ?? []).length ? (arr as string[]).join(", ") : "—";
}
