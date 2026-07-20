"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Info, Wand2, RefreshCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// 🔹 catálogo/gerador
import { generateNames, type NameSetKey, labelForSet } from "@/lib/identity/nameCatalog";
import { CONCEPT_CHIPS } from "@/lib/identity/conceptCatalog";

export type IdentityData = {
    name: string;
    concept?: string;
    epithet?: string;
    tone?: "aurora" | "crepusculo" | "tempestade" | "brasa" | "abismo" | "";
    pronoun?: "ele" | "ela" | "";
};

type Props = {
    value: IdentityData | null;
    onChange?: (val: IdentityData) => void;
    onContinue?: () => void;
    onAutosave?: (value: IdentityData) => Promise<void>;
    isSaving?: boolean;
    checkNameAvailability?: (name: string) => Promise<{ available: boolean }>;
    allowDuplicateNames?: boolean; // default true
};

const DEFAULT_IDENTITY: IdentityData = { name: "", concept: "", epithet: "", tone: "", pronoun: "" };
const NAME_MIN = 2;
const NAME_MAX = 40;
const CONCEPT_MAX = 90;

function shallowEqual<T extends object>(a: T, b: T): boolean {
    const ak = Object.keys(a) as (keyof T)[];
    const bk = Object.keys(b) as (keyof T)[];
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (a[k] !== b[k]) return false;
    return true;
}

