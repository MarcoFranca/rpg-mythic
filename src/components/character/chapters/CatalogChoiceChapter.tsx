"use client";

import { Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CatalogChoice = {
    id: string;
    name: string;
    description: string;
    badges?: string[];
    details?: Array<{ label: string; text: string }>;
};

type Props = {
    title: string;
    description: string;
    choices: CatalogChoice[];
    selectedId?: string;
    onSelect: (id: string) => void;
    onContinue: () => void;
    continueLabel: string;
    isSaving?: boolean;
};

export default function CatalogChoiceChapter({
    title,
    description,
    choices,
    selectedId,
    onSelect,
    onContinue,
    continueLabel,
    isSaving = false,
}: Props) {
    const selected = choices.find((choice) => choice.id === selectedId);

    return (
        <section className="space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-100/60">
                    <Sparkles className="h-3.5 w-3.5" /> Rito de escolha
                </div>
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                <p className="max-w-3xl text-sm leading-6 text-white/70">{description}</p>
            </header>

            {choices.length === 0 ? (
                <div className="rounded-2xl border border-amber-200/20 bg-amber-100/5 p-5 text-sm text-amber-50/80">
                    Este catálogo ainda não possui escolhas disponíveis.
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2">
                    {choices.map((choice) => {
                        const active = choice.id === selectedId;
                        return (
                            <button
                                key={choice.id}
                                type="button"
                                onClick={() => onSelect(choice.id)}
                                data-sfx-click="cardSelect"
                                aria-pressed={active}
                                className={cn(
                                    "group relative rounded-2xl border p-5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70",
                                    active
                                        ? "border-cyan-200/50 bg-cyan-100/[0.10] shadow-[0_0_32px_rgba(34,211,238,0.14)]"
                                        : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.07]",
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-lg font-medium text-white">{choice.name}</div>
                                        <p className="mt-2 text-sm leading-6 text-white/68">{choice.description}</p>
                                    </div>
                                    <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border", active ? "border-cyan-200/70 bg-cyan-200/20" : "border-white/15 bg-black/15")}>
                                        {active && <Check className="h-3.5 w-3.5 text-cyan-100" />}
                                    </span>
                                </div>

                                {!!choice.badges?.length && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {choice.badges.map((badge) => <Badge key={badge} variant="secondary">{badge}</Badge>)}
                                    </div>
                                )}

                                {!!choice.details?.length && (
                                    <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs">
                                        {choice.details.map((detail) => (
                                            <div key={detail.label} className="grid grid-cols-[5.5rem_1fr] gap-2">
                                                <dt className="text-white/45">{detail.label}</dt>
                                                <dd className="text-white/72">{detail.text}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <p className="text-xs text-white/55">
                    {selected ? `${selected.name} está gravado no teu rascunho.` : "Escolha um caminho para continuar."}
                </p>
                <Button onClick={onContinue} disabled={!selected || isSaving}>
                    {isSaving ? "Gravando no Éter..." : continueLabel}
                </Button>
            </div>
        </section>
    );
}
