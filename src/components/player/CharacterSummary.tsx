"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEter } from "@/lib/eter/state";
import { glassClass } from "@/components/system/Glass";

type Props = {
    name: string;
    lineage: string;
    level: number;
    portraitUrl?: string | null;
    onOpenSheet: () => void;
};

export function CharacterSummary({ name, lineage, level, portraitUrl, onOpenSheet }: Props) {
    const { theme } = useEter();

    return (
        <div className={glassClass("p-4 flex items-center gap-4")} style={{ boxShadow: `0 0 0 1px ${theme.accentSoft}` }}>
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-black/40">
                {portraitUrl ? (
                    <Image src={portraitUrl} alt={name} fill className="object-cover" />
                ) : (
                    <div className="grid h-full w-full place-items-center text-xs opacity-70">Sem retrato</div>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm opacity-80">Eco da Alma</div>
                <div className="truncate text-lg font-semibold">{name}</div>
                <div className="truncate text-xs opacity-80">{lineage} • Eco {level}</div>
            </div>
            <Button onClick={onOpenSheet} className="rounded-xl border border-white/10 bg-white/10">
                Abrir Ficha
            </Button>
        </div>
    );
}
