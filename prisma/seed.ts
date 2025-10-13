// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();
const load = <T = unknown>(p: string): T =>
    JSON.parse(readFileSync(resolve(process.cwd(), p), "utf-8")) as T;

// -----------------------
// Helpers para JSON (Prisma)
// -----------------------
const JN = Prisma.JsonNull; // JSON NULL (para campos JSON opcionais)
const asJson = (v: unknown): Prisma.InputJsonValue =>
    (v ?? {}) as Prisma.InputJsonValue; // para JSON obrigatórios (não enviar null)
const asJsonOrNull = (
    v: unknown
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput =>
    v === null || v === undefined ? JN : (v as Prisma.InputJsonValue);

// -----------------------
// Tipos esperados nos JSONs
// -----------------------
type ClassJson = {
    id: string;
    name: string;
    hitDie?: string;
    profs?: unknown;
    features?: unknown;
    spellData?: unknown | null;
    description?: string; // será usado na coluna ou salvo dentro do metaJson.description (fallback)
    metaJson?: Record<string, unknown>; // UI: role/hitDie/abilities/assets/etc
};

type SubclassJson = {
    slug: string;
    classId: string;
    name: string;
    description: string;
    metaJson: unknown;
};

// -----------------------
// Util: checar colunas no banco (runtime)
// -----------------------
async function tableHasColumn(table: string, column: string): Promise<boolean> {
    // Postgres guarda o nome exato; Prisma usa aspas e case-preserving.
    // Vamos checar ambas as possibilidades (Class vs class) com OR.
    const rows = await prisma.$queryRawUnsafe<{ exists: boolean }[]>(
        `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND (table_name = $1 OR table_name = $2)
        AND column_name = $3
    ) AS "exists";
  `,
        table,
        table.toLowerCase(),
        column
    );
    return Boolean(rows?.[0]?.exists);
}

async function detectClassColumns() {
    const hasDescription = await tableHasColumn("Class", "description");
    const hasMetaJson = await tableHasColumn("Class", "metaJson");
    return { hasDescription, hasMetaJson };
}

// -----------------------
// Seeds
// -----------------------
async function seedAncestries(ancestries: any[]) {
    for (const a of ancestries) {
        await prisma.ancestry.upsert({
            where: { id: a.id },
            update: {
                name: a.name,
                shortLore: a.shortLore,
                size: a.size,
                speed: a.speed,
                bonuses: asJson(a.bonuses),
                traits: asJson(a.traits),
                languages: a.languages,
            },
            create: {
                id: a.id,
                name: a.name,
                shortLore: a.shortLore,
                size: a.size,
                speed: a.speed,
                bonuses: asJson(a.bonuses),
                traits: asJson(a.traits),
                languages: a.languages,
            },
        });
    }
    console.log(`✅ Ancestries: ${ancestries.length} ok`);
}

async function seedBackgrounds(backgrounds: any[]) {
    for (const b of backgrounds) {
        await prisma.background.upsert({
            where: { id: b.id },
            update: {
                name: b.name,
                profs: asJson(b.profs),
                equipment: asJsonOrNull(b.equipment ?? null),
                traits: asJsonOrNull(b.traits ?? null),
            },
            create: {
                id: b.id,
                name: b.name,
                profs: asJson(b.profs),
                equipment: asJsonOrNull(b.equipment ?? null),
                traits: asJsonOrNull(b.traits ?? null),
            },
        });
    }
    console.log(`✅ Backgrounds: ${backgrounds.length} ok`);
}

async function seedClasses(classes: ClassJson[]) {
    const { hasDescription, hasMetaJson } = await detectClassColumns();

    for (const c of classes) {
        const existing = await prisma.class.findUnique({ where: { id: c.id } });

        const nextHitDie = c.hitDie ?? (existing as any)?.hitDie ?? "d8";
        const nextProfs = asJson(c.profs ?? (existing as any)?.profs ?? {});
        const nextFeatures = asJson(c.features ?? (existing as any)?.features ?? []);
        const nextSpellData = asJsonOrNull(
            c.spellData ?? (existing ? (existing as any).spellData ?? null : null)
        );

        // Monta objetos "dinâmicos" para não gerar TS2353:
        const updateData: any = {
            name: c.name,
            hitDie: nextHitDie,
            profs: nextProfs,
            features: nextFeatures,
            spellData: nextSpellData,
        };
        const createData: any = {
            id: c.id,
            name: c.name,
            hitDie: nextHitDie,
            profs: nextProfs,
            features: nextFeatures,
            spellData: nextSpellData,
        };

        // Se a coluna existir, atribui. Caso contrário, grava dentro do metaJson (fallback).
        // description:
        if (hasDescription) {
            updateData.description = c.description ?? (existing as any)?.description ?? "Sem descrição.";
            createData.description = c.description ?? "Sem descrição.";
        }

        // metaJson:
        const baseMeta = (c.metaJson ?? {}) as Record<string, unknown>;
        if (!hasDescription) {
            // coloca a description no meta, para a UI ter acesso.
            if (c.description && baseMeta.description == null) {
                baseMeta.description = c.description;
            }
        }

        if (hasMetaJson) {
            updateData.metaJson = asJson(
                Object.keys(baseMeta).length ? baseMeta : (existing as any)?.metaJson ?? {}
            );
            createData.metaJson = asJson(Object.keys(baseMeta).length ? baseMeta : {});
        }

        await prisma.class.upsert({
            where: { id: c.id },
            update: updateData as Prisma.ClassUpdateInput,
            create: createData as Prisma.ClassCreateInput,
        });
    }
    console.log(`✅ Classes: ${classes.length} ok`);
}

async function seedSubclasses(subclasses: SubclassJson[]) {
    for (const s of subclasses) {
        await prisma.subclass.upsert({
            where: { slug: s.slug },
            update: {
                classId: s.classId,
                name: s.name,
                description: s.description,
                metaJson: asJson(s.metaJson),
            },
            create: {
                slug: s.slug,
                classId: s.classId,
                name: s.name,
                description: s.description,
                metaJson: asJson(s.metaJson),
            },
        });
    }
    console.log(`✅ Subclasses: ${subclasses.length} ok`);
}

// -----------------------
// Main
// -----------------------
async function main() {
    const ancestries = load<any[]>("prisma/seed/ancestries.json");
    const backgrounds = load<any[]>("prisma/seed/backgrounds.json");
    const classes = load<ClassJson[]>("prisma/seed/classes.json");
    const subclasses = load<SubclassJson[]>("prisma/seed/subclasses.json");

    await seedAncestries(ancestries);
    await seedBackgrounds(backgrounds);
    await seedClasses(classes);
    await seedSubclasses(subclasses);

    console.log("🌱 Seed OK (merge-safe).");
}

main()
    .catch((e) => {
        console.error("❌ Seed falhou:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
