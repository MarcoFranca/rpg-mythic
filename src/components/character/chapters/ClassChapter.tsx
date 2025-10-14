"use client";
import { useEffect, useMemo, useState } from "react";
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
import SubclassList from "./SubclassList"; // ⬅️ já feito antes

// shadcn/ui – Sheet (drawer)
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";

type Props = {
    selectedClassId?: string;
    onSelect: (cls: ClassSummaryT) => void;
};

export default function ClassChapter({ selectedClassId, onSelect }: Props) {
    const [q, setQ] = useState("");
    const { data } = api.classCatalog.listSummaries.useQuery({ q });
    const classes: ClassSummaryT[] = data ?? [];

    const selected = useMemo(
        () => classes.find((cls) => cls.id === selectedClassId) ?? null,
        [classes, selectedClassId]
    );

    // Drawer responsivo: right (desktop) / bottom (mobile)
    const [open, setOpen] = useState<boolean>(false);
    const [side, setSide] = useState<"right" | "bottom">("right");
    useEffect(() => {
        const mql = window.matchMedia("(max-width: 767px)");
        const apply = () => setSide(mql.matches ? "bottom" : "right");
        apply();
        mql.addEventListener("change", apply);
        return () => mql.removeEventListener("change", apply);
    }, []);

    // Subclasse escolhida (opcional)
    const [pickedSubclass, setPickedSubclass] = useState<{
        id: string;
        classId: string;
        name: string;
        description: string;
        aliases: string[];
    } | null>(null);

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
                {selected && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">Selecionada: {selected.name}</Badge>
                        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                            Ver detalhes
                        </Button>
                    </div>
                )}
            </div>

            {/* Galeria estilo Diablo – seleção continua igual */}
            <ClassGallery
                selectedClassId={selectedClassId}
                onSelect={(cls) => {
                    onSelect(cls);
                    // abre o painel automaticamente ao selecionar
                    setPickedSubclass(null);
                    setOpen(true);
                }}
            />

            <Separator className="bg-white/10" />

            {/* Mensagem simples (fallback) se nenhuma classe estiver selecionada */}
            <Card className="bg-white/5 backdrop-blur">
                <CardHeader>
                    <CardTitle>Resumo & Didática</CardTitle>
                </CardHeader>
                <CardContent>
                    {!selected ? (
                        <div className="flex items-center gap-2 text-sm text-white/70">
                            <Info className="h-4 w-4" />
                            Selecione uma classe na galeria acima e clique em <em>Ver detalhes</em> para abrir o painel didático.
                        </div>
                    ) : (
                        <div className="text-sm text-white/70">
                            {selected.description}
                            <div className="mt-3">
                                <Button size="sm" onClick={() => setOpen(true)}>Abrir detalhes</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ===========================
          Drawer Didático (Sheet)
         =========================== */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side={side} className="w-full sm:max-w-[560px]">
                    <SheetHeader>
                        <SheetTitle>{selected?.name ?? "Classe"}</SheetTitle>
                        <SheetDescription>
                            Entenda estilo, mecânicas e caminhos da classe antes de confirmar sua escolha.
                        </SheetDescription>
                    </SheetHeader>

                    {selected ? (
                        <div className="mt-4 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {selected.role && <Badge variant="outline">{selected.role}</Badge>}
                                {selected.spellcasting && <Badge variant="outline">{selected.spellcasting}</Badge>}
                                {pickedSubclass && <Badge>Subclasse: {pickedSubclass.name}</Badge>}
                            </div>

                            <Tabs defaultValue="sobre" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="sobre">Sobre</TabsTrigger>
                                    <TabsTrigger value="mec">Mecânicas</TabsTrigger>
                                    <TabsTrigger value="proscons">Prós & Contras</TabsTrigger>
                                    <TabsTrigger value="subs">Subclasses</TabsTrigger>
                                </TabsList>

                                <TabsContent value="sobre" className="space-y-3 pt-3">
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
                                </TabsContent>

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

                                <TabsContent value="subs" className="space-y-3 pt-3">
                                    <SubclassList
                                        classId={selected.id}
                                        onPick={(sub) => {
                                            setPickedSubclass(sub);
                                        }}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                            <Info className="h-4 w-4" />
                            Selecione uma classe na galeria para visualizar detalhes.
                        </div>
                    )}

                    <SheetFooter className="mt-6 flex items-center justify-between gap-3">
                        <div className="text-xs text-white/60">
                            Dica: escolha pelo <strong>estilo de jogo</strong> que te inspira; números vêm depois.
                        </div>
                        <div className="flex items-center gap-2">
                            <SheetClose asChild>
                                <Button variant="ghost">Fechar</Button>
                            </SheetClose>
                            {selected && (
                                <Button
                                    onClick={() => {
                                        onSelect(selected);
                                        setOpen(false);
                                    }}
                                >
                                    Selecionar {selected.name}
                                </Button>
                            )}
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
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
