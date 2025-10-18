// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

// helpers
const asJson = (v: unknown): Prisma.InputJsonValue => v as Prisma.InputJsonValue;
const fromSeedDir = (file: string) => resolve(__dirname, "seed", file);
const load = <T = unknown>(file: string): T =>
    JSON.parse(readFileSync(fromSeedDir(file), "utf-8")) as T;

type ClassIn = {
    id: string;
    name: string;
    hitDie: "d6" | "d8" | "d10" | "d12";
    profs: unknown;
    spellData?: unknown | null;
    description: string;
    metaJson?: unknown;
    featuresByLevel?: unknown; // novo
    // legado (se existir no json antigo, usamos como fallback):
    features?: unknown;

    // Agora as subclasses vêm DENTRO de classes.json:
    subclasses?: Array<{
        id?: string;    // pode virar slug
        slug?: string;  // preferir se existir
        name: string;
        description?: string;
        metaJson?: unknown;
        grantedSpells?: unknown;
        canalizarOptions?: unknown;
        features?: unknown; // features por nível da subclasse
    }>;
};

const slugify = (s: string) =>
    s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

function pickFeaturesByLevel(c: ClassIn): unknown {
    if (c.featuresByLevel) return c.featuresByLevel;
    if (Array.isArray(c.features)) return c.features; // fallback legado
    return []; // coluna é NOT NULL, nunca deixe vazio
}

function toSubclassData(s: NonNullable<ClassIn["subclasses"]>[number]) {
    // Tudo “rico” vai para Subclass.data
    return {
        grantedSpells: s.grantedSpells ?? null,
        canalizarOptions: s.canalizarOptions ?? null,
        features: s.features ?? null,
    };
}

async function seedAncestries() {
    const items = load<any[]>("ancestries.json");
    await prisma.ancestry.createMany({ data: items, skipDuplicates: true });
    console.log(`✅ Ancestries: ${items.length} ok`);
}

async function seedBackgrounds() {
    const items = load<any[]>("backgrounds.json");
    await prisma.background.createMany({ data: items, skipDuplicates: true });
    console.log(`✅ Backgrounds: ${items.length} ok`);
}

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

async function upsertSubclass(classId: string, s: NonNullable<ClassIn["subclasses"]>[number]) {
    const slug = (s.slug?.trim() || s.id?.trim() || slugify(s.name));
    await prisma.subclass.upsert({
        where: { slug },
        create: {
            classId,
            slug,
            name: s.name,
            description: s.description ?? "",
            metaJson: asJson(s.metaJson ?? {}),
            data: asJson(toSubclassData(s)), // NOT NULL
        },
        update: {
            classId,
            name: s.name,
            description: s.description ?? "",
            metaJson: asJson(s.metaJson ?? {}),
            data: asJson(toSubclassData(s)), // NOT NULL
        },
    });
}

async function seedClassesAndSubclasses() {
    const classes = load<ClassIn[]>("classes.json");
    for (const c of classes) {
        await upsertClass(c);
        for (const s of (c.subclasses ?? [])) {
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
