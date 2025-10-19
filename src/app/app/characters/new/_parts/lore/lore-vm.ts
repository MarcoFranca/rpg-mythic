// src/app/(characters)/new/_parts/lore/lore-vm.ts
export type LoreDisplayVM = {
    heroImage?: string;
    palette?: { from: string; to: string };
};

export type LoreChapterVM = {
    id?: string;
    title?: string;
    content?: string;
    bullets?: string[];
    blockquote?: string;
    table?: Record<string, string>[];
};

export type LoreGameplayVM = {
    hooks?: string[];
    partySynergy?: string;
};

export type LoreVM = {
    id?: string;
    classId?: string;
    locale?: string;
    version?: number;
    title?: string;
    tagline?: string;
    readingTimeMin?: number;
    display?: LoreDisplayVM;
    summary?: string;
    chapters: LoreChapterVM[];
    timeline?: { era?: string; evento?: string }[];
    rituals?: { id?: string; name?: string; effect?: string }[];
    locations?: { name?: string; note?: string }[];
    gameplay?: LoreGameplayVM;
    ui?: { selectIntro?: string; cta?: string; labels?: Record<string, string> };
    attribution?: { createdBy?: string; sources?: string[] };
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object";
const asStr = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
const asNum = (v: unknown): number | undefined => (typeof v === "number" ? v : undefined);
const asArr = <T,>(v: unknown, f: (x: unknown) => T | undefined): T[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out: T[] = [];
    for (const it of v) {
        const r = f(it);
        if (r !== undefined) out.push(r);
    }
    return out;
};
const asRecordStrStr = (v: unknown): Record<string, string> | undefined => {
    if (!isObj(v)) return undefined;
    const out: Record<string, string> = {};
    for (const [k, val] of Object.entries(v)) {
        if (typeof k === "string" && typeof val === "string") out[k] = val;
    }
    return out;
};

export function normalizeLore(raw: unknown, fallbackHero?: string): LoreVM {
    const src = isObj(raw) ? raw : {};

    // display
    let display: LoreDisplayVM | undefined;
    if (isObj(src.display)) {
        const d = src.display as Record<string, unknown>;
        const heroImage = asStr(d.heroImage) ?? fallbackHero;
        const palette = isObj(d.palette)
            ? (() => {
                const p = d.palette as Record<string, unknown>;
                const from = asStr(p.from);
                const to = asStr(p.to);
                return from && to ? { from, to } : undefined;
            })()
            : undefined;
        display = { heroImage, palette };
    } else if (fallbackHero) {
        display = { heroImage: fallbackHero };
    }

    // chapters
    const chapters =
        asArr<LoreChapterVM>(src.chapters, (x) => {
            if (!isObj(x)) return undefined;
            const o = x as Record<string, unknown>;
            const table = asArr<Record<string, string>>(o.table, asRecordStrStr);
            return {
                id: asStr(o.id),
                title: asStr(o.title),
                content: asStr(o.content),
                bullets: asArr<string>(o.bullets, asStr),
                blockquote: asStr(o.blockquote),
                table: table ?? [],
            };
        }) ?? [];

    // timeline/rituals/locations
    const timeline =
        asArr(src.timeline, (x) => {
            if (!isObj(x)) return undefined;
            const o = x as Record<string, unknown>;
            return { era: asStr(o.era), evento: asStr(o.evento) };
        }) ?? undefined;

    const rituals =
        asArr(src.rituals, (x) => {
            if (!isObj(x)) return undefined;
            const o = x as Record<string, unknown>;
            return { id: asStr(o.id), name: asStr(o.name), effect: asStr(o.effect) };
        }) ?? undefined;

    const locations =
        asArr(src.locations, (x) => {
            if (!isObj(x)) return undefined;
            const o = x as Record<string, unknown>;
            return { name: asStr(o.name), note: asStr(o.note) };
        }) ?? undefined;

    // gameplay
    const gameplay = isObj(src.gameplay)
        ? (() => {
            const g = src.gameplay as Record<string, unknown>;
            return { hooks: asArr<string>(g.hooks, asStr), partySynergy: asStr(g.partySynergy) };
        })()
        : undefined;

    // ui
    const ui = isObj(src.ui)
        ? (() => {
            const u = src.ui as Record<string, unknown>;
            const labels = asRecordStrStr(u.labels);
            return { selectIntro: asStr(u.selectIntro), cta: asStr(u.cta), labels };
        })()
        : undefined;

    // attribution
    const attribution = isObj(src.attribution)
        ? (() => {
            const a = src.attribution as Record<string, unknown>;
            return { createdBy: asStr(a.createdBy), sources: asArr<string>(a.sources, asStr) };
        })()
        : undefined;

    // reading time (aceita readingTimeMin ou readingMin)
    const readingTimeMin = ((): number | undefined => {
        const a = asNum((src as Record<string, unknown>).readingTimeMin);
        if (a != null) return a;
        const b = asNum((src as Record<string, unknown>).readingMin);
        return b ?? undefined;
    })();

    return {
        id: asStr(src.id),
        classId: asStr(src.classId),
        locale: asStr(src.locale),
        version: asNum(src.version),
        title: asStr(src.title),
        tagline: asStr(src.tagline),
        readingTimeMin,
        display,
        summary: asStr(src.summary),
        chapters,
        timeline,
        rituals,
        locations,
        gameplay,
        ui,
        attribution,
    };
}
