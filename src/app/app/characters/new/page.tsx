"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttributesBlock, AttributesBlockT } from "@/server/zod/character-blocks";
import { debounce } from "@/lib/utils/debounce";
import { toast } from "sonner"; // se usa sonner
import { useRef } from "react"; // add

type IdentityForm = {
    name: string;
    ancestryId: string;
    backgroundId?: string;
    classes: { classId: string; level: number; subclassId?: string }[];
    portraitUrl?: string;
    pronoun?: "ele"|"ela"|"elu";
};

const defaultAttributes: AttributesBlockT = {
    base: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
    bonuses: [],
    temp: [],
};

// simples catálogo local (você pode popular via query depois)
const CLASS_OPTS = [
    { id: "guerreiro", name: "Guerreiro" },
    { id: "mago", name: "Mago" },
];
const ANCESTRY_OPTS = [
    { id: "elyriano", name: "Elyriano" },
    { id: "drakhen", name: "Drákhen" },
    { id: "liriem", name: "Liriem" },
];

export default function NewCharacterPage() {
    const router = useRouter();
    const createDraft = api.characterCreate.createDraft.useMutation();
    const saveIdentity = api.characterCreate.saveIdentity.useMutation();
    const saveAttributes = api.characterCreate.saveAttributes.useMutation();
    const finalize = api.characterCreate.finalize.useMutation();
    const createdRef = useRef(false); // evita duplo create em dev

    const [id, setId] = useState<string | null>(null);
    const [step, setStep] = useState<"identity"|"attributes">("identity");

    // forms locais
    const [identity, setIdentity] = useState<IdentityForm>({
        name: "",
        ancestryId: "elyriano",
        classes: [{ classId: "guerreiro", level: 1 }],
        pronoun: "ele",
    });
    const [attributes, setAttributes] = useState<AttributesBlockT>(defaultAttributes);
    const [saving, setSaving] = useState(false);

    // criar rascunho ao abrir
    useEffect(() => {
        (async () => {
            if (createdRef.current) return;
            createdRef.current = true;
            try {
                const r = await createDraft.mutateAsync({});
                setId(r.id);
            } catch (e) {
                console.error(e);
                toast?.error?.("Não foi possível iniciar o ritual. Faça login e tente novamente.");
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // autosave Identidade (debounce)
    const debouncedSaveIdentity = useMemo(
        () => debounce(async (draftId: string, data: IdentityForm) => {
            await saveIdentity.mutateAsync({ id: draftId, data });
        }, 600),
        []
    );

    async function goAttributes() {
        try {
            setSaving(true);
            // se ainda não tiver id (edge-case), cria agora
            let draftId = id;
            if (!draftId) {
                const r = await createDraft.mutateAsync({});
                draftId = r.id;
                setId(r.id);
            }
            await saveIdentity.mutateAsync({ id: draftId!, data: identity });
            setStep("attributes");
        } catch (e: any) {
            console.error(e);
            toast?.error?.(
                e?.shape?.message ??
                e?.message ??
                "Algo impediu o avanço. Verifique os campos."
            );
        } finally {
            setSaving(false);
        }
    }

    async function finishCreation() {
        if (!id) return;
        setSaving(true);
        // salva atributos + snapshot
        const parsed = AttributesBlock.parse(attributes);
        await saveAttributes.mutateAsync({ id, attributes: parsed });
        // finaliza
        await finalize.mutateAsync({ id });
        setSaving(false);
        router.push(`/app/characters/${id}`);
    }

    const canProceed =
        identity.name.trim().length >= 2 &&
        !!identity.ancestryId &&
        !!identity.classes[0]?.classId &&
        (identity.classes[0]?.level ?? 0) >= 1;


    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Forjar um Eco</h1>
                <p className="text-sm opacity-70">Siga o Cântico: Identidade → Atributos.</p>
            </div>

            <Tabs value={step} className="w-full">
                <TabsList className="rounded-2xl bg-black/40">
                    <TabsTrigger value="identity">1) Identidade</TabsTrigger>
                    <TabsTrigger value="attributes" disabled={!id}>2) Atributos</TabsTrigger>
                </TabsList>

                {/* === ETAPA 1 — Identidade === */}
                <TabsContent value="identity" className="mt-4">
                    <Card className="rounded-2xl border-white/10 bg-black/40">
                        <CardHeader><CardTitle>Quem canta em ti?</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <div className="mb-1 text-xs opacity-60">Nome</div>
                                <Input
                                    className="rounded-xl bg-black/50"
                                    value={identity.name}
                                    onChange={(e) => {
                                        const next = { ...identity, name: e.target.value };
                                        setIdentity(next);
                                        if (id) debouncedSaveIdentity(id, next);
                                    }}
                                    placeholder="Ex.: Aeryn Vardanos"
                                />
                                {identity.name.trim().length < 2 && (
                                    <div className="mt-1 text-xs text-red-300">Informe um nome (mín. 2 caracteres).</div>
                                )}

                            </div>

                            <div>
                                <div className="mb-1 text-xs opacity-60">Ancestralidade</div>
                                <Select
                                    value={identity.ancestryId}
                                    onValueChange={(val) => {
                                        const next = { ...identity, ancestryId: val };
                                        setIdentity(next);
                                        if (id) debouncedSaveIdentity(id, next);
                                    }}
                                >
                                    <SelectTrigger className="rounded-xl bg-black/50">
                                        <SelectValue placeholder="Escolha..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ANCESTRY_OPTS.map(a => (
                                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <div className="mb-1 text-xs opacity-60">Pronome</div>
                                <Select
                                    value={identity.pronoun}
                                    onValueChange={(val: "ele"|"ela"|"elu") => {
                                        const next = { ...identity, pronoun: val };
                                        setIdentity(next);
                                        if (id) debouncedSaveIdentity(id, next);
                                    }}
                                >
                                    <SelectTrigger className="rounded-xl bg-black/50">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ele">ele</SelectItem>
                                        <SelectItem value="ela">ela</SelectItem>
                                        <SelectItem value="elu">elu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <div className="mb-1 text-xs opacity-60">Classe (principal)</div>
                                <Select
                                    value={identity.classes[0]?.classId}
                                    onValueChange={(val) => {
                                        const next = { ...identity, classes: [{ ...identity.classes[0], classId: val ?? "guerreiro", level: 1 }] };
                                        setIdentity(next);
                                        if (id) debouncedSaveIdentity(id, next);
                                    }}
                                >
                                    <SelectTrigger className="rounded-xl bg-black/50">
                                        <SelectValue placeholder="Escolha..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CLASS_OPTS.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-full mt-2 flex justify-end">
                                <Button
                                    className="rounded-xl"
                                    disabled={!canProceed || !id || saving}
                                    onClick={goAttributes}
                                >
                                    {saving ? "Abrindo o Véu..." : "Prosseguir ao Éter dos Atributos"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === ETAPA 2 — Atributos === */}
                <TabsContent value="attributes" className="mt-4">
                    <Card className="rounded-2xl border-white/10 bg-black/40">
                        <CardHeader><CardTitle>Distribuir o Fôlego (Point-buy simples)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <PointBuyGrid value={attributes} onChange={setAttributes} />
                            <div className="flex justify-between text-sm opacity-80">
                                <span>Pontos gastos:</span>
                                <PointBuySpent value={attributes} />
                            </div>
                            <div className="flex justify-end">
                                <Button className="rounded-xl" disabled={!id || saving} onClick={finishCreation}>
                                    Concluir Ritual e Despertar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

/** ====== Components auxiliares (point buy 27) ====== */
const COST: Record<number, number> = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 };
function clamp(n:number,min:number,max:number){ return Math.max(min, Math.min(max, n)); }
function calcSpent(b: AttributesBlockT["base"]) {
    return (["str","dex","con","int","wis","cha"] as const).reduce((sum, k) => {
        const v = clamp(b[k], 8, 15);
        return sum + (COST[v] ?? 0);
    }, 0);
}

function StatRow({label, val, onChange}:{label:string; val:number; onChange:(n:number)=>void}) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="w-20 text-xs uppercase opacity-70">{label}</div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => onChange(val-1)}>-</Button>
                <Input type="number" className="h-9 w-16 rounded-lg bg-black/50 text-center" value={val}
                       onChange={(e)=>onChange(parseInt(e.target.value||"0"))}/>
                <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => onChange(val+1)}>+</Button>
            </div>
        </div>
    );
}

function PointBuyGrid({ value, onChange }: { value: AttributesBlockT; onChange: (v: AttributesBlockT) => void }) {
    const base = value.base;
    const setBase = (k: keyof AttributesBlockT["base"], v: number) =>
        onChange({ ...value, base: { ...base, [k]: clamp(v,8,15) } });
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(["str","dex","con","int","wis","cha"] as const).map(k => (
                <StatRow key={k} label={k} val={base[k]} onChange={(n)=>setBase(k,n)} />
            ))}
        </div>
    );
}

function PointBuySpent({ value }: { value: AttributesBlockT }) {
    const spent = calcSpent(value.base);
    return <span className={spent>27 ? "text-red-300" : ""}>{spent} / 27</span>;
}
