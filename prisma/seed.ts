// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { promises as fsp } from "fs";
import { readFileSync } from "fs";
import { resolve, join, basename } from "path";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

/* ----------------- helpers gerais ----------------- */

const asJson = (v: unknown): Prisma.InputJsonValue => v as Prisma.InputJsonValue;
const fromSeedDir = (file: string) => resolve(__dirname, "seed", file);
const load = <T>(file: string): T =>
    JSON.parse(readFileSync(fromSeedDir(file), "utf-8")) as T;

const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === "object" && !Array.isArray(v);

const toJsonOrUndef = (v: unknown): Prisma.InputJsonValue | undefined =>
    v === undefined ? undefined : (v as Prisma.InputJsonValue);

/* ----------------- tipos de entrada (seeds) ----------------- */

type HitDie = "d6" | "d8" | "d10" | "d12";

type SubclassMetaIn = {
    featuresPreview?: string[];
    aliases?: string[];
    [key: string]: unknown; // extras opcionais
};

type SubclassFeatureLeaf = { level?: number; id?: string; name?: string; text?: string };
type SubclassFeatureNode = { name?: string; features?: Array<{ name?: string }> };
type SubclassFeaturesIn = SubclassFeatureLeaf[] | SubclassFeatureNode[];

type SubclassIn = {
    id?: string;
    slug?: string;
    name: string;
    description?: string;
    metaJson?: SubclassMetaIn;
    grantedSpells?: unknown;
    canalizarOptions?: unknown;
    features?: SubclassFeaturesIn;
};

type ClassIn = {
    id: string;
    name: string;
    hitDie: HitDie;
    profs: unknown;
    spellData?: unknown | null;
    description: string;
    metaJson?: Record<string, unknown>;
    featuresByLevel?: unknown; // novo
    features?: unknown; // legado (fallback)
    subclasses?: SubclassIn[];
};

/* ----------------- utils de síntese ----------------- */

function synthesizeSubclassDescription(name?: string, fallback?: string): string {
    if (fallback && fallback.trim()) return fallback.trim();
    if (!name) return "Subclasse.";
    return `Caminho ${name}: estilo de jogo e poderes temáticos.`;
}

function pickFeaturesPreviewFromSubclass(s: SubclassIn): string[] {
    const feats = Array.isArray(s.features) ? s.features : [];
    const names: string[] = [];

    for (const f of feats) {
        if ("name" in f && typeof (f as any).name === "string" && (f as any).name.trim()) {
            names.push((f as any).name.trim());
        }
        if ("features" in f && Array.isArray((f as any).features)) {
            for (const inner of (f as any).features as Array<{ name?: string }>) {
                if (inner?.name && inner.name.trim()) names.push(inner.name.trim());
                if (names.length >= 3) break;
            }
        }
        if (names.length >= 3) break;
    }

    return names.slice(0, 3);
}

function pickFeaturesByLevel(c: ClassIn): unknown {
    if (c.featuresByLevel) return c.featuresByLevel;
    if (Array.isArray(c.features)) return c.features; // fallback legado
    return []; // coluna é NOT NULL
}

function toSubclassData(s: SubclassIn): Record<string, unknown> {
    return {
        grantedSpells: s.grantedSpells ?? null,
        canalizarOptions: s.canalizarOptions ?? null,
        features: s.features ?? null,
    };
}

/* ----------------- seeds de tabelas base ----------------- */

async function seedAncestries() {
    const items = load<unknown[]>("ancestries.json");
    await prisma.ancestry.createMany({ data: items as Prisma.AncestryCreateManyInput[], skipDuplicates: true });
    console.log(`✅ Ancestries: ${items.length} ok`);
}

async function seedBackgrounds() {
    const items = load<unknown[]>("backgrounds.json");
    await prisma.background.createMany({ data: items as Prisma.BackgroundCreateManyInput[], skipDuplicates: true });
    console.log(`✅ Backgrounds: ${items.length} ok`);
}

/* ----------------- upserts ----------------- */

async function upsertClass(c: ClassIn) {
    await prisma.class.upsert({
        where: { id: c.id },
        create: {
            id: c.id,
            name: c.name,
            hitDie: c.hitDie,
            profs: asJson(c.profs ?? {}),
            featuresByLevel: asJson(pickFeaturesByLevel(c)),
            spellData: asJson(c.spellData ?? null),
            description: c.description ?? "",
            metaJson: asJson(c.metaJson ?? {}),
        },
        update: {
            name: c.name,
            hitDie: c.hitDie,
            profs: asJson(c.profs ?? {}),
            featuresByLevel: asJson(pickFeaturesByLevel(c)),
            spellData: asJson(c.spellData ?? null),
            description: c.description ?? "",
            metaJson: asJson(c.metaJson ?? {}),
        },
    });
}

async function upsertSubclass(classId: string, s: SubclassIn) {
    const rawSlug = (s.slug?.trim() || s.id?.trim() || s.name || "").toString();
    const slug = (() => {
        const base = rawSlug
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        return base || randomUUID();
    })();

    const baseMeta: SubclassMetaIn = isRecord(s.metaJson) ? (s.metaJson as SubclassMetaIn) : {};

    const computedFeaturesPreview =
        Array.isArray(baseMeta.featuresPreview) && baseMeta.featuresPreview.length > 0
            ? baseMeta.featuresPreview
            : pickFeaturesPreviewFromSubclass(s);

    const computedAliases =
        Array.isArray(baseMeta.aliases) && baseMeta.aliases.length > 0
            ? baseMeta.aliases
            : (s.id ? [s.id] : []);

    const metaToSave: SubclassMetaIn = {
        ...baseMeta,
        featuresPreview: computedFeaturesPreview,
        aliases: computedAliases,
    };

    const description = synthesizeSubclassDescription(s.name, s.description);

    await prisma.subclass.upsert({
        where: { slug },
        create: {
            classId,
            slug,
            name: s.name,
            description,
            metaJson: asJson(metaToSave),
            data: asJson(toSubclassData(s)), // NOT NULL
        },
        update: {
            classId,
            name: s.name,
            description,
            metaJson: asJson(metaToSave),
            data: asJson(toSubclassData(s)),
        },
    });
}

