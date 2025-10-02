"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RARITIES = ["common","uncommon","rare","very_rare","legendary","artifact","mythic"] as const;
const TIERS = ["low","medium","high","legendary","artifact"] as const;

export type Filters = {
    q?: string;
    type?: "all" | "weapon" | "armor" | "consumable";
    rarity?: string;
    tier?: string;
};

export default function ItemsFilters({ onChange }: { onChange: (v: Filters) => void }) {
    const [q, setQ] = useState("");
    const [type, setType] = useState<Filters["type"]>("all");
    const [rarity, setRarity] = useState<string | undefined>();
    const [tier, setTier] = useState<string | undefined>();

    useEffect(() => { onChange({ q, type, rarity, tier }); }, [q, type, rarity, tier, onChange]);

    return (
        <div className="flex flex-col md:flex-row gap-3 p-4">
            <div className="flex-1">
                <Input placeholder="Buscar por nome..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            <Select value={type} onValueChange={(v: string) => setType(v as Filters["type"])}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="weapon">Armas</SelectItem>
                    <SelectItem value="armor">Armaduras</SelectItem>
                    <SelectItem value="consumable">Consumíveis</SelectItem>
                </SelectContent>
            </Select>

            <Select value={rarity} onValueChange={(v: string) => setRarity(v === "clear" ? undefined : v)}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Raridade" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="clear">—</SelectItem>
                    {RARITIES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
            </Select>

            <Select value={tier} onValueChange={(v: string) => setTier(v === "clear" ? undefined : v)}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tier" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="clear">—</SelectItem>
                    {TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => { setQ(""); setType("all"); setRarity(undefined); setTier(undefined); }}>
                Limpar
            </Button>
        </div>
    );
}
