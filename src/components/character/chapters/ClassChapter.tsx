"use client";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import { Info } from "lucide-react";
import ClassGallery from "./ClassGallery";
import SubclassList from "@/components/character/chapters/SubclassList";

type Props = {
    selectedClassId?: string;
    onSelect: (cls: ClassSummaryT) => void;
};

export default function ClassChapter({ selectedClassId, onSelect }: Props) {
    const [q, setQ] = useState("");
    const { data, isLoading, error } = api.classCatalog.listSummaries.useQuery({ q });
    const classes: ClassSummaryT[] = data ?? [];

    const selected = useMemo(
        () => classes.find((cls) => cls.id === selectedClassId) ?? null,
        [classes, selectedClassId]
    );

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <h2 className="text-xl font-semibold">Escolha sua Classe</h2>
                <p className="text-sm text-white/70">
                    Como no “Livro do Jogador”, mas vivo: compare visuais e selecione. Sua classe é como sua alma canta no Cântico.
                </p>
            </header>

            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Busque por nome (Mago, Bárbaro...)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="max-w-md"
                />
                {selected && <Badge variant="secondary">Selecionada: {selected.name}</Badge>}
            </div>

            {/* Galeria estilo Diablo */}
            <ClassGallery selectedClassId={selectedClassId} onSelect={onSelect} />

            <Separator className="bg-white/10" />

            <Card className="bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle>Resumo & Didática</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-sm text-red-300">Falha ao carregar classes: {error.message}</div>
                    )}

                    {!selected ? (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Info className="h-4 w-4" />
                            Selecione uma classe na galeria acima para ver explicações, vantagens e cuidados.
                        </div>
                    ) : (
                        <Tabs defaultValue="sobre" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                                <TabsTrigger value="mec">Mecânicas</TabsTrigger>
                                <TabsTrigger value="proscons">Prós & Contras</TabsTrigger>
                                <TabsTrigger value="subclasses">Subclasses</TabsTrigger>
                            </TabsList>

                            {/* SOBRE */}
                            <TabsContent value="sobre" className="space-y-3 pt-3">
                                <h3 className="text-lg font-medium">{selected.name}</h3>
                                <p className="text-sm text-white/70">{selected.description}</p>
                                {selected.featuresPreview.length > 0 && (
                                    <>
                                        <h4 className="mt-2 text-sm font-semibold">Você aprenderá a…</h4>
                                        <ul className="list-disc pl-5 text-sm text-white/80">
                                            {selected.featuresPreview.map((f) => (
                                                <li key={f}>{f}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                <div className="pt-2 text-xs text-white/60">
                                    Dica Elyriana: escolha pelo <strong>estilo de jogo</strong> que te inspira.
                                </div>
                                <Button className="mt-3" onClick={() => onSelect(selected)}>
                                    Selecionar {selected.name}
                                </Button>
                            </TabsContent>

                            {/* MECÂNICAS */}
                            <TabsContent value="mec" className="space-y-3 pt-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <InfoBlock label="Papel" value={selected.role ?? "—"} />
                                    <InfoBlock label="Dado de Vida" value={selected.hitDie ?? "—"} />
                                    <InfoBlock label="Atributos-Chave" value={fmt(selected.primaryAbilities)} />
                                    <InfoBlock label="Testes de Resistência" value={fmt(selected.savingThrows)} />
                                    <InfoBlock label="Armaduras" value={fmt(selected.armorProficiencies)} />
                                    <InfoBlock label="Armas" value={fmt(selected.weaponProficiencies)} />
                                    <InfoBlock label="Magia" value={selected.spellcasting ?? "—"} />
                                </div>
                            </TabsContent>

                            {/* PRÓS & CONTRAS */}
                            <TabsContent value="proscons" className="pt-3">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="pros">
                                        <AccordionTrigger>Vantagens</AccordionTrigger>
                                        <AccordionContent>
                                            {selected.pros.length ? (
                                                <ul className="list-disc pl-5 text-sm text-white/80">
                                                    {selected.pros.map((p) => (
                                                        <li key={p}>{p}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-white/60">—</p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="cons">
                                        <AccordionTrigger>Cuidados / Desvantagens</AccordionTrigger>
                                        <AccordionContent>
                                            {selected.cons.length ? (
                                                <ul className="list-disc pl-5 text-sm text-white/80">
                                                    {selected.cons.map((cc) => (
                                                        <li key={cc}>{cc}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-white/60">—</p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            {/* SUBCLASSES */}
                            <TabsContent value="subclasses" className="pt-3">
                                <SubclassList classId={selected.id as string} />
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
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
function fmt(arr: string[] | undefined): string {
    return (arr ?? []).length ? (arr as string[]).join(", ") : "—";
}