export default function IdentityChapter({
                                            value,
                                            onChange,
                                            onContinue,
                                            onAutosave,
                                            isSaving = false,
                                            checkNameAvailability,
                                            allowDuplicateNames = true,
                                        }: Props) {
    const [form, setForm] = React.useState<IdentityData>(value ?? DEFAULT_IDENTITY);

    React.useEffect(() => {
        const next = value ?? DEFAULT_IDENTITY;
        if (!shallowEqual(form, next)) setForm(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const prevRef = React.useRef<IdentityData>(form);
    React.useEffect(() => {
        if (!onChange) return;
        if (!shallowEqual(prevRef.current, form)) {
            prevRef.current = form;
            onChange(form);
        }
    }, [form, onChange]);

    // ======== sugestões de nome ========
    const [pickedSet, setPickedSet] = React.useState<NameSetKey>("elyra");
    const [suggestions, setSuggestions] = React.useState<string[]>([]);

    function rollNames(set: NameSetKey) {
        const out = generateNames(set, 5, {
            avoid: [], // pode passar nomes já usados
            allowSecond: true,
            epithetChance: 0.1,
        });
        setSuggestions(out);
        setPickedSet(set);
    }

    // ======== validação & disponibilidade ========
    const nameTrim = form.name.trim();
    const nameOk = nameTrim.length >= NAME_MIN && nameTrim.length <= NAME_MAX;
    const conceptOk = (form.concept ?? "").length <= CONCEPT_MAX;

    const [checking, setChecking] = React.useState(false);
    const [available, setAvailable] = React.useState<boolean | null>(null);
    const [lastChecked, setLastChecked] = React.useState<string>("");

    async function checkName() {
        if (!checkNameAvailability) return;
        const toCheck = form.name.trim();
        if (!toCheck) return;
        try {
            setChecking(true);
            const res = await checkNameAvailability(toCheck);
            setAvailable(res.available);
            setLastChecked(toCheck);
        } finally {
            setChecking(false);
        }
    }

    const mustBlockForDuplicate =
        !!checkNameAvailability &&
        !allowDuplicateNames &&
        available === false &&
        lastChecked === nameTrim;

    const canContinue = nameOk && conceptOk && !mustBlockForDuplicate;

    React.useEffect(() => {
        if (!onAutosave || !nameOk || !conceptOk) return;
        const timer = window.setTimeout(() => { void onAutosave(form); }, 700);
        return () => window.clearTimeout(timer);
    }, [conceptOk, form, nameOk, onAutosave]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">O despertar do teu Eco</h2>
                    <p className="text-sm text-white/70">
                        Comece pelo nome e conceito — eles afinam sua fantasia antes de escolher a Classe.
                    </p>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="inline-flex cursor-help items-center gap-2 text-white/70">
                                <Info className="h-4 w-4" />
                                Dicas
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm text-xs leading-relaxed">
                            Um bom nome canta. O conceito é uma frase curta que explica “quem sou + em que tensão vivo”.
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Nome */}
            <div className="space-y-2">
                <label className="text-xs text-white/60">Nome que o Cântico chama</label>
                <div className="flex gap-2">
                    <Input
                        value={form.name}
                        onChange={(e) => {
                            setForm((p) => ({ ...p, name: e.target.value }));
                            setAvailable(null);
                            setLastChecked("");
                        }}
                        onBlur={checkName}
                        placeholder="Ex.: Seraph Khae, Vaeloris, Umbrael..."
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => rollNames(pickedSet)}
                        title="Gerar 5 nomes"
                    >
                        <Wand2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Seletor de tema */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-white/50">Tema:</span>
                    {(["elyra", "artheon", "liren", "umbros", "vaelorin"] as NameSetKey[]).map((k) => (
                        <Button
                            key={k}
                            variant={pickedSet === k ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => rollNames(k)}
                            title={`Nomes de ${labelForSet(k)}`}
                        >
                            {labelForSet(k)}
                        </Button>
                    ))}
                    <Button size="sm" variant="ghost" onClick={() => setSuggestions([])}>
                        <RefreshCcw className="mr-1 h-3 w-3" /> limpar sugestões
                    </Button>
                </div>

                {/* Sugestões */}
                {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((name) => (
                            <Badge
                                key={name}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={async () => {
                                    setForm((p) => ({ ...p, name }));
                                    if (checkNameAvailability) {
                                        setChecking(true);
                                        try {
                                            const res = await checkNameAvailability(name);
                                            setAvailable(res.available);
                                            setLastChecked(name);
                                        } finally {
                                            setChecking(false);
                                        }
                                    }
                                }}
                            >
                                {name}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Feedback */}
                <div className="min-h-[1.5rem] text-xs">
                    {!nameTrim && <span className="text-white/50">Dê ao herói um nome (2–40 caracteres).</span>}
                    {!!nameTrim && !nameOk && (
                        <span className="text-red-300">
              Tamanho inválido: use entre {NAME_MIN} e {NAME_MAX} caracteres.
            </span>
                    )}
                    {!!nameTrim && nameOk && checkNameAvailability && (
                        <span className="inline-flex items-center gap-2">
              {checking ? (
                  <span className="text-white/60">Verificando disponibilidade…</span>
              ) : available === true ? (
                  <span className="text-emerald-300 inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Nome disponível
                </span>
              ) : available === false && lastChecked === nameTrim ? (
                  <span className="text-amber-300 inline-flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                      {allowDuplicateNames
                          ? "Já existe um personagem com este nome (permitido, mas considere variar)."
                          : "Nome já em uso (escolha outro)."}
                </span>
              ) : null}
            </span>
                    )}
                </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Epíteto e juramento */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs text-white/60">Epíteto (opcional)</label>
                    <span className="text-[10px] text-white/40">
            {(form.epithet ?? "").length}/60
          </span>
                </div>
                <Input
                    value={form.epithet ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, epithet: e.target.value.slice(0, 60) }))}
                    placeholder="Ex.: A Voz do Crepúsculo"
                />
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-white/60">Juramento do Eco (opcional)</label>
                        <span className="text-[10px] text-white/40">{(form.concept ?? "").length}/{CONCEPT_MAX}</span>
                    </div>
                    <Input
                        value={form.concept ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, concept: e.target.value.slice(0, CONCEPT_MAX) }))}
                        placeholder="Ex.: Guardião relutante marcado pelo Éter"
                    />
                </div>
                <Accordion type="single" collapsible className="mt-1">
                    <AccordionItem value="conceito-dicas">
                        <AccordionTrigger className="text-sm">Como escrever um bom juramento?</AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm text-white/70">
                            <p>
                                Um conceito forte cabe em uma frase e revela <em>tensão</em>: quem você é + o que te move + qual
                                conflito te atravessa.
                            </p>
                            <ul className="list-disc pl-5">
                                <li>
                                    <strong>Estrutura:</strong> <em>[papel/alcunha]</em> + <em>[traço marcante]</em> +{" "}
                                    <em>[tensão/ferida/missão]</em>.
                                </li>
                                <li>
                                    <strong>Exemplos rápidos:</strong>
                                </li>
                            </ul>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {CONCEPT_CHIPS.map((c) => (
                                    <Badge
                                        key={c}
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => setForm((p) => ({ ...p, concept: c }))}
                                    >
                                        {c}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-xs text-white/50">
                                Dica Elyriana: se travar, diga em voz alta quem você é no Cântico.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs text-white/60">Tom do Eco</label>
                    <p className="mt-1 text-xs text-white/45">Uma assinatura visual para tua ficha. Não altera regras.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {([
                        ["aurora", "Aurora", "from-cyan-300/40 to-emerald-300/10"],
                        ["crepusculo", "Crepúsculo", "from-violet-400/40 to-fuchsia-400/10"],
                        ["tempestade", "Tempestade", "from-sky-400/40 to-slate-300/10"],
                        ["brasa", "Brasa", "from-amber-300/40 to-rose-400/10"],
                        ["abismo", "Abismo", "from-indigo-500/45 to-slate-950/20"],
                    ] as const).map(([tone, label, accent]) => {
                        const selected = form.tone === tone;
                        return (
                            <button
                                key={tone}
                                type="button"
                                data-sfx-click="cardSelect"
                                onClick={() => setForm((p) => ({ ...p, tone }))}
                                aria-pressed={selected}
                                className={`rounded-xl border bg-gradient-to-br ${accent} px-3 py-3 text-left text-xs transition ${selected ? "border-white/65 ring-1 ring-white/40" : "border-white/10 hover:border-white/30"}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pronome */}
            <div className="space-y-2">
                <label className="text-xs text-white/60">Pronome (opcional)</label>
                <RadioGroup
                    value={form.pronoun ?? ""}
                    onValueChange={(v) => setForm((p) => ({ ...p, pronoun: v as IdentityData["pronoun"] }))}
                    className="flex gap-4"
                >
                    {(["ele", "ela", ""] as const).map((val) => (
                        <div key={val || "nenhum"} className="flex items-center space-x-2">
                            <RadioGroupItem id={`pron-${val || "none"}`} value={val} />
                            <Label htmlFor={`pron-${val || "none"}`}>{val || "manter em mistério"}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-white/50">
                    {isSaving ? "O Éter está guardando este fragmento..." : canContinue ? "O Éter guardará cada escolha enquanto você cria." : "Preencha um nome válido para avançar."}
                </div>
                <Button onClick={onContinue} disabled={!canContinue}>
                    Continuar para Classe
                </Button>
            </div>
        </div>
    );
}
