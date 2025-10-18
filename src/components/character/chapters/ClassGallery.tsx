"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ClassCard from "./ClassCard";
import { api } from "@/trpc/react";
import { CLASS_ART, ClassTheme } from "@/components/character/registry/classArt";
import type { ClassSummaryT } from "@/server/api/routers/catalog/class";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

type Props = {
    selectedClassId?: string;
    onSelect: (cls: ClassSummaryT) => void;
};

export default function ClassGallery({ selectedClassId, onSelect }: Props) {
    const [focusIdx, setFocusIdx] = useState<number>(0);
    const { data, isLoading } = api.classCatalog.listSummaries.useQuery({}); // <- router correto
    const classes: ClassSummaryT[] = data ?? [];

    const models: Array<{ meta: ClassTheme | null; cls: ClassSummaryT }> = useMemo(() => {
        const norm = (s: string) =>
            s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        return classes.map((cls: ClassSummaryT) => {
            const nameKey = norm(cls.name);
            const meta =
                CLASS_ART.find((c) => c.id === cls.id) ??
                CLASS_ART.find((c) => norm(c.title) === nameKey) ??
                null;
            return { meta, cls };
        });
    }, [classes]);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handler = (e: KeyboardEvent) => {
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"].includes(e.key)) return;
            e.preventDefault();
            const cols = window.innerWidth < 768 ? 2 : 4;
            if (e.key === "ArrowRight") setFocusIdx((i) => Math.min(i + 1, models.length - 1));
            if (e.key === "ArrowLeft") setFocusIdx((i) => Math.max(i - 1, 0));
            if (e.key === "ArrowDown") setFocusIdx((i) => Math.min(i + cols, models.length - 1));
            if (e.key === "ArrowUp") setFocusIdx((i) => Math.max(i - cols, 0));
            if (e.key === "Enter") {
                const item = models[focusIdx];
                if (item) onSelect(item.cls);
            }
        };
        el.addEventListener("keydown", handler);
        return () => el.removeEventListener("keydown", handler);
    }, [models, focusIdx, onSelect]);

    if (isLoading) {
        return (
            <div className="grid gap-3 md:grid-cols-4 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/5" />
                ))}
            </div>
        );
    }

    if (!models.length) {
        return (
            <div className="flex items-center gap-2 text-sm text-white/70">
                <Info className="h-4 w-4" /> Nenhuma classe cadastrada.
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className="grid gap-4 outline-none md:grid-cols-4 sm:grid-cols-2"
            aria-label="Seleção de Classe por galeria"
        >
            {models.map(({ meta, cls }, idx) => {
                const sel = cls.id === selectedClassId;
                const img =
                    cls.assets?.image ??
                    meta?.image ??
                    "/classes/_placeholder.jpg"; // garanta esse arquivo na pasta /public/classes
                const accentFrom = cls.assets?.accentFrom ?? meta?.accentFrom;
                const accentTo   = cls.assets?.accentTo   ?? meta?.accentTo;
                return (
                    <ClassCard
                        key={cls.id}
                        title={cls.name}
                        image={img}
                        selected={sel || idx === focusIdx}
                        role={cls.role}
                        spellcasting={cls.spellcasting}
                        accentFrom={accentFrom}
                        accentTo={accentTo}
                        onClick={() => onSelect(cls)}
                    />
                );
            })}
            <div className="col-span-full mt-1 flex items-center justify-between text-xs text-white/50">
                <span>Use ← ↑ ↓ → e Enter para navegar/selecionar.</span>
                <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    Voltar ao topo
                </Button>
            </div>
        </div>
    );
}