type LoreFile = {
    id?: string;
    classId?: string;            // se vier, ótimo
    className?: string;          // opcional: permite apontar por nome
    locale: string;
    version?: number;
    title: string;
    tagline?: string;
    readingTimeMin?: number;     // ← mapeia p/ readingMin (DB)
    display?: unknown;
    summary: string;
    chapters?: unknown;
    timeline?: unknown;
    rituals?: unknown;
    locations?: unknown;
    gameplay?: unknown;
    ui?: unknown;
    attribution?: unknown;
    publishedAt?: string | null; // ISO opcional
};

function filenameToSlugName(fileBasename: string): { slug: string; locale?: string } {
    // exemplos aceitos:
    // lore-guardiao-de-artheon.pt-BR.json
    // guardiao-de-artheon.pt-BR.json
    // arauto-de-elyra.json
    const base = fileBasename.replace(/\.json$/i, "");
    const parts = base.split(".");
    const namePart = parts[0] ?? base;
    const slug = namePart.replace(/^lore-/, ""); // remove prefixo "lore-" se houver
    const locale = parts[1]; // se houver sufixo .pt-BR
    return { slug, locale };
}

async function findClassIdForLore(lf: LoreFile, fileName: string): Promise<string> {
    if (lf.classId) return lf.classId;

    // 1) se veio className no JSON, tenta por nome
    if (lf.className) {
        const byName = await prisma.class.findFirst({
            where: { name: { equals: lf.className, mode: "insensitive" } },
            select: { id: true },
        });
        if (byName) return byName.id;
    }

    // 2) tentar pela slug do arquivo
    const { slug } = filenameToSlugName(basename(fileName));
    if (slug) {
        // tenta achar classe cujo name normalizado contenha a slug
        const all = await prisma.class.findMany({ select: { id: true, name: true } });
        const norm = (s: string) =>
            s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const match = all.find(c => norm(c.name).includes(slug));
        if (match) return match.id;
    }

    throw new Error(`Não foi possível deduzir classId para lore: ${fileName}. Informe "classId" ou "className" no JSON.`);
}

async function upsertClassLoreFromFile(file: string) {
    const lore = load<LoreFile>(file);
    const classId = await findClassIdForLore(lore, file);
    const version = lore.version ?? 1;

    await prisma.classLore.upsert({
        where: { classId_locale_version: { classId, locale: lore.locale, version } },
        create: {
            classId,
            locale: lore.locale,
            version,
            title: lore.title,
            tagline: lore.tagline ?? null,
            readingMin: lore.readingTimeMin ?? null, // ← coluna do modelo
            display: toJsonOrUndef(lore.display),
            summary: lore.summary,
            chapters: toJsonOrUndef(lore.chapters),
            timeline: toJsonOrUndef(lore.timeline),
            rituals: toJsonOrUndef(lore.rituals),
            locations: toJsonOrUndef(lore.locations),
            gameplay: toJsonOrUndef(lore.gameplay),
            ui: toJsonOrUndef(lore.ui),
            attribution: toJsonOrUndef(lore.attribution),
            publishedAt: lore.publishedAt ? new Date(lore.publishedAt) : null,
        },
        update: {
            title: lore.title,
            tagline: lore.tagline ?? null,
            readingMin: lore.readingTimeMin ?? null,
            display: toJsonOrUndef(lore.display),
            summary: lore.summary,
            chapters: toJsonOrUndef(lore.chapters),
            timeline: toJsonOrUndef(lore.timeline),
            rituals: toJsonOrUndef(lore.rituals),
            locations: toJsonOrUndef(lore.locations),
            gameplay: toJsonOrUndef(lore.gameplay),
            ui: toJsonOrUndef(lore.ui),
            attribution: toJsonOrUndef(lore.attribution),
            publishedAt: lore.publishedAt ? new Date(lore.publishedAt) : null,
        },
    });

    console.log(`✅ ClassLore: ${lore.title} (${lore.locale} v${version}) ok`);
}

/** Importa TODOS os JSONs de seed/lore/*.json */
async function upsertAllLoresFromDir() {
    const dir = fromSeedDir("lore");
    let files: string[] = [];
    try {
        files = (await fsp.readdir(dir)).filter(f => f.endsWith(".json"));
    } catch {
        console.log("ℹ️  Pasta seed/lore não encontrada — pulando.");
        return;
    }

    if (files.length === 0) {
        console.log("ℹ️  Nenhum arquivo de lore em seed/lore — pulando.");
        return;
    }

    for (const f of files) {
        await upsertClassLoreFromFile(`lore/${f}`);
    }
}

/* ----------------- orquestração ----------------- */

async function seedClassesAndSubclasses() {
    const classes = load<ClassIn[]>("classes.json");
    for (const c of classes) {
        await upsertClass(c);
        for (const s of c.subclasses ?? []) {
            await upsertSubclass(c.id, s);
        }
    }
    console.log(`✅ Classes & Subclasses: ${classes.length} classes ok`);
}

async function main() {
    await seedAncestries();
    await seedBackgrounds();
    await seedClassesAndSubclasses();
    await upsertAllLoresFromDir(); // ← importa TODOS os lores (inclui guardião de Artheon)
    console.log("🌱 Seed concluído.");
}

main()
    .catch((e) => {
        console.error("❌ Seed falhou:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
