"use client";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import { Info } from "lucide-react";
import ClassGallery from "./ClassGallery";
import ClassDetailsSheet from "@/app/app/characters/new/_parts/ClassDetailsSheet";

// shadcn/ui – Sheet (drawer)


type Props = {
    initialSelectedClassId?: string;
    initialSelectedSubclassId?: string;
    onConfirm: (classId: string, subclassId?: string) => void;
};


export default function ClassChapter({ initialSelectedClassId, initialSelectedSubclassId, onConfirm }: Props) {
    const [q, setQ] = useState("");
    const { data } = api.classCatalog.listSummaries.useQuery({ q });
    const classes: ClassSummaryT[] = data ?? [];

    const [selectedId, setSelectedId] = useState<string | null>(initialSelectedClassId ?? null);
    const [pickedSubclass, setPickedSubclass] = useState<string | null>(initialSelectedSubclassId ?? null);
    const selected = useMemo(
        () => classes.find((cls) => cls.id === selectedId) ?? null,
        [classes, selectedId]
    );

    // zera subclasse quando muda a classe selecionada
    useEffect(() => {
        setPickedSubclass(null);
    }, [selectedId]);

    // detalhe da classe + subclasses (carrega só quando há seleção)
    const { data: full, isFetching: loadingFull } =
        api.classCatalog.getWithSubclasses.useQuery(
            { id: selected?.id ?? "" },
            { enabled: !!selected?.id }
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
                selectedClassId={selectedId ?? undefined}
                onSelect={(cls) => {
                    setSelectedId(cls.id);       // só pré-visualiza
                    setPickedSubclass(null);     // reset subclasse ao trocar
                    setOpen(true);               // abre o Drawer de detalhes
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

            <ClassDetailsSheet
                open={open}
                side={side}
                onOpenChange={setOpen}
                selected={selected}
                full={full}
                loadingFull={loadingFull}
                initialSubclassId={initialSelectedSubclassId ?? null}
                onConfirm={(classId, subclassId) => {
                    onConfirm(classId, subclassId);
                }}
            />
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
