// src/app/(characters)/new/_parts/ClassDetailsSheet.tsx
"use client";
import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import type { ClassWithSubclassesVM } from "@/server/api/routers/catalog/_normalize-class"; // exporte esse type no arquivo
import { cn } from "@/lib/utils";

type Props = {
    /** controle externo do Drawer */
    open: boolean;
    side: "right" | "bottom";
    onOpenChange: (open: boolean) => void;

    /** dados para render */
    selected: ClassSummaryT | null;
    full?: ClassWithSubclassesVM;
    loadingFull?: boolean;

    /** seleção inicial de subclasse (quando usuário volta) */
    initialSubclassId?: string | null;

    /** confirmar escolha */
    onConfirm: (classId: string, subclassId?: string) => void;
};

export default function ClassDetailsSheet({
                                              open,
                                              side,
                                              onOpenChange,
                                              selected,
                                              full,
                                              loadingFull,
                                              initialSubclassId = null,
                                              onConfirm,
                                          }: Props) {
    const [pickedSubclass, setPickedSubclass] = useState<string | null>(initialSubclassId);

    const description = useMemo<string>(() => {
        return (full?.clazz.description ?? selected?.description ?? "Sem descrição.").trim();
    }, [full?.clazz.description, selected?.description]);

    const chips = (
        <div className="flex flex-wrap items-center gap-2">
            {!!selected?.role && <Badge variant="outline">{selected.role}</Badge>}
            {!!selected?.spellcasting && <Badge variant="outline">{selected.spellcasting}</Badge>}
            {!!pickedSubclass && (
                <Badge>
                    Subclasse: {full?.subclasses.find((s) => s.id === pickedSubclass)?.name ?? "—"}
                </Badge>
            )}
        </div>
    );

    const hero = (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03]">
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold">{selected?.name ?? "Classe"}</h3>
                        <p className="mt-1 text-xs text-white/60">Entenda estilo, mecânicas e caminhos.</p>
                    </div>
                    {chips}
                </div>
                <Separator className="my-3 bg-white/10" />
                <p className="text-sm leading-relaxed text-white/80">
                    {loadingFull ? (
                        <SkeletonLine lines={3} />
                    ) : (
                        <p className="text-sm leading-relaxed text-white/80">{description}</p>
                    )}
                </p>
            </div>
        </div>
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className={cn("w-full sm:max-w-[620px]")}>
                <SheetHeader>
                    <SheetTitle>{selected?.name ?? "Classe"}</SheetTitle>
                    <SheetDescription>Pré-visualize antes de confirmar sua escolha.</SheetDescription>
                </SheetHeader>

                <div className="mt-4 space-y-4">
                    {hero}

                    <Tabs defaultValue="sobre" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="sobre">Sobre</TabsTrigger>
                            <TabsTrigger value="mec">Mecânicas</TabsTrigger>
                            <TabsTrigger value="proscons">Prós & Contras</TabsTrigger>
                            <TabsTrigger value="subs">Subclasses</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sobre" className="pt-3">
                            <Section title="Você aprenderá a…">
                                {loadingFull ? (
                                    <SkeletonBullets count={3} />
                                ) : selected?.featuresPreview?.length ? (
                                    <ul className="list-disc pl-5 text-sm text-white/80">
                                        {selected.featuresPreview.map((f) => <li key={f}>{f}</li>)}
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
                                            {selected.pros.map((p) => <li key={p}>{p}</li>)}
                                        </ul>
                                    ) : <EmptyText />}
                                </Section>
                                <Section title="Cuidados / Desvantagens">
                                    {selected?.cons?.length ? (
                                        <ul className="list-disc pl-5 text-sm text-white/80">
                                            {selected.cons.map((c) => <li key={c}>{c}</li>)}
                                        </ul>
                                    ) : <EmptyText />}
                                </Section>
                            </div>
                        </TabsContent>

                        <TabsContent value="subs" className="pt-3">
                            {loadingFull && <div className="text-sm text-white/60">Carregando subclasses…</div>}
                            {!loadingFull && (!full?.subclasses?.length ? (
                                <EmptyText text="Esta classe não possui subclasses cadastradas." />
                            ) : (
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
                            ))}
                            <p className="mt-2 text-xs text-white/50">
                                Dica: a maioria das classes escolhe subclasse no <strong>nível 3</strong>. Você pode pré-selecionar agora.
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>

                <SheetFooter className="mt-6 flex items-center justify-between gap-3">
                    <div className="text-xs text-white/60">
                        Escolha pelo <strong>estilo</strong> que te inspira; números vêm depois.
                    </div>
                    <div className="flex items-center gap-2">
                        <SheetClose asChild>
                            <Button variant="ghost">Fechar</Button>
                        </SheetClose>
                        {selected && (
                            <Button
                                onClick={() => {
                                    onConfirm(selected.id, pickedSubclass ?? undefined);
                                    onOpenChange(false);
                                }}
                            >
                                Selecionar {selected.name}
                            </Button>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

/* ---------- UI Helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-lg border border-white/10 p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">{title}</h4>
            {children}
        </section>
    );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-white/10 p-3">
            <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
            <div className="text-sm">{value}</div>
        </div>
    );
}

function EmptyText({ text = "—" }: { text?: string }) {
    return <p className="text-sm text-white/60">{text}</p>;
}

function SkeletonLine({ lines = 2 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full bg-white/10" />
            ))}
        </div>
    );
}

function SkeletonBullets({ count = 3 }: { count?: number }) {
    return (
        <ul className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i}>
                    <Skeleton className="h-4 w-3/4 bg-white/10" />
                </li>
            ))}
        </ul>
    );
}

function fmt(arr?: string[]): string {
    return (arr ?? []).length ? arr!.join(", ") : "—";
}
