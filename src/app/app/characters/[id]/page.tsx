"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AttributesBlockT, AttributesBlock } from "@/server/zod/character-blocks";

/* ===== Helpers de narrowing para JSON do Prisma ===== */

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
type JsonArray = JsonValue[];

// checa se é objeto simples
function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isArray(v: unknown): v is unknown[] {
    return Array.isArray(v);
}
function asNumber(v: unknown, fallback = 0): number {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
    return fallback;
}
function asString(v: unknown, fallback = ""): string {
    return typeof v === "string" ? v : fallback;
}

// Recurso { current, max }
type Resource = { current: number; max: number };
function asResource(v: unknown): Resource {
    if (isRecord(v)) {
        return {
            current: asNumber(v.current, 0),
            max: asNumber(v.max, 0),
        };
    }
    return { current: 0, max: 0 };
}

// Moedas { cp, sp, gp, pp }
type Coins = { cp: number; sp: number; gp: number; pp: number };
function asCoins(v: unknown): Coins {
    if (isRecord(v)) {
        return {
            cp: asNumber(v.cp, 0),
            sp: asNumber(v.sp, 0),
            gp: asNumber(v.gp, 0),
            pp: asNumber(v.pp, 0),
        };
    }
    return { cp: 0, sp: 0, gp: 0, pp: 0 };
}

// speeds como { [tipo]: number }
function asSpeeds(v: unknown): Record<string, number> {
    if (isRecord(v)) {
        const out: Record<string, number> = {};
        for (const [k, val] of Object.entries(v)) {
            out[k] = asNumber(val, 0);
        }
        return out;
    }
    // às vezes pode vir array -> ignora / fallback
    return {};
}

// lista de condições [{ key: string }]
type Condition = { key: string };
function asConditions(v: unknown): Condition[] {
    if (isArray(v)) {
        return v
            .map((it) => (isRecord(it) ? { key: asString(it.key, "") } : null))
            .filter((x): x is Condition => !!x && x.key.length > 0);
    }
    return [];
}

/* ===== UI ===== */

function Header({ ch }: { ch: any }) {
    return (
        <div className="mb-6 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                {/* retrato */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={ch.portraitUrl ?? "/placeholder-portrait.png"}
                    alt={ch.name}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex-1">
                <div className="text-sm opacity-70">Eco da Alma</div>
                <div className="text-2xl font-semibold">{ch.name}</div>
                <div className="text-xs opacity-60">Nível {ch.level}</div>
            </div>
            <div className="flex items-center gap-2">
                <InspirationToggle id={ch.id} initial={Boolean(ch.inspiration)} />
            </div>
        </div>
    );
}

function InspirationToggle({ id, initial }: { id: string; initial: boolean }) {
    const [val, setVal] = useState(initial);
    const mut = api.characterSheet.setInspiration.useMutation({ onSuccess: () => {} });
    return (
        <Button
            variant={val ? "default" : "secondary"}
            className="rounded-xl"
            onClick={async () => {
                const next = !val;
                setVal(next);
                await mut.mutateAsync({ id, value: next });
            }}
        >
            {val ? "Inspiração: Ativa" : "Inspiração: Inativa"}
        </Button>
    );
}

