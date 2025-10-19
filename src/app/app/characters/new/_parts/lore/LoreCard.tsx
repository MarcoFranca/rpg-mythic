// src/app/(characters)/new/_parts/lore/LoreCard.tsx
"use client";

import {JSX, useEffect, useMemo, useRef, useState} from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2, BookText, Quote } from "lucide-react";
import { LoreVM } from "./lore-vm";

/* ------------------- Parallax hook (busca scroller ancestral) ------------------- */

function getScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
    let node: HTMLElement | null = el;
    while (node) {
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if (node.hasAttribute("data-scrollable") || oy === "auto" || oy === "scroll") return node;
        node = node.parentElement;
    }
    return null;
}

// aceita tanto RefObject quanto MutableRefObject, com null no current
type AnyRef<T extends HTMLElement> = { current: T | null };

function useParallax<T extends HTMLElement>(
    ref: AnyRef<T>,
    factor = 0.25
) {
    const [y, setY] = useState(0);

    useEffect(() => {
        const target = ref.current as HTMLElement | null;
        if (!target) return;

        const scroller = getScrollableAncestor(target);
        if (!scroller) return;

        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const rect = target.getBoundingClientRect();
                const scrollerRect = scroller.getBoundingClientRect();
                const visibleTop = Math.max(rect.top, scrollerRect.top);
                const delta = visibleTop - scrollerRect.top;
                setY(-delta * factor);
            });
        };

        onScroll();
        scroller.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            scroller.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(raf);
        };
    }, [ref, factor]);

    return y;
}

/* ------------------- Componente ------------------- */

type Props = {
    lore: LoreVM;
    fallbackImage?: string;
    loading?: boolean;

    // 🔧 Tipos corrigidos (sem parâmetro opcional):
    Section: (p: { title: string; children: React.ReactNode }) => JSX.Element;
    SkeletonLine: (p: { lines?: number }) => JSX.Element;
    SkeletonBullets: (p: { count?: number }) => JSX.Element;
    EmptyText: (p: { text?: string }) => JSX.Element;
};

