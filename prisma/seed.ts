// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

/* ----------------- helpers gerais ----------------- */

const asJson = (v: unknown): Prisma.InputJsonValue => v as Prisma.InputJsonValue;
const fromSeedDir = (file: string) => resolve(__dirname, "seed", file);
const load = <T>(file: string): T =>
    JSON.parse(readFileSync(fromSeedDir(file), "utf-8")) as T;

const isRecord = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === "object" && !Array.isArray(v);

/* ----------------- tipos de entrada (seeds) ----------------- */

type HitDie = "d6" | "d8" | "d10" | "d12";

type SubclassMetaIn = {
    featuresPreview?: string[];
    aliases?: string[];
    // permitir extras sem perder type-safety em spreads
    [key: string]: unknown;
};

type SubclassFeatureLeaf = { level?: number; id?: string; name?: string; text?: string };
type SubclassFeatureNode = { name?: string; features?: Array<{ name?: string }> };

/** Estruturas aceitas para "features" da subclasse (lista plana ou agrupada por nível) */
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
    /** novo */
    featuresByLevel?: unknown;
    /** legado (fallback): */
    features?: unknown;
    /** subclasses embutidas no classes.json */
    subclasses?: SubclassIn[];
};

/* ----------------- utils de síntese ----------------- */

const slugify = (s: string) =>
    s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

function synthesizeSubclassDescription(name?: string, fallback?: string): string {
    if (fallback && fallback.trim()) return fallback.trim();
    if (!name) return "Subclasse.";
    return `Caminho ${name}: estilo de jogo e poderes temáticos.`;
}

/** Extrai até 3 “bullets” de features: aceita lista plana ou nós com `.features` internas */
function pickFeaturesPreviewFromSubclass(s: SubclassIn): string[] {
    const feats = Array.isArray(s.features) ? s.features : [];
    const names: string[] = [];

    // varrer as duas formas
    for (const f of feats) {
        // caso lista plana (tem "name" direta)
        if ("name" in f && typeof f.name === "string" && f.name.trim()) {
            names.push(f.name.trim());
        }
        // caso nó com filhos (f.features[].name)
        if ("features" in f && Array.isArray(f.features)) {
            for (const inner of f.features) {
                if (inner?.name && typeof inner.name === "string" && inner.name.trim()) {
                    names.push(inner.name.trim());
                }
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

/** Empacote dados “ricos” para Subclass.data */
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
        const base =
            rawSlug
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        return base || randomUUID();
    })();

    // meta base (com guard)
    const baseMeta: SubclassMetaIn = isRecord(s.metaJson) ? (s.metaJson as SubclassMetaIn) : {};

    const computedFeaturesPreview =
        Array.isArray(baseMeta.featuresPreview) && baseMeta.featuresPreview.length > 0
            ? baseMeta.featuresPreview
            : pickFeaturesPreviewFromSubclass(s);

    const computedAliases =
        Array.isArray(baseMeta.aliases) && baseMeta.aliases.length > 0
            ? baseMeta.aliases
            : (s.id ? [s.id] : []);

    // objeto tipado (sem any, com spread seguro)
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
            data: asJson(toSubclassData(s)), // NOT NULL
        },
    });
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