function AttributesEditor({
                              id,
                              attributes,
                              onSaved,
                          }: {
    id: string;
    attributes: AttributesBlockT;
    onSaved: (snapshot: any) => void;
}) {
    const [form, setForm] = useState<AttributesBlockT>(attributes);
    const mut = api.characterSheet.saveAttributesAndSnapshot.useMutation();

    const set = (k: keyof AttributesBlockT["base"], v: number) =>
        setForm((prev) => ({ ...prev, base: { ...prev.base, [k]: v } }));

    const save = async () => {
        const parsed = AttributesBlock.parse(form);
        const res = await mut.mutateAsync({ id, attributes: parsed });
        onSaved(res.snapshot);
    };

    return (
        <Card className="rounded-2xl border-white/10 bg-black/40">
            <CardHeader>
                <CardTitle>Atributos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {(["str", "dex", "con", "int", "wis", "cha"] as const).map((k) => (
                    <div key={k}>
                        <div className="mb-1 text-xs uppercase opacity-60">{k}</div>
                        <Input
                            type="number"
                            className="rounded-xl bg-black/50"
                            value={form.base[k]}
                            onChange={(e) => set(k, parseInt(e.target.value || "0", 10))}
                        />
                    </div>
                ))}

                <div className="col-span-full mt-2 flex justify-end">
                    <Button className="rounded-xl" onClick={save}>
                        Salvar & Recalcular
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function CombatPanel({ ch }: { ch: any }) {
    const snap = isRecord(ch.derivedSnapshot) ? ch.derivedSnapshot : {};

    const acObj = isRecord(snap.ac)
        ? snap.ac
        : {
            total: ch.combat?.ac ?? 10,
            base: 10,
            armor: 0,
            shield: 0,
            misc: 0,
        };
    const ac = {
        total: asNumber((acObj as any).total, 10),
        base: asNumber((acObj as any).base, 10),
        armor: asNumber((acObj as any).armor, 0),
        shield: asNumber((acObj as any).shield, 0),
        misc: asNumber((acObj as any).misc, 0),
    };

    const passObj = isRecord(snap.passives) ? snap.passives : {};
    const pass = {
        perception: asNumber(passObj.perception, 10),
        insight: asNumber(passObj.insight, 10),
        investigation: asNumber(passObj.investigation, 10),
    };

    const encObj = isRecord(snap.encumbrance) ? snap.encumbrance : {};
    const enc = {
        carriedWeight: asNumber(encObj.carriedWeight, 0),
        capacity: asNumber(encObj.capacity, 0),
        status: asString(encObj.status, "normal"),
    };

    const speeds = Object.keys(snap).length
        ? asSpeeds((snap as any).speedsFinal)
        : (isRecord(ch.combat?.speeds) ? asSpeeds(ch.combat?.speeds) : { walk: 9 });

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border-white/10 bg-black/40">
                <CardHeader><CardTitle>Combate</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span>Classe de Armadura</span>
                        <span className="text-lg font-semibold">{ac.total}</span>
                    </div>
                    <div className="text-xs opacity-60">
                        base {ac.base} · arm {ac.armor} · esc {ac.shield} · misc {ac.misc}
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/10 bg-black/40">
                <CardHeader><CardTitle>Passivas</CardTitle></CardHeader>
                <CardContent className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Percepção</span><span>{pass.perception}</span></div>
                    <div className="flex justify-between"><span>Intuição</span><span>{pass.insight}</span></div>
                    <div className="flex justify-between"><span>Investigação</span><span>{pass.investigation}</span></div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/10 bg-black/40">
                <CardHeader><CardTitle>Carga & Movimento</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Carga</span><span>{enc.carriedWeight} / {enc.capacity}</span></div>
                    <div className="flex justify-between"><span>Status</span><span className="capitalize">{enc.status}</span></div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs opacity-80">
                        {Object.entries(speeds).map(([k, v]) => (
                            <div key={k} className="flex justify-between"><span>{k}</span><span>{Number(v)} m</span></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CharacterSheetPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const q = api.characterSheet.getById.useQuery({ id });

    if (q.isLoading) return <div className="p-6 opacity-70">Carregando o canto do teu Eco…</div>;
    if (!q.data) return <div className="p-6 text-red-300">Eco não encontrado.</div>;

    const ch = q.data;

    // recursos vindos como JSON
    const faith = asResource(ch.faith);
    const ether = asResource(ch.ether);
    const corruption = asResource(ch.corruption);
    const conditions = asConditions(ch.conditions);
    // se precisar em algum lugar:
    const coins = asCoins(
        (ch as any)?.coins ??
        (ch as any)?.inventory?.coins ??
        (ch as any)?.economy?.coins ??
        null
    );
    return (
        <div className="p-4 md:p-6">
            <Header ch={ch} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <AttributesEditor
                        id={ch.id}
                        attributes={ch.attributes as AttributesBlockT}
                        onSaved={() => q.refetch()}
                    />
                    <CombatPanel ch={ch} />
                </div>

                <div className="space-y-6">
                    {/* Recursos Eldoryon */}
                    <Card className="rounded-2xl border-white/10 bg-black/40">
                        <CardHeader><CardTitle>Moedas</CardTitle></CardHeader>
                        <CardContent className="text-sm opacity-80">
                            <div>PP: {coins.pp}</div>
                            <div>GP: {coins.gp}</div>
                            <div>SP: {coins.sp}</div>
                            <div>CP: {coins.cp}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl border-white/10 bg-black/40">
                        <CardHeader><CardTitle>Equilíbrio Espiritual</CardTitle></CardHeader>
                        <CardContent className="text-sm opacity-80">
                            <div>Fé: {faith.current} / {faith.max}</div>
                            <div>Éter: {ether.current} / {ether.max}</div>
                            <div>Sombrasangue: {corruption.current} / {corruption.max}</div>
                        </CardContent>
                    </Card>


                    <Card className="rounded-2xl border-white/10 bg-black/40">
                        <CardHeader><CardTitle>Condições</CardTitle></CardHeader>
                        <CardContent className="text-xs opacity-80">
                            {conditions.length
                                ? conditions.map((c, i) => <div key={i}>• {c.key}</div>)
                                : <div>Nenhuma condição ativa.</div>}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Abas inferiores para expansão futura */}
            <div className="mt-8">
                <Tabs defaultValue="spells" className="w-full">
                    <TabsList className="rounded-2xl bg-black/40">
                        <TabsTrigger value="spells">Magias</TabsTrigger>
                        <TabsTrigger value="inventory">Inventário</TabsTrigger>
                        <TabsTrigger value="features">Traços & Poderes</TabsTrigger>
                        <TabsTrigger value="journal">Diário</TabsTrigger>
                    </TabsList>
                    <TabsContent value="spells" className="mt-4">
                        <Card className="rounded-2xl border-white/10 bg-black/40">
                            <CardHeader><CardTitle>Magias</CardTitle></CardHeader>
                            <CardContent className="text-sm opacity-80">
                                (Em breve: lista preparada/conhecida, slots, concentração.)
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="inventory" className="mt-4">
                        <Card className="rounded-2xl border-white/10 bg-black/40">
                            <CardHeader><CardTitle>Inventário</CardTitle></CardHeader>
                            <CardContent className="text-sm opacity-80">
                                (Em breve: grid de itens, equipar, sintonizar…)
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="features" className="mt-4">
                        <Card className="rounded-2xl border-white/10 bg-black/40">
                            <CardHeader><CardTitle>Traços & Poderes</CardTitle></CardHeader>
                            <CardContent className="text-sm opacity-80">
                                (Em breve: traços de ancestralidade, features de classe, feitos.)
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="journal" className="mt-4">
                        <Card className="rounded-2xl border-white/10 bg-black/40">
                            <CardHeader><CardTitle>Diário</CardTitle></CardHeader>
                            <CardContent className="text-sm opacity-80">
                                (Em breve: entradas de jornada, notas do jogador e do mestre.)
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