export default function LoreCard({
                                     lore,
                                     fallbackImage,
                                     loading,
                                     Section,
                                     SkeletonLine,
                                     SkeletonBullets,
                                     EmptyText,
                                 }: Props) {
    const hero = lore.display?.heroImage ?? fallbackImage;

    // parallax
    const heroWrapRef = useRef<HTMLDivElement>(null);
    const parallaxY = useParallax(heroWrapRef, 0.22);

    const hasExtras = useMemo(
        () =>
            !!(lore.timeline?.length ||
                lore.rituals?.length ||
                lore.locations?.length ||
                lore.gameplay?.hooks?.length ||
                lore.gameplay?.partySynergy),
        [lore]
    );

    return (
        <Section title="Conheça a Ordem">
            {/* CARD ÚNICO ABRANGENDO TODO O LORE */}
            <div className="overflow-hidden rounded-lg border border-white/10">
                {/* --- Header com hero + meta + resumo --- */}
                {hero && (
                    <div ref={heroWrapRef} className="relative w-full overflow-hidden">
                        <AspectRatio  className="sm:aspect-[21/9]">
                            <img
                                src={hero}
                                alt=""
                                style={{ transform: `translateY(${parallaxY}px) scale(1.05)`, willChange: "transform" }}
                                className="absolute inset-0  w-full object-cover"
                            />
                        </AspectRatio>


                        {/* botão de ampliar capa */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8">
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] p-0">
                                <img src={hero} alt="" className="h-auto w-full" />
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                <div className="p-3 sm:p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm text-white/70">
                        <BookText className="h-4 w-4" />
                        <span>Lore oficial • {lore.locale ?? "—"}</span>
                        {typeof lore.version === "number" && <span>• v{lore.version}</span>}
                        {typeof lore.readingTimeMin === "number" && <span>• {lore.readingTimeMin} min</span>}
                    </div>

                    <h4 className="text-base font-semibold">{lore.title ?? "História"}</h4>
                    {lore.tagline && <p className="mt-1 text-sm italic text-white/70">“{lore.tagline}”</p>}

                    <Separator className="my-3 bg-white/10" />

                    {loading ? (
                        <SkeletonLine lines={3} />
                    ) : lore.summary ? (
                        <p className="text-sm leading-relaxed text-white/80">{lore.summary}</p>
                    ) : (
                        <EmptyText text="Sem resumo disponível." />
                    )}
                </div>

                {/* --- Capítulos --- */}
                <div className="border-t border-white/10 p-3 sm:p-4">
                    {loading && <SkeletonBullets count={4} />}
                    {!loading && lore.chapters.length === 0 && <EmptyText text="Nenhum capítulo cadastrado." />}

                    {!loading &&
                        lore.chapters.map((ch, idx) => (
                            <div
                                key={ch.id ?? ch.title ?? idx}
                                className="rounded-lg border border-white/10 p-3 + mb-3 last:mb-0"
                            >
                                <h5 className="text-sm font-semibold">{ch.title}</h5>

                                {ch.content && <p className="mt-2 text-sm leading-relaxed text-white/80">{ch.content}</p>}

                                {ch.bullets && ch.bullets.length > 0 && (
                                    <ul className="mt-2 list-disc pl-5 text-sm text-white/80">
                                        {ch.bullets.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                )}

                                {ch.blockquote && (
                                    <blockquote className="mt-3 flex items-start gap-2 rounded-md border-l-2 border-white/20 bg-white/5 p-3 text-sm italic text-white/80">
                                        <Quote className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                                        <span>{ch.blockquote}</span>
                                    </blockquote>
                                )}

                                {ch.table && ch.table.length > 0 && (
                                    <div className="mt-3 overflow-hidden rounded-md border border-white/10">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5">
                                            <tr>
                                                {Object.keys(ch.table[0] ?? {}).map((k) => (
                                                    <th key={k} className="px-3 py-2 font-medium text-white/80">
                                                        {k}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {ch.table.map((row, i) => (
                                                <tr key={i} className="border-t border-white/10">
                                                    {Object.values(row).map((val, j) => (
                                                        <td key={j} className="px-3 py-2 text-white/80">
                                                            {val}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>

                {/* --- Extras (timeline / rituais / locais / hooks) --- */}
                { (lore.timeline?.length || lore.rituals?.length || lore.locations?.length || lore.gameplay?.hooks?.length || lore.gameplay?.partySynergy) && (
                    <div className="border-t border-white/10 p-3 sm:p-4 grid gap-3 sm:grid-cols-2">
                        {/* Timeline */}
                        {Array.isArray(lore.timeline) && lore.timeline.length > 0 && (
                            <div className="rounded-lg border border-white/10 p-3">
                                <h5 className="mb-2 text-sm font-semibold">Linha do Tempo</h5>
                                <ul className="space-y-2 text-sm text-white/80">
                                    {lore.timeline.map((t, i) => (
                                        <li key={i}>
                                            <span className="font-medium">{t.era}:</span> {t.evento}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Rituais */}
                        {Array.isArray(lore.rituals) && lore.rituals.length > 0 && (
                            <div className="rounded-lg border border-white/10 p-3">
                                <h5 className="mb-2 text-sm font-semibold">Rituais</h5>
                                <ul className="space-y-2 text-sm text-white/80">
                                    {lore.rituals.map((r) => (
                                        <li key={r.id}>
                                            <span className="font-medium">{r.name}:</span> {r.effect}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Locais */}
                        {Array.isArray(lore.locations) && lore.locations.length > 0 && (
                            <div className="rounded-lg border border-white/10 p-3">
                                <h5 className="mb-2 text-sm font-semibold">Locais</h5>
                                <ul className="space-y-2 text-sm text-white/80">
                                    {lore.locations.map((loc, i) => (
                                        <li key={i}>
                                            <span className="font-medium">{loc.name}</span>
                                            {loc.note ? ` — ${loc.note}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Hooks / Sinergia */}
                        {(Array.isArray(lore.gameplay?.hooks) && lore.gameplay!.hooks!.length > 0) || lore.gameplay?.partySynergy ? (
                            <div className="rounded-lg border border-white/10 p-3 sm:col-span-2">
                                <h5 className="mb-2 text-sm font-semibold">Ganchos & Sinergias</h5>
                                {Array.isArray(lore.gameplay?.hooks) && lore.gameplay!.hooks!.length > 0 && (
                                    <ul className="mb-2 list-disc pl-5 text-sm text-white/80">
                                        {lore.gameplay!.hooks!.map((h, i) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                    </ul>
                                )}
                                {lore.gameplay?.partySynergy && (
                                    <p className="text-sm text-white/80">
                                        <span className="font-medium">Sinergia de grupo:</span> {lore.gameplay.partySynergy}
                                    </p>
                                )}
                            </div>
                        ) : null}
                    </div>
                )}

                {/* --- Créditos --- */}
                {(lore.attribution?.createdBy || lore.attribution?.sources?.length) && (
                    <div className="border-t border-white/10 p-3 sm:p-4">
                        <p className="text-xs text-white/50">
                            <span className="font-medium">Créditos: </span>
                            {lore.attribution?.createdBy && <span>{lore.attribution.createdBy}</span>}
                            {Array.isArray(lore.attribution?.sources) && lore.attribution.sources.length > 0 && (
                                <>{" · Fontes: "}{lore.attribution.sources.join(", ")}</>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </Section>
    );
}
